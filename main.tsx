import { createRoot, hydrateRoot } from 'react-dom/client';
import App, { applyHead } from './App';
import { matchRoute, normalizePath } from './router';
import { loaders } from './pages';
import { buildMeta } from './seo';

async function start() {
  const el = document.getElementById('root')!;
  const path = normalizePath(window.location.pathname);
  const route = matchRoute(path);
  // Ladataan nykyisen sivun chunk ennen hydraatiota, jotta DOM vastaa esirenderöityä HTML:ää.
  const mod = await loaders[route.name]();
  const app = <App initialPath={path} initialRoute={route} initialPage={mod.default} />;
  if (el.firstElementChild) {
    hydrateRoot(el, app);
  } else {
    applyHead(buildMeta(route));
    createRoot(el).render(app);
  }
}

start();
