import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('out');
const types = { '.html': 'text/html; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.xml': 'application/xml', '.webp': 'image/webp', '.avif': 'image/avif', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json' };
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (pathname === '/__qa/') { response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex', 'Cache-Control': 'no-store' }); response.end(await readFile(resolve('tools/reach-qa.html'))); return; }
    let file = resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(root + sep)) { response.writeHead(403).end(); return; }
    if ((await stat(file)).isDirectory()) {
      if (!pathname.endsWith('/')) { response.writeHead(308, {Location: pathname + '/'}).end(); return; }
      file = resolve(file, 'index.html');
    }
    const content = await readFile(file);
    response.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(await readFile(resolve(root, '404.html')).catch(() => 'Page not found'));
  }
}).listen(4342, '127.0.0.1', () => console.log('Reach preview: http://127.0.0.1:4342/'));
