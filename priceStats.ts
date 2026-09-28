// Puhtaat laskentafunktiot hintadatalle. Ei riippuvuuksia – käytetään sekä
// selaimessa että demo-datan generaattorissa (node --experimental-strip-types).

export interface Point {
  date: string;
  price: number;
  sourceId: string;
}

const DAY = 86_400_000;

export function toTime(iso: string): number {
  return Date.parse(iso + 'T00:00:00Z');
}

export function addDays(iso: string, days: number): string {
  return new Date(toTime(iso) + days * DAY).toISOString().slice(0, 10);
}

/** Viimeisin hinta annettuun päivään mennessä, null jos dataa ei ole niin kaukaa. */
export function priceAt(points: Point[], iso: string): number | null {
  const t = toTime(iso);
  let found: number | null = null;
  for (const p of points) {
    if (toTime(p.date) <= t) found = p.price;
    else break;
  }
  return found;
}

export function pctChange(from: number | null, to: number): number | null {
  if (from === null || from === 0) return null;
  return ((to - from) / from) * 100;
}

export function summarize(gpuId: string, points: Point[]) {
  const last = points[points.length - 1];
  const today = last.date;
  const change = (days: number) => pctChange(priceAt(points, addDays(today, -days)), last.price);
  const from30 = toTime(addDays(today, -30));
  const window = points.filter((p) => toTime(p.date) >= from30);
  const avg30 = Math.round(window.reduce((s, p) => s + p.price, 0) / window.length);
  let min = points[0];
  let max = points[0];
  for (const p of points) {
    if (p.price < min.price) min = p;
    if (p.price > max.price) max = p;
  }
  const round = (n: number | null) => (n === null ? null : Math.round(n * 10) / 10);
  return {
    gpuId,
    currency: 'EUR' as const,
    current: last.price,
    updatedAt: today,
    sourceId: last.sourceId,
    change7: round(change(7)),
    change30: round(change(30)),
    change90: round(change(90)),
    change365: round(change(365)),
    avg30,
    min: min.price,
    minDate: min.date,
    max: max.price,
    maxDate: max.date,
    firstDate: points[0].date,
  };
}

export type Granularity = 'day' | 'week' | 'month' | 'year';

/** Harventaa sarjan: viimeinen havainto per viikko / kuukausi / vuosi. */
export function resample(points: Point[], g: Granularity): Point[] {
  if (g === 'day') return points;
  const key = (iso: string) => {
    if (g === 'year') return iso.slice(0, 4);
    if (g === 'month') return iso.slice(0, 7);
    const t = toTime(iso);
    const d = new Date(t);
    const dow = (d.getUTCDay() + 6) % 7; // ma = 0
    return new Date(t - dow * DAY).toISOString().slice(0, 10);
  };
  const out: Point[] = [];
  for (const p of points) {
    const k = key(p.date);
    if (out.length && key(out[out.length - 1].date) === k) out[out.length - 1] = p;
    else out.push(p);
  }
  return out;
}

export function sliceRange(points: Point[], days: number | null): Point[] {
  if (days === null || !points.length) return points;
  const from = toTime(addDays(points[points.length - 1].date, -days));
  return points.filter((p) => toTime(p.date) >= from);
}
