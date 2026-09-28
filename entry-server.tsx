// SSR-/esirenderöinti-entry. build.mjs kutsuu render()-funktiota jokaiselle reitille
// ja kirjoittaa tuloksen staattiseksi HTML:ksi (hyvä SEO + nopea ensimmäinen näkymä).
import { renderToString } from 'react-dom/server';
import App from './App';
import { matchRoute, normalizePath } from './router';
import { buildMeta } from './seo';
import { getGpus, gpuPath } from './dataService';
import { articles } from './articles';
import type { PageModule } from './pages';
import type { RouteName } from './router';

import * as Home from './PageHome';
import * as GpuList from './PageGpuList';
import * as GpuPage from './PageGpu';
import * as Compare from './PageCompare';
import * as Prices from './PagePrices';
import * as Generations from './PageGenerations';
import * as Guides from './PageGuides';
import * as ArticlePage from './PageArticle';
import * as Info from './PageInfo';
import * as NotFound from './PageNotFound';

const pages: Record<RouteName, PageModule> = {
  home: Home,
  gpuList: GpuList,
  brand: GpuList,
  gpu: GpuPage,
  compare: Compare,
  prices: Prices,
  generations: Generations,
  guides: Guides,
  article: ArticlePage,
  about: Info,
  sources: Info,
  privacy: Info,
  notFound: NotFound,
};

export function render(pathname: string) {
  const path = normalizePath(pathname);
  const route = matchRoute(path);
  const Page = pages[route.name].default;
  const html = renderToString(<App initialPath={path} initialRoute={route} initialPage={Page} />);
  return { html, meta: buildMeta(route), route };
}

/** Kaikki esirenderöitävät polut + sivukartan tiedot. */
export function allPaths(): { path: string; sitemap: boolean; priority: string; changefreq: string; pageModule: string }[] {
  const out = [
    { path: '/', sitemap: true, priority: '1.0', changefreq: 'daily', pageModule: 'PageHome' },
    { path: '/naytonohjaimet', sitemap: true, priority: '0.9', changefreq: 'daily', pageModule: 'PageGpuList' },
    { path: '/naytonohjaimet/nvidia', sitemap: true, priority: '0.8', changefreq: 'daily', pageModule: 'PageGpuList' },
    { path: '/naytonohjaimet/amd', sitemap: true, priority: '0.8', changefreq: 'daily', pageModule: 'PageGpuList' },
    { path: '/naytonohjaimet/intel', sitemap: true, priority: '0.8', changefreq: 'daily', pageModule: 'PageGpuList' },
    { path: '/nvidia', sitemap: false, priority: '', changefreq: '', pageModule: 'PageGpuList' },
    { path: '/amd', sitemap: false, priority: '', changefreq: '', pageModule: 'PageGpuList' },
    { path: '/intel', sitemap: false, priority: '', changefreq: '', pageModule: 'PageGpuList' },
    { path: '/vertaa', sitemap: true, priority: '0.8', changefreq: 'weekly', pageModule: 'PageCompare' },
    { path: '/hintakehitys', sitemap: true, priority: '0.9', changefreq: 'daily', pageModule: 'PagePrices' },
    { path: '/sukupolvet', sitemap: true, priority: '0.7', changefreq: 'monthly', pageModule: 'PageGenerations' },
    { path: '/oppaat', sitemap: true, priority: '0.7', changefreq: 'weekly', pageModule: 'PageGuides' },
    { path: '/tietoa', sitemap: true, priority: '0.3', changefreq: 'yearly', pageModule: 'PageInfo' },
    { path: '/lahteet', sitemap: true, priority: '0.4', changefreq: 'monthly', pageModule: 'PageInfo' },
    { path: '/tietosuoja', sitemap: true, priority: '0.2', changefreq: 'yearly', pageModule: 'PageInfo' },
  ];
  for (const g of getGpus()) out.push({ path: gpuPath(g), sitemap: true, priority: '0.9', changefreq: 'daily', pageModule: 'PageGpu' });
  for (const a of articles) out.push({ path: `/oppaat/${a.slug}`, sitemap: true, priority: '0.6', changefreq: 'monthly', pageModule: 'PageArticle' });
  return out;
}
