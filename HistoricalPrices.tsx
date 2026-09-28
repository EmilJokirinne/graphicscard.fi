import { useEffect, useRef, useState } from 'react';
import { toTime } from './priceStats';
import { rtx4090History } from './generations';
import { getSource } from './dataService';
import { eur, fiMonth, fiMonthLong, pct } from './format';
import { DemoBadge } from './ui';

/**
 * "Miten näytönohjainten hinnat ovat muuttuneet?" – historiallinen esimerkki (RTX 4090).
 * Näytetään aina Lähde | Päivämäärä | Havaittu hinta. Ei esitetä nykyhintoina.
 */
export default function HistoricalPrices() {
  const data = rtx4090History;
  const [hover, setHover] = useState<number | null>(null);
  const [W, setW] = useState(640);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(280, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const H = 250;
  const M = { l: 48, r: 28, t: 30, b: 36 };
  const t0 = toTime(data[0].date);
  const t1 = toTime(data[data.length - 1].date);
  const lo = 1500;
  const hi = 2800;
  const x = (i: number) => M.l + ((toTime(data[i].date) - t0) / (t1 - t0)) * (W - M.l - M.r);
  const y = (p: number) => M.t + (1 - (p - lo) / (hi - lo)) * (H - M.t - M.b);
  const ticks = [1500, 1800, 2100, 2400, 2700];
  const first = data[0].price;
  const last = data[data.length - 1].price;

  return (
    <div className="hist">
      <div className="hist-chart">
        <div className="hist-head">
          <h3>RTX 4090: havaittu hintataso 2024–2025</h3>
          <DemoBadge label="Historiallinen esimerkki" />
        </div>
        <div className="chart-plot" ref={ref}>
          <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label="RTX 4090:n havaittu hinta heinäkuusta 2024 tammikuuhun 2025" onPointerLeave={() => setHover(null)}>
            <text x={4} y={12} className="axis-title">Hinta (€)</text>
            {ticks.map((t) => (
              <g key={t}>
                <line x1={M.l} x2={W - M.r} y1={y(t)} y2={y(t)} className="grid" />
                <text x={M.l - 8} y={y(t) + 4} textAnchor="end" className="tick">{new Intl.NumberFormat('fi-FI').format(t)}</text>
              </g>
            ))}
            <path d={data.map((p, i) => `${i ? 'L' : 'M'}${x(i)},${y(p.price)}`).join('')} fill="none" stroke="#d95926" strokeWidth={2} />
            {data.map((p, i) => (
              <g key={p.date} onPointerEnter={() => setHover(i)} onPointerDown={() => setHover(i)}>
                <rect x={x(i) - 30} y={M.t} width={60} height={H - M.t - M.b} fill="transparent" />
                <circle cx={x(i)} cy={y(p.price)} r={hover === i ? 6 : 4.5} fill="#d95926" stroke="#121418" strokeWidth={2} />
                {(W > 480 || i % 2 === 0) && (
                  <text x={x(i)} y={H - 12} textAnchor={i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle'} className="tick">{fiMonth(p.date, true)}</text>
                )}
                {(i === 0 || i === data.length - 1 || hover === i) && (
                  <text x={x(i)} y={y(p.price) - 12} textAnchor={i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle'} className="point-label">
                    {eur(p.price)}
                  </text>
                )}
              </g>
            ))}
          </svg>
        </div>
        <p>
          Hintakehitys osoittaa, että näytönohjaimen markkinahinta voi muuttua huomattavasti tuotannon ja saatavuuden muuttuessa.
          Esimerkissä hinta nousi seurantajakson aikana noin {pct(((last - first) / first) * 100, false)}, kun malli oli poistumassa
          tuotannosta ja seuraaja ei vielä ollut saatavilla.
        </p>
      </div>
      <div className="table-scroll">
        <table className="data-table">
          <caption className="sr-only">RTX 4090:n historialliset hintahavainnot</caption>
          <thead>
            <tr>
              <th scope="col">Lähde</th>
              <th scope="col">Päivämäärä</th>
              <th scope="col" className="num">Havaittu hinta</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <tr key={p.date}>
                <td><a href="/lahteet">{getSource(p.sourceId)?.name}</a></td>
                <td>{fiMonthLong(p.date)}</td>
                <td className="num">noin {eur(p.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="small muted">
          Historiallisia havaintoja, ei tämänhetkisiä hintoja. Alkuperäiset lähteet lisätään ennen julkaisua, ja siihen asti luvut on merkitty esimerkkidataksi.
        </p>
      </div>
    </div>
  );
}
