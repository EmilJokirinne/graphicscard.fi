import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import { loadPriceHistory } from './dataService';
import { resample, sliceRange, toTime, type Granularity, type Point } from './priceStats';
import { eur, fiDate, fiDateShort, fiMonth, pct } from './format';

export interface ChartSeries {
  id: string; // gpuId
  label: string;
}

// Kategoriset värit tummalle pinnalle (validoitu järjestys: sininen, oranssi, turkoosi, keltainen).
export const SERIES_COLORS = ['#3987e5', '#d95926', '#199e70', '#c98500'];

const RANGES = [
  { id: '7', label: '7 päivää', days: 7 },
  { id: '30', label: '30 päivää', days: 30 },
  { id: '180', label: '6 kk', days: 182 },
  { id: '365', label: '1 vuosi', days: 365 },
  { id: 'all', label: 'Kaikki', days: null },
] as const;
type RangeId = (typeof RANGES)[number]['id'];

const GRANS: { id: Granularity; label: string }[] = [
  { id: 'day', label: 'Päivä' },
  { id: 'week', label: 'Viikko' },
  { id: 'month', label: 'Kuukausi' },
  { id: 'year', label: 'Vuosi' },
];

const defaultGran = (r: RangeId): Granularity => (r === '7' || r === '30' ? 'day' : r === '180' ? 'day' : 'week');

function niceTicks(min: number, max: number, count = 5) {
  const span = max - min || 1;
  const step0 = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(step0)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= count) ?? 10 * mag;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = lo; v <= hi + 1e-9; v += step) ticks.push(Math.round(v));
  return { lo, hi, ticks };
}

function timeTicks(t0: number, t1: number, compact = false): { t: number; label: string }[] {
  const days = (t1 - t0) / 86_400_000;
  const out: { t: number; label: string }[] = [];
  if (days <= 45) {
    const n = compact ? 4 : 6;
    for (let i = 0; i < n; i++) {
      const t = t0 + ((t1 - t0) * i) / (n - 1);
      out.push({ t, label: fiDateShort(new Date(t).toISOString().slice(0, 10)) });
    }
    return out;
  }
  const d = new Date(t0);
  let y = d.getUTCFullYear();
  let m = d.getUTCMonth() + 1;
  const months = days / 30.4;
  let step = months <= 7 ? 1 : months <= 14 ? 2 : months <= 26 ? 3 : 6;
  if (compact) step = months <= 4 ? 1 : months <= 7 ? 2 : months <= 14 ? 3 : months <= 26 ? 6 : 12;
  const withYear = days > 330;
  while (true) {
    const t = Date.UTC(y, m, 1);
    if (t > t1) break;
    if (t >= t0 && m % step === 0) {
      const iso = new Date(t).toISOString().slice(0, 10);
      out.push({ t, label: fiMonth(iso, withYear) });
    }
    m++;
    if (m > 11) { m = 0; y++; }
  }
  return out;
}

export default function PriceHistoryChart({
  series,
  defaultRange = '180',
  height = 300,
  title,
}: {
  series: ChartSeries[];
  defaultRange?: RangeId;
  height?: number;
  title?: string;
}) {
  const [history, setHistory] = useState<Record<string, Point[]> | null>(null);
  const [range, setRange] = useState<RangeId>(defaultRange);
  const [gran, setGran] = useState<Granularity>(defaultGran(defaultRange));
  const [hover, setHover] = useState<number | null>(null);
  const [width, setWidth] = useState(720);
  const wrapRef = useRef<HTMLDivElement>(null);
  const multi = series.length > 1;

  useEffect(() => {
    let alive = true;
    loadPriceHistory().then((h) => alive && setHistory(h));
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.max(280, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const days = RANGES.find((r) => r.id === range)!.days;

  // Kaikki-näkymässä yhteinen aikaväli = pisin sarja
  const data = useMemo(() => {
    if (!history) return null;
    return series.map((s, i) => {
      const raw = history[s.id] ?? [];
      const pts = resample(sliceRange(raw, days), gran);
      return { ...s, color: SERIES_COLORS[i % SERIES_COLORS.length], pts };
    });
  }, [history, series, days, gran, multi]);

  const granAvailable = (g: Granularity) => {
    if (!history) return g === 'day';
    const raw = history[series[0].id] ?? [];
    return resample(sliceRange(raw, days), g).length >= 3;
  };

  const compact = width < 520;
  const M = { l: compact ? 48 : 60, r: multi && !compact ? 96 : 16, t: 30, b: 32 };
  const W = width;
  const H = height;
  const iw = W - M.l - M.r;
  const ih = H - M.t - M.b;

  const geo = useMemo(() => {
    if (!data) return null;
    const all = data.flatMap((d) => d.pts);
    if (!all.length) return null;
    const t0 = Math.min(...all.map((p) => toTime(p.date)));
    const t1 = Math.max(...all.map((p) => toTime(p.date)));
    const pmin = Math.min(...all.map((p) => p.price));
    const pmax = Math.max(...all.map((p) => p.price));
    const pad = (pmax - pmin) * 0.08 || pmax * 0.05;
    const { lo, hi, ticks } = niceTicks(pmin - pad, pmax + pad, compact ? 4 : 5);
    const x = (t: number) => M.l + (t1 === t0 ? iw / 2 : ((t - t0) / (t1 - t0)) * iw);
    const y = (p: number) => M.t + ih - ((p - lo) / (hi - lo)) * ih;
    // Hover-ankkurit: kaikkien sarjojen päivämäärien unioni
    const times = Array.from(new Set(all.map((p) => toTime(p.date)))).sort((a, b) => a - b);
    return { t0, t1, lo, hi, ticks, x, y, times, xticks: timeTicks(t0, t1, compact) };
  }, [data, iw, ih, M.l, M.t, compact]);

  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    if (!geo) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    let best = 0;
    let bd = Infinity;
    geo.times.forEach((t, i) => {
      const d = Math.abs(geo.x(t) - px);
      if (d < bd) { bd = d; best = i; }
    });
    setHover(geo.times[best]);
  };

  const hoverRows =
    hover !== null && data
      ? data.map((d) => {
          let idx = -1;
          for (let i = 0; i < d.pts.length; i++) if (toTime(d.pts[i].date) <= hover) idx = i;
          const p = idx >= 0 ? d.pts[idx] : null;
          const prev = idx > 0 ? d.pts[idx - 1] : null;
          return { ...d, p, change: p && prev ? ((p.price - prev.price) / prev.price) * 100 : null };
        })
      : null;

  // Suorat nimilaput viivojen päähän (monisarjainen), yksinkertainen törmäyksenesto
  const endLabels = useMemo(() => {
    if (!data || !geo || !multi || compact) return [];
    const labels = data
      .filter((d) => d.pts.length)
      .map((d) => ({ id: d.id, label: d.label, color: d.color, y: geo.y(d.pts[d.pts.length - 1].price) }))
      .sort((a, b) => a.y - b.y);
    for (let i = 1; i < labels.length; i++) if (labels[i].y - labels[i - 1].y < 16) labels[i].y = labels[i - 1].y + 16;
    return labels;
  }, [data, geo, multi, compact]);

  const ariaLabel = `Hintakehitys${title ? `: ${title}` : ''}, aikaväli ${RANGES.find((r) => r.id === range)!.label}. Y-akseli hinta euroina.`;

  return (
    <div className="chart">
      <div className="chart-controls">
        <div className="seg" role="group" aria-label="Aikaväli">
          {RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              aria-pressed={range === r.id}
              onClick={() => {
                setRange(r.id);
                setGran(defaultGran(r.id));
                setHover(null);
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
        <div className="seg seg-sm" role="group" aria-label="Tarkkuus">
          {GRANS.map((g) => (
            <button key={g.id} type="button" aria-pressed={gran === g.id} disabled={!granAvailable(g.id)} onClick={() => setGran(g.id)}>
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {multi && (
        <ul className="chart-legend" aria-label="Selite">
          {series.map((s, i) => (
            <li key={s.id}>
              <span className="swatch" style={{ background: SERIES_COLORS[i % SERIES_COLORS.length] }} />
              {s.label}
            </li>
          ))}
        </ul>
      )}

      <div className="chart-plot" ref={wrapRef} style={{ height: H }}>
        {!data || !geo ? (
          <div className="chart-loading" style={{ height: H }}>
            <span>Ladataan hintakehitystä…</span>
          </div>
        ) : (
          <>
            <svg
              width={W}
              height={H}
              viewBox={`0 0 ${W} ${H}`}
              role="img"
              aria-label={ariaLabel}
              onPointerMove={onMove}
              onPointerDown={onMove}
              onPointerLeave={() => setHover(null)}
            >
              <text x={4} y={12} className="axis-title">Hinta (€)</text>
              {geo.ticks.map((t) => (
                <g key={t}>
                  <line x1={M.l} x2={W - M.r} y1={geo.y(t)} y2={geo.y(t)} className="grid" />
                  <text x={M.l - 8} y={geo.y(t) + 4} textAnchor="end" className="tick">
                    {new Intl.NumberFormat('fi-FI').format(t)}
                  </text>
                </g>
              ))}
              {geo.xticks.map((t, i) => (
                <text key={i} x={geo.x(t.t)} y={H - 10} textAnchor={i === 0 && geo.x(t.t) - M.l < 20 ? 'start' : 'middle'} className="tick">
                  {t.label}
                </text>
              ))}
              <line x1={M.l} x2={W - M.r} y1={M.t + ih} y2={M.t + ih} className="baseline" />
              {data.map((d) => (
                <path
                  key={d.id}
                  d={d.pts.map((p, i) => `${i ? 'L' : 'M'}${geo.x(toTime(p.date)).toFixed(1)},${geo.y(p.price).toFixed(1)}`).join('')}
                  fill="none"
                  stroke={d.color}
                  strokeWidth={2}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              ))}
              {!multi && data[0].pts.length > 0 && (
                <path
                  d={
                    data[0].pts.map((p, i) => `${i ? 'L' : 'M'}${geo.x(toTime(p.date)).toFixed(1)},${geo.y(p.price).toFixed(1)}`).join('') +
                    `L${geo.x(toTime(data[0].pts[data[0].pts.length - 1].date))},${M.t + ih}L${geo.x(toTime(data[0].pts[0].date))},${M.t + ih}Z`
                  }
                  fill={data[0].color}
                  opacity={0.1}
                />
              )}
              {endLabels.map((l) => (
                <text key={l.id} x={W - M.r + 8} y={l.y + 4} className="end-label">
                  <tspan fill={l.color}>●</tspan> {l.label}
                </text>
              ))}
              {hoverRows && hover !== null && (
                <g>
                  <line x1={geo.x(hover)} x2={geo.x(hover)} y1={M.t} y2={M.t + ih} className="crosshair" />
                  {hoverRows.map((r) =>
                    r.p ? (
                      <circle key={r.id} cx={geo.x(toTime(r.p.date))} cy={geo.y(r.p.price)} r={4.5} fill={r.color} stroke="#121418" strokeWidth={2} />
                    ) : null,
                  )}
                </g>
              )}
            </svg>
            {hoverRows && hover !== null && (
              <div
                className="chart-tip"
                style={{
                  left: Math.min(Math.max(geo.x(hover), 90), W - 90),
                  top: 8,
                  transform: geo.x(hover) > W / 2 ? 'translateX(calc(-100% - 12px))' : 'translateX(12px)',
                }}
                role="status"
              >
                <div className="chart-tip-date">{fiDate(new Date(hover).toISOString().slice(0, 10))}</div>
                {hoverRows.map((r) =>
                  r.p ? (
                    <div key={r.id} className="chart-tip-row">
                      {multi && <span className="swatch" style={{ background: r.color }} />}
                      {multi && <span className="chart-tip-label">{r.label}</span>}
                      <strong>{eur(r.p.price)}</strong>
                      <span className="chart-tip-chg">{r.change === null ? '' : `${pct(r.change)} edellisestä`}</span>
                    </div>
                  ) : null,
                )}
              </div>
            )}
          </>
        )}
      </div>

      {data && (
        <details className="chart-table">
          <summary>Näytä datataulukko</summary>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Päivämäärä</th>
                  {data.map((d) => (
                    <th key={d.id} scope="col" className="num">{d.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {geo?.times
                  .slice()
                  .reverse()
                  .slice(0, 60)
                  .map((t) => (
                    <tr key={t}>
                      <td>{fiDate(new Date(t).toISOString().slice(0, 10))}</td>
                      {data.map((d) => {
                        const p = d.pts.find((x) => toTime(x.date) === t);
                        return <td key={d.id} className="num">{p ? eur(p.price) : '–'}</td>;
                      })}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </div>
  );
}
