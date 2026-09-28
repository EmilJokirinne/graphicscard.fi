// ---------------------------------------------------------------------------
// graphicscard.fi – tietomallit
// Data on eroteltu omiin kokonaisuuksiinsa:
//   GPU-metadata + tekniset tiedot  -> gpus.ts
//   Suorituskyky (benchmark)         -> benchmarks.ts
//   Nykyiset hinnat (yhteenveto)     -> prices-summary.json
//   Hintahistoria                    -> prices-history.json
//   Jälleenmyyjät                    -> retailers.ts
//   Hintalähteet                     -> sources.ts
// Kaikki haetaan dataService.ts:n kautta, jotta lähde voidaan vaihtaa API:ksi.
// ---------------------------------------------------------------------------

export type Manufacturer = 'NVIDIA' | 'AMD' | 'Intel';
export type BrandSlug = 'nvidia' | 'amd' | 'intel';

export interface GpuVariant {
  /** Kumppanivalmistajan malli, esim. "RTX 5080 Gaming OC" */
  name: string;
  maker: string;
}

export interface GpuSpecs {
  architecture: string;
  chip: string;
  process: string;
  /** Laskentayksiköt valmistajan omalla termillä (CUDA-ytimet, CU, Xe-ytimet) */
  cores: { label: string; value: string };
  vramGb: number;
  memoryType: string;
  memoryBusBits: number;
  /** Valmistajan ilmoittama TGP/TBP watteina */
  boardPowerW: number;
  /** Valmistajan suosittelema virtalähde watteina, null = ei vahvistettu */
  psuW: number | null;
  pcie: string;
  rayTracing: string;
  aiFeatures: string;
  upscaling: string;
  frameGeneration: string | null;
}

export interface Gpu {
  id: string;
  slug: string;
  brand: BrandSlug;
  manufacturer: Manufacturer;
  /** Täysi nimi ilman valmistajaa, esim. "GeForce RTX 5080" */
  name: string;
  /** Lyhyt nimi, esim. "RTX 5080" */
  shortName: string;
  series: string;
  generationId: string;
  launchDate: string; // ISO yyyy-mm-dd
  /** Valmistajan julkaisuhinta Yhdysvalloissa (USD, ilman veroja) */
  msrpUsd: number;
  msrpNote?: string;
  popular: boolean;
  aliases: string[];
  variants: GpuVariant[];
  specs: GpuSpecs;
  note?: string;
  specSourceId: string;
}

export interface Benchmark {
  gpuId: string;
  /** Suhteellinen indeksi, RTX 5080 = 100 */
  index: number;
  sourceId: string;
}

export interface PricePoint {
  date: string; // ISO yyyy-mm-dd
  price: number; // EUR sis. ALV
  sourceId: string;
}

export interface PriceSummary {
  gpuId: string;
  currency: 'EUR';
  current: number;
  updatedAt: string;
  sourceId: string;
  change7: number | null;
  change30: number | null;
  change90: number | null;
  change365: number | null;
  avg30: number;
  min: number;
  minDate: string;
  max: number;
  maxDate: string;
  firstDate: string;
}

export type SourceType = 'demo' | 'manufacturer' | 'retailer' | 'aggregator' | 'pending';

export interface Source {
  id: string;
  name: string;
  type: SourceType;
  url?: string;
  description: string;
  isDemo: boolean;
}

export interface Retailer {
  id: string;
  name: string;
  url: string;
}

export interface Generation {
  id: string;
  brand: BrandSlug;
  manufacturer: Manufacturer;
  name: string;
  year: number;
  architecture: string;
  process: string;
  vramRange: string;
  performanceClass: string;
  typicalPriceClass: string;
  models: string;
}

export interface HistoricalObservation {
  date: string;
  price: number;
  sourceId: string;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  category: string;
  published: string;
  updated: string;
  readingMinutes: number;
  /** Kevyt sisältömalli: kappaleet, väliotsikot ja listat */
  body: ArticleBlock[];
  related?: string[];
}

export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'note'; text: string }
  | { type: 'links'; items: { href: string; label: string }[] };

export interface FaqItem {
  q: string;
  a: string;
}
