// Demo-hintadatan generaattori.
// Aja: npm run data:demo  (node --experimental-strip-types generate-demo-data.ts)
//
// Tuottaa:
//   prices-history.json  – hintahistoria (viikoittain vanhemmat, päivittäin viimeiset 120 pv)
//   prices-summary.json  – nykyhinta, muutokset, alin/korkein jne. laskettuna historiasta
//
// KAIKKI LUVUT OVAT ESIMERKKIDATAA (sourceId "demo"). Ne eivät ole todellisia
// kauppahintoja. Kun oikea hintalähde kytketään, nämä tiedostot korvataan
// samassa muodossa olevalla datalla tai dataService.ts ohjataan API:in.

import { writeFileSync } from 'node:fs';
import { addDays, summarize, toTime, type Point } from './priceStats.ts';

const TODAY = '2026-09-28';
const DAILY_FROM = addDays(TODAY, -120);

// Ankkuripisteet (pvm, €). Ensimmäinen = julkaisupäivä. Viimeinen = nykyinen esimerkkihinta.
const anchors: Record<string, [string, number][]> = {
  'rtx-5090': [['2025-01-30', 2369], ['2025-03-01', 3090], ['2025-06-01', 2620], ['2025-10-01', 2440], ['2026-01-15', 2690], ['2026-05-01', 3180], ['2026-08-29', 3350], ['2026-09-28', 3615]],
  'rtx-5080': [['2025-01-30', 1190], ['2025-03-01', 1440], ['2025-07-01', 1210], ['2025-12-01', 1150], ['2026-04-01', 1470], ['2026-08-29', 1527], ['2026-09-12', 1455], ['2026-09-28', 1397]],
  'rtx-5070-ti': [['2025-02-20', 879], ['2025-03-20', 1049], ['2025-08-01', 855], ['2026-01-10', 819], ['2026-06-01', 949], ['2026-08-29', 979], ['2026-09-28', 965]],
  'rtx-5070': [['2025-03-05', 649], ['2025-04-01', 719], ['2025-08-01', 601], ['2026-01-10', 579], ['2026-06-01', 639], ['2026-08-29', 655], ['2026-09-28', 649]],
  'rtx-5060-ti': [['2025-04-16', 459], ['2025-07-15', 439], ['2026-01-10', 429], ['2026-06-01', 509], ['2026-08-29', 525], ['2026-09-28', 539]],
  'rtx-5060': [['2025-05-19', 329], ['2025-09-15', 309], ['2026-02-01', 305], ['2026-06-01', 339], ['2026-08-29', 345], ['2026-09-28', 339]],
  'rx-9070-xt': [['2025-03-06', 689], ['2025-04-10', 849], ['2025-08-15', 699], ['2026-01-10', 659], ['2026-06-01', 759], ['2026-08-29', 745], ['2026-09-28', 729]],
  'rx-9070': [['2025-03-06', 629], ['2025-04-10', 719], ['2025-08-15', 609], ['2026-01-10', 579], ['2026-06-01', 639], ['2026-08-29', 635], ['2026-09-28', 619]],
  'rx-9060-xt': [['2025-06-05', 389], ['2025-10-01', 359], ['2026-02-01', 355], ['2026-06-01', 419], ['2026-08-29', 415], ['2026-09-28', 409]],
  'rx-7900-xtx': [['2022-12-13', 1199], ['2023-06-01', 1049], ['2024-01-10', 999], ['2024-09-01', 949], ['2025-03-01', 1099], ['2025-09-01', 899], ['2026-03-01', 979], ['2026-08-29', 1010], ['2026-09-28', 995]],
  'rx-7900-xt': [['2022-12-13', 1049], ['2023-06-01', 849], ['2024-01-10', 779], ['2024-09-01', 699], ['2025-03-01', 819], ['2025-09-01', 689], ['2026-03-01', 739], ['2026-08-29', 759], ['2026-09-28', 749]],
  'arc-b580': [['2024-12-13', 319], ['2025-02-01', 359], ['2025-08-01', 289], ['2026-02-01', 279], ['2026-06-01', 305], ['2026-08-29', 299], ['2026-09-28', 289]],
  'arc-b570': [['2025-01-16', 279], ['2025-06-01', 249], ['2026-01-10', 239], ['2026-06-01', 259], ['2026-08-29', 255], ['2026-09-28', 249]],
};

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(s: string) {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

function interpolate(a: [string, number][], iso: string) {
  const t = toTime(iso);
  for (let i = 0; i < a.length - 1; i++) {
    const [d0, p0] = a[i];
    const [d1, p1] = a[i + 1];
    const t0 = toTime(d0);
    const t1 = toTime(d1);
    if (t >= t0 && t <= t1) return p0 + ((p1 - p0) * (t - t0)) / (t1 - t0);
  }
  return a[a.length - 1][1];
}

const history: Record<string, Point[]> = {};
const summary: Record<string, ReturnType<typeof summarize>> = {};

for (const [id, a] of Object.entries(anchors)) {
  const rnd = mulberry32(hash(id));
  const pts: Point[] = [];
  let d = a[0][0];
  let noise = 0;
  const anchorDates = new Set(a.map(([x]) => x));
  while (toTime(d) <= toTime(TODAY)) {
    const base = interpolate(a, d);
    noise = noise * 0.7 + (rnd() - 0.5) * 0.02; // pehmeä satunnaiskulku ±~1 %
    const price = anchorDates.has(d) ? a.find(([x]) => x === d)![1] : Math.round(base * (1 + noise));
    pts.push({ date: d, price, sourceId: 'demo' });
    const daily = toTime(d) >= toTime(DAILY_FROM);
    let next = addDays(d, daily ? 1 : 7);
    // varmista että ankkuripisteet ja päivittäisen jakson alku osuvat sarjaan
    for (const x of [...anchorDates, DAILY_FROM]) {
      if (toTime(x) > toTime(d) && toTime(x) < toTime(next)) next = x;
    }
    d = next;
  }
  history[id] = pts;
  summary[id] = summarize(id, pts);
}

const meta = {
  generatedAt: TODAY,
  currency: 'EUR',
  isDemo: true,
  note: 'Esimerkkidata – ei todellisia hintoja.',
};

writeFileSync('prices-history.json', JSON.stringify({ meta, history }));
writeFileSync('prices-summary.json', JSON.stringify({ meta, summary }, null, 1));

for (const s of Object.values(summary)) {
  console.log(s.gpuId.padEnd(12), s.current, '30pv', s.change30, '% avg30', s.avg30, 'min', s.min, 'max', s.max);
}
