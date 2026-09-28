// ---------------------------------------------------------------------------
// Datakerros. Kaikki komponentit hakevat datan TÄÄLTÄ – eivät suoraan tiedostoista.
//
// Nykyinen toteutus lukee paikallisia demo-tiedostoja. Oikean hintadatan
// kytkeminen:
//   1) Korvaa prices-summary.json ja prices-history.json samanmuotoisella datalla
//      (esim. ajastettu skripti, joka hakee hinnat ja ajaa buildin), TAI
//   2) Vaihda loadPriceHistory()/getPriceSummary() hakemaan API:sta.
//      Tyypit (types.ts) pysyvät samoina, joten käyttöliittymää ei tarvitse muuttaa.
// ---------------------------------------------------------------------------

import type { BrandSlug, Gpu, PricePoint, PriceSummary, Source } from './types';
import { gpus } from './gpus';
import { benchmarks } from './benchmarks';
import { sources, retailers } from './sources';
import summaryFile from './prices-summary.json';

export const DATA_UPDATED = summaryFile.meta.generatedAt; // ISO
export const PRICES_ARE_DEMO: boolean = summaryFile.meta.isDemo;
export const SITE_URL = 'https://graphicscard.fi';

const summaries = summaryFile.summary as Record<string, PriceSummary>;

export const BRANDS: { slug: BrandSlug; name: 'NVIDIA' | 'AMD' | 'Intel'; series: string; lead: string }[] = [
  {
    slug: 'nvidia',
    name: 'NVIDIA',
    series: 'GeForce RTX',
    lead: 'GeForce RTX -näytönohjaimet. Nykyinen sukupolvi on RTX 50 (Blackwell), jossa on GDDR7-näyttömuisti ja DLSS 4 -tuki.',
  },
  {
    slug: 'amd',
    name: 'AMD',
    series: 'Radeon RX',
    lead: 'Radeon RX -näytönohjaimet. Nykyinen sukupolvi on RX 9000 (RDNA 4), jossa on FSR 4 -kuvanskaalaus ja uudistettu säteenjäljitys.',
  },
  {
    slug: 'intel',
    name: 'Intel',
    series: 'Arc',
    lead: 'Intel Arc -näytönohjaimet. Arc B -sarja (Battlemage) keskittyy edulliseen hintaluokkaan ja tukee XeSS 2 -kuvanskaalausta.',
  },
];

export const getBrand = (slug: string) => BRANDS.find((b) => b.slug === slug);

export function getGpus(): Gpu[] {
  return gpus;
}

export function getGpusByBrand(brand: BrandSlug): Gpu[] {
  return gpus.filter((g) => g.brand === brand);
}

export function getGpu(brand: string, slug: string): Gpu | undefined {
  return gpus.find((g) => g.brand === brand && g.slug === slug);
}

export function getGpuById(id: string): Gpu | undefined {
  return gpus.find((g) => g.id === id);
}

export function getPopularGpus(): Gpu[] {
  return gpus.filter((g) => g.popular);
}

export function getPerformance(id: string): number | null {
  return benchmarks.find((b) => b.gpuId === id)?.index ?? null;
}

export function getPriceSummary(id: string): PriceSummary | null {
  return summaries[id] ?? null;
}

export function getSource(id: string): Source | undefined {
  return sources.find((s) => s.id === id);
}

export function getSources(): Source[] {
  return sources;
}

export function getRetailers() {
  return retailers;
}

export function gpuPath(g: Gpu): string {
  return `/naytonohjaimet/${g.brand}/${g.slug}`;
}

// Hintahistoria ladataan vasta tarvittaessa (oma chunk), jotta ensimmäinen lataus pysyy kevyenä.
let historyPromise: Promise<Record<string, PricePoint[]>> | null = null;

export function loadPriceHistory(): Promise<Record<string, PricePoint[]>> {
  if (!historyPromise) {
    historyPromise = import('./prices-history.json').then((m) => {
      const mod = m as unknown as { default?: { history: Record<string, PricePoint[]> }; history?: Record<string, PricePoint[]> };
      return (mod.default ?? mod).history as Record<string, PricePoint[]>;
    });
    // API-esimerkki:
    // historyPromise = fetch('/api/prices/history').then((r) => r.json());
  }
  return historyPromise;
}

// --- Johdetut luokitukset (perustuvat suorituskykyindeksiin, RTX 5080 = 100) ---

export type Level = 'Erittäin korkea' | 'Korkea' | 'Hyvä' | 'Kohtalainen' | 'Rajoitettu';

const LEVELS: Record<'1080p' | '1440p' | '4K', [number, Level][]> = {
  '1080p': [[60, 'Erittäin korkea'], [40, 'Korkea'], [30, 'Hyvä'], [22, 'Kohtalainen']],
  '1440p': [[80, 'Erittäin korkea'], [60, 'Korkea'], [45, 'Hyvä'], [32, 'Kohtalainen']],
  '4K': [[120, 'Erittäin korkea'], [85, 'Korkea'], [66, 'Hyvä'], [48, 'Kohtalainen']],
};

export function resolutionLevel(index: number, res: '1080p' | '1440p' | '4K'): Level {
  for (const [min, level] of LEVELS[res]) if (index >= min) return level;
  return 'Rajoitettu';
}

export function levelScore(level: Level): number {
  return { 'Erittäin korkea': 5, Korkea: 4, Hyvä: 3, Kohtalainen: 2, Rajoitettu: 1 }[level];
}

export function recommendedResolution(index: number): string {
  if (index >= 85) return '4K';
  if (index >= 55) return '1440p';
  return '1080p';
}

export function performanceClass(index: number): string {
  if (index >= 110) return 'Huippuluokka';
  if (index >= 80) return 'Yläluokka';
  if (index >= 50) return 'Keskiluokka';
  return 'Perusluokka';
}

export const PRICE_RANGES = [
  { id: 'alle-300', label: 'Alle 300 €', min: 0, max: 300 },
  { id: '300-500', label: '300–500 €', min: 300, max: 500 },
  { id: '500-800', label: '500–800 €', min: 500, max: 800 },
  { id: '800-1500', label: '800–1 500 €', min: 800, max: 1500 },
  { id: 'yli-1500', label: 'Yli 1 500 €', min: 1500, max: Infinity },
] as const;
