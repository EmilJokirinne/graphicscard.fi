// graphicscard.fi – build
//   node build.mjs        tuotantobuild: esbuild (code splitting) + esirenderöinti jokaiselle reitille -> dist/
//   node build.mjs --dev  kehityspalvelin http://localhost:5173 (automaattinen uudelleenbuild)
import * as esbuild from 'esbuild';
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';

const DEV = process.argv.includes('--dev');
const OUT = 'dist';
const SITE_URL = 'https://graphicscard.fi';
const STATIC_FILES = ['favicon.svg', 'robots.txt', '.htaccess', '_headers', 'og-image.png'];

const common = {
  bundle: true,
  jsx: 'automatic',
  loader: { '.json': 'json' },
  logLevel: 'warning',
  legalComments: 'none',
};

const clientOptions = {
  ...common,
  entryPoints: ['main.tsx', 'styles.css'],
  outdir: join(OUT, 'assets'),
  splitting: true,
  format: 'esm',
  target: ['es2020', 'safari15'],
  entryNames: '[name]-[hash]',
  chunkNames: '[name]-[hash]',
  minify: !DEV,
  sourcemap: DEV,
  metafile: true,
  define: { 'process.env.NODE_ENV': JSON.stringify(DEV ? 'development' : 'production') },
};

const escapeJson = (o) => JSON.stringify(o).replace(/</g, '\\u003c');
const escAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function assetsFromMeta(meta) {
  const outputs = Object.entries(meta.outputs);
  const find = (entry) => outputs.find(([, o]) => o.entryPoint === entry)?.[0];
  const url = (p) => '/' + p.replace(/^dist\//, '').replace(/\\/g, '/');
  const main = find('main.tsx');
  const css = find('styles.css');
  // Staattiset importit (jaetut chunkit) modulepreloadia varten
  const deps = (file, seen = new Set()) => {
    for (const imp of meta.outputs[file]?.imports ?? []) {
      if (imp.kind === 'import-statement' && !seen.has(imp.path)) {
        seen.add(imp.path);
        deps(imp.path, seen);
      }
    }
    return seen;
  };
  const pageChunk = (name) => {
    const f = find(`${name}.tsx`);
    return f ? [f, ...deps(f)] : [];
  };
  return { main: url(main), mainDeps: [...deps(main)].map(url), css: url(css), pageChunk: (n) => pageChunk(n).map(url) };
}

function template({ css, scripts, preload = [], head = '', app = '' }) {
  return `<!doctype html>
<html lang="fi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${head}
<meta name="theme-color" content="#0a0b0d">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${css}">
${preload.map((p) => `<link rel="modulepreload" href="${p}">`).join('\n')}
</head>
<body>
<div id="root">${app}</div>
<script type="module" src="${scripts}"></script>
</body>
</html>
`;
}

function headTags(meta) {
  return [
    `<title>${escAttr(meta.title)}</title>`,
    `<meta name="description" content="${escAttr(meta.description)}">`,
    `<meta name="robots" content="${meta.robots ?? 'index,follow'}">`,
    `<link rel="canonical" href="${meta.canonical}">`,
    `<meta property="og:site_name" content="graphicscard.fi">`,
    `<meta property="og:locale" content="fi_FI">`,
    `<meta property="og:type" content="${meta.ogType}">`,
    `<meta property="og:title" content="${escAttr(meta.title)}">`,
    `<meta property="og:description" content="${escAttr(meta.description)}">`,
    `<meta property="og:url" content="${meta.canonical}">`,
    `<meta property="og:image" content="${SITE_URL}/og-image.png">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    ...meta.jsonLd.map((ld) => `<script type="application/ld+json" data-seo>${escapeJson(ld)}</script>`),
  ].join('\n');
}

function copyStatic() {
  for (const f of STATIC_FILES) if (existsSync(f)) copyFileSync(f, join(OUT, f));
}

async function production() {
  rmSync(OUT, { recursive: true, force: true });
  rmSync('dist-ssr', { recursive: true, force: true });
  const client = await esbuild.build(clientOptions);
  const assets = assetsFromMeta(client.metafile);

  await esbuild.build({
    ...common,
    entryPoints: ['entry-server.tsx'],
    outfile: 'dist-ssr/entry-server.mjs',
    platform: 'node',
    format: 'esm',
    packages: 'external',
    define: { 'process.env.NODE_ENV': '"production"' },
  });
  const ssr = await import(pathToFileURL(join(process.cwd(), 'dist-ssr/entry-server.mjs')).href + `?t=${Date.now()}`);

  const paths = ssr.allPaths();
  const urls = [];
  for (const p of paths) {
    const { html, meta } = ssr.render(p.path);
    const preload = [...assets.mainDeps, ...assets.pageChunk(p.pageModule)];
    const file = p.path === '/' ? join(OUT, 'index.html') : join(OUT, p.path, 'index.html');
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, template({ css: assets.css, scripts: assets.main, preload: [...new Set(preload)], head: headTags(meta), app: html }));
    if (p.sitemap) urls.push(p);
  }
  // 404
  {
    const { html, meta } = ssr.render('/__404__');
    writeFileSync(join(OUT, '404.html'), template({ css: assets.css, scripts: assets.main, preload: assets.pageChunk('PageNotFound'), head: headTags(meta), app: html }));
  }
  // Sivukartta
  const lastmod = JSON.parse(readFileSync('prices-summary.json', 'utf8')).meta.generatedAt;
  writeFileSync(
    join(OUT, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      urls
        .map((u) => `  <url><loc>${SITE_URL}${u.path === '/' ? '/' : u.path}</loc><lastmod>${lastmod}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`)
        .join('\n') +
      `\n</urlset>\n`,
  );
  copyStatic();
  rmSync('dist-ssr', { recursive: true, force: true });

  const js = Object.entries(client.metafile.outputs).filter(([k]) => k.endsWith('.js'));
  const mainSize = client.metafile.outputs[assets.main.slice(1).replace(/^/, 'dist/')]?.bytes;
  console.log(`✓ ${paths.length + 1} sivua esirenderöity, ${js.length} JS-chunkia (main ${Math.round((mainSize ?? 0) / 1024)} kt) -> ${OUT}/`);
}

async function dev() {
  const { serve } = await import('./serve.mjs');
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });
  copyStatic();
  const plugin = {
    name: 'html',
    setup(build) {
      build.onEnd((res) => {
        if (!res.metafile) return;
        const a = assetsFromMeta(res.metafile);
        writeFileSync(join(OUT, 'index.html'), template({ css: a.css, scripts: a.main, head: '<title>graphicscard.fi</title>\n<link rel="canonical" href="">' }));
        console.log('↻ build valmis', new Date().toLocaleTimeString('fi-FI'));
      });
    },
  };
  const ctx = await esbuild.context({ ...clientOptions, plugins: [plugin] });
  await ctx.watch();
  serve(OUT, 5173, { spa: true });
}

(DEV ? dev() : production()).catch((e) => {
  console.error(e);
  process.exit(1);
});
