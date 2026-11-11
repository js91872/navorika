import PageHelp from '@/components/seo/PageHelp';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}<PageHelp path="/tools/exif-metadata-remover" /></>;
}
