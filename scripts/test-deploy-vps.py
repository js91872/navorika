"""Exercise deployment orchestration with local Git repositories and mocked services."""
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

DEPLOY = Path(__file__).with_name('deploy-vps.sh').resolve()


class DeploymentTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='navorika-deploy-test-')
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.env = dict(os.environ, GIT_AUTHOR_NAME='Deploy Test',
                        GIT_AUTHOR_EMAIL='test@example.invalid',
                        GIT_COMMITTER_NAME='Deploy Test',
                        GIT_COMMITTER_EMAIL='test@example.invalid')
        self.source = self.root / 'source'
        self.source.mkdir()
        self.git(self.source, 'init', '-b', 'main')
        (self.source / '.gitignore').write_text('.next/\nnode_modules/\n.env*\n')
        (self.source / 'release-source.txt').write_text('old-source')
        self.git(self.source, 'add', '.')
        self.git(self.source, 'commit', '-m', 'Old release')
        self.old = self.git(self.source, 'rev-parse', 'HEAD')
        (self.source / 'release-source.txt').write_text('new-source')
        self.git(self.source, 'commit', '-am', 'New release')
        self.target = self.git(self.source, 'rev-parse', 'HEAD')
        self.app = self.root / 'app'
        self.git(self.root, 'clone', str(self.source), str(self.app))
        self.git(self.app, 'reset', '--hard', self.old)
        for name, value in [('.next', 'old-build'), ('node_modules', 'old-deps')]:
            (self.app / name).mkdir()
            (self.app / name / 'marker').write_text(value)
        (self.app / '.env.local').write_text('FIXTURE_ENV=available\n')
        self.bin = self.root / 'bin'
        self.bin.mkdir()
        self.log = self.root / 'services.log'
        self.stub('pm2', 'printf "%s\\n" "$*" >> "$TEST_SERVICE_LOG"\n')
        self.stub('curl', 'if [ "$TEST_FAILURE" = health ]; then exit 22; fi\nprintf "HTTP 200\\n"\n')
        self.stub('npm', '''
if [ "$1" = ci ]; then
  mkdir -p node_modules
  printf new-deps > node_modules/marker
elif [ "$1 $2" = "run build" ]; then
  test -f .env.local || exit 9
  if [ "$TEST_FAILURE" = build ]; then exit 7; fi
  mkdir -p .next
  printf new-build > .next/marker
fi
''')
        self.env.update(PATH=str(self.bin) + os.pathsep + self.env['PATH'],
                        NAVORIKA_APP_DIR=str(self.app),
                        NAVORIKA_BACKUP_ROOT=str(self.root / 'backups'),
                        TEST_SERVICE_LOG=str(self.log), TEST_FAILURE='')

    def git(self, cwd, *args):
        return subprocess.check_output(['git', *args], cwd=cwd, env=self.env,
                                       stderr=subprocess.DEVNULL, text=True).strip()

    def stub(self, name, body):
        path = self.bin / name
        path.write_text('#!/usr/bin/env bash\nset -eu\n' + body)
        path.chmod(0o755)

    def deploy(self, failure=''):
        return subprocess.run(['bash', str(DEPLOY), self.target], cwd=self.root,
                              env=dict(self.env, TEST_FAILURE=failure),
                              capture_output=True, text=True, timeout=30)

    def assert_old_release(self):
        self.assertEqual((self.app / 'release-source.txt').read_text(), 'old-source')
        self.assertEqual((self.app / '.next/marker').read_text(), 'old-build')
        self.assertEqual((self.app / 'node_modules/marker').read_text(), 'old-deps')
        self.assertEqual(self.git(self.app, 'rev-parse', 'HEAD'), self.old)

    def test_success_preserves_backup_and_installs_reviewed_release(self):
        result = self.deploy()
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertEqual(self.git(self.app, 'rev-parse', 'HEAD'), self.target)
        self.assertEqual((self.app / '.next/marker').read_text(), 'new-build')
        self.assertEqual((self.app / 'node_modules/marker').read_text(), 'new-deps')
        backup, = (self.root / 'backups').glob('release.*')
        self.assertEqual((backup / '.next/marker').read_text(), 'old-build')
        self.assertEqual((backup / 'node_modules/marker').read_text(), 'old-deps')
        self.assertEqual((backup / 'previous-commit').read_text().strip(), self.old)
        self.assertIn('save', self.log.read_text())

    def test_build_failure_leaves_live_release_running_and_unchanged(self):
        result = self.deploy('build')
        self.assertNotEqual(result.returncode, 0)
        self.assert_old_release()
        self.assertNotIn('stop navorika', self.log.read_text())

    def test_failed_health_check_restores_code_build_and_dependencies(self):
        result = self.deploy('health')
        self.assertNotEqual(result.returncode, 0)
        self.assert_old_release()
        self.assertIn('Rollback attempted', result.stdout)
        self.assertIn('restart navorika --update-env', self.log.read_text())


if __name__ == '__main__':
    unittest.main()
