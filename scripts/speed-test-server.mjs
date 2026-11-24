// Run behind HTTPS on a dedicated measurement host with compression and buffering disabled.
import { randomBytes } from 'node:crypto';
import { createServer } from 'node:http';

const MiB = 1024 ** 2;
const payload = randomBytes(MiB);
const allowedOrigins = new Set((process.env.SPEED_TEST_ORIGINS ?? 'https://navorika.com').split(','));
const maxTransfers = Number(process.env.SPEED_TEST_CONCURRENCY ?? 8);
if (!Number.isInteger(maxTransfers) || maxTransfers < 1) throw new Error('Invalid transfer concurrency');
let activeTransfers = 0;

const server = createServer(async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-transform');
  res.setHeader('Vary', 'Origin');
  const origin = req.headers.origin;
  if (!allowedOrigins.has(origin)) {
    res.writeHead(403).end();
    return;
  }
  res.setHeader('Access-Control-Allow-Origin', origin);
  let url;
  try {
    url = new URL(req.url, 'http://localhost');
  } catch {
    res.writeHead(400).end();
    return;
  }
  if (req.method === 'GET' && url.pathname === '/ping') {
    res.writeHead(204).end();
    return;
  }

  const download = req.method === 'GET' && url.pathname === '/download';
  const upload = req.method === 'POST' && url.pathname === '/upload';
  if (!download && !upload) {
    res.writeHead(404).end();
    return;
  }

  const bytes = Number(download ? url.searchParams.get('bytes') : req.headers['content-length']);
  if (!Number.isSafeInteger(bytes) || bytes < 128 * 1024 || bytes > (download ? 64 : 16) * MiB) {
    res.writeHead(400, { Connection: 'close' }).end();
    return;
  }
  if (activeTransfers >= maxTransfers) {
    res.writeHead(503, { Connection: 'close', 'Retry-After': '10' }).end();
    return;
  }

  activeTransfers++;
  res.once('close', () => { activeTransfers--; });
  const deadline = setTimeout(() => res.destroy(), 16_000);
  res.once('close', () => clearTimeout(deadline));
  try {
    if (download) {
      res.writeHead(200, { 'Content-Type': 'application/octet-stream', 'Content-Length': bytes });
      for (let sent = 0; sent < bytes && !res.destroyed; sent += payload.length) {
        if (!res.write(payload.subarray(0, bytes - sent))) {
          // Writable streams release this wait on disconnect as well as on drain.
          await new Promise((resolve) => {
            function done() {
              res.off('drain', done);
              res.off('close', done);
              resolve();
            }
            res.once('drain', done);
            res.once('close', done);
          });
        }
      }
      res.end();
    } else {
      let received = 0;
      for await (const chunk of req) received += chunk.length;
      res.writeHead(received === bytes ? 204 : 400).end();
    }
  } catch {
    res.destroy();
  }
});

server.listen(Number(process.env.SPEED_TEST_PORT ?? 9120), '127.0.0.1');
