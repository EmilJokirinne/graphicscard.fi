// Kevyt staattinen palvelin esikatseluun: node serve.mjs dist 4173
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json',
};

export function serve(root, port, { spa = false } = {}) {
  const server = createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    let p = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '');
    let file = join(root, p);
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
    let status = 200;
    if (!existsSync(file)) {
      if (spa) file = join(root, 'index.html');
      else {
        status = 404;
        file = join(root, '404.html');
      }
    }
    const type = TYPES[extname(file)] ?? 'application/octet-stream';
    const cache = file.includes('/assets/') && !spa ? 'public, max-age=31536000, immutable' : 'no-cache';
    res.writeHead(status, { 'Content-Type': type, 'Cache-Control': cache });
    res.end(readFileSync(file));
  });
  server.listen(port, () => console.log(`→ http://localhost:${port}`));
  return server;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  serve(process.argv[2] ?? 'dist', Number(process.argv[3] ?? 4173));
}
