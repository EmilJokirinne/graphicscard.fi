import { createContext, useContext } from 'react';
import type { BrandSlug } from './types';
import { getGpu } from './dataService';
import { getArticle } from './articles';

export type Route =
  | { name: 'home' }
  | { name: 'gpuList' }
  | { name: 'brand'; brand: BrandSlug; alias: boolean }
  | { name: 'gpu'; brand: BrandSlug; slug: string }
  | { name: 'compare' }
  | { name: 'prices' }
  | { name: 'generations' }
  | { name: 'guides' }
  | { name: 'article'; slug: string }
  | { name: 'about' }
  | { name: 'sources' }
  | { name: 'privacy' }
  | { name: 'notFound' };

export type RouteName = Route['name'];

const BRANDS: BrandSlug[] = ['nvidia', 'amd', 'intel'];
const isBrand = (s: string): s is BrandSlug => (BRANDS as string[]).includes(s);

export function normalizePath(pathname: string): string {
  let p = decodeURI(pathname).toLowerCase();
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  if (p.endsWith('/index.html')) p = p.slice(0, -'/index.html'.length) || '/';
  return p || '/';
}

export function matchRoute(pathname: string): Route {
  const p = normalizePath(pathname);
  const parts = p.split('/').filter(Boolean);
  if (parts.length === 0) return { name: 'home' };
  const [a, b, c] = parts;
  if (a === 'naytonohjaimet') {
    if (parts.length === 1) return { name: 'gpuList' };
    if (parts.length === 2 && isBrand(b)) return { name: 'brand', brand: b, alias: false };
    if (parts.length === 3 && isBrand(b) && getGpu(b, c)) return { name: 'gpu', brand: b, slug: c };
    return { name: 'notFound' };
  }
  if (parts.length === 1) {
    if (isBrand(a)) return { name: 'brand', brand: a, alias: true };
    switch (a) {
      case 'vertaa': return { name: 'compare' };
      case 'hintakehitys': return { name: 'prices' };
      case 'sukupolvet': return { name: 'generations' };
      case 'oppaat': return { name: 'guides' };
      case 'tietoa': return { name: 'about' };
      case 'lahteet': return { name: 'sources' };
      case 'tietosuoja': return { name: 'privacy' };
    }
  }
  if (a === 'oppaat' && parts.length === 2 && getArticle(b)) return { name: 'article', slug: b };
  return { name: 'notFound' };
}

export interface NavState {
  pathname: string;
  /** location.search – tyhjä SSR:ssä ja ensimmäisessä renderöinnissä (hydraatio). */
  search: string;
  navigate: (href: string, opts?: { replace?: boolean; scroll?: boolean }) => void;
}

export const NavContext = createContext<NavState>({
  pathname: '/',
  search: '',
  navigate: () => {},
});

export const useNav = () => useContext(NavContext);
