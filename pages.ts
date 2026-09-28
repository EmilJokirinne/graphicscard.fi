import type { ComponentType } from 'react';
import type { Route, RouteName } from './router';

export type PageProps = { route: Route };
export type PageModule = { default: ComponentType<PageProps> };

// Code splitting: jokainen sivutyyppi on oma chunkinsa, joka ladataan vasta kun sitä tarvitaan.
export const loaders: Record<RouteName, () => Promise<PageModule>> = {
  home: () => import('./PageHome'),
  gpuList: () => import('./PageGpuList'),
  brand: () => import('./PageGpuList'),
  gpu: () => import('./PageGpu'),
  compare: () => import('./PageCompare'),
  prices: () => import('./PagePrices'),
  generations: () => import('./PageGenerations'),
  guides: () => import('./PageGuides'),
  article: () => import('./PageArticle'),
  about: () => import('./PageInfo'),
  sources: () => import('./PageInfo'),
  privacy: () => import('./PageInfo'),
  notFound: () => import('./PageNotFound'),
};
