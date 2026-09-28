import { useMemo, useState, type ReactNode } from 'react';
import type { Gpu } from './types';
import { getPriceSummary, gpuPath } from './dataService';
import { eur, usd } from './format';
import PriceChangeBadge from './PriceChangeBadge';
import { BrandTag } from './ui';

type Col = { id: string; label: string; short?: string; value: (g: Gpu) => number | null; render: (g: Gpu) => ReactNode };

const s = (g: Gpu) => getPriceSummary(g.id);

export const TRACKER_COLUMNS: Col[] = [
  { id: 'current', label: 'Nykyinen hinta', short: 'Hinta', value: (g) => s(g)?.current ?? null, render: (g) => <strong className="price">{eur(s(g)!.current)}</strong> },
  { id: 'change7', label: '7 pv', value: (g) => s(g)?.change7 ?? null, render: (g) => <PriceChangeBadge value={s(g)!.change7} size="sm" /> },
  { id: 'change30', label: '30 pv', value: (g) => s(g)?.change30 ?? null, render: (g) => <PriceChangeBadge value={s(g)!.change30} size="sm" /> },
  { id: 'change90', label: '90 pv', value: (g) => s(g)?.change90 ?? null, render: (g) => <PriceChangeBadge value={s(g)!.change90} size="sm" /> },
  { id: 'change365', label: '1 vuosi', value: (g) => s(g)?.change365 ?? null, render: (g) => <PriceChangeBadge value={s(g)!.change365} size="sm" /> },
  { id: 'min', label: 'Alin hinta', value: (g) => s(g)?.min ?? null, render: (g) => eur(s(g)!.min) },
  { id: 'max', label: 'Korkein hinta', value: (g) => s(g)?.max ?? null, render: (g) => eur(s(g)!.max) },
  { id: 'msrp', label: 'Julkaisuhinta (USD)', short: 'Julkaisuhinta', value: (g) => g.msrpUsd, render: (g) => usd(g.msrpUsd) },
];

/**
 * Lajiteltava hintataulukko. Desktopissa taulukko, mobiilissa jokainen rivi muuttuu kortiksi (CSS).
 */
export default function PriceTracker({ gpus, columns }: { gpus: Gpu[]; columns: string[] }) {
  const cols = TRACKER_COLUMNS.filter((c) => columns.includes(c.id));
  const [sort, setSort] = useState<{ id: string; dir: 1 | -1 } | null>(null);
  const rows = useMemo(() => {
    const list = gpus.filter((g) => getPriceSummary(g.id));
    if (!sort) return list;
    const col = TRACKER_COLUMNS.find((c) => c.id === sort.id)!;
    return [...list].sort((a, b) => {
      const va = col.value(a) ?? -Infinity;
      const vb = col.value(b) ?? -Infinity;
      return (va - vb) * sort.dir;
    });
  }, [gpus, sort]);

  const toggleSort = (id: string) =>
    setSort((cur) => (cur?.id === id ? (cur.dir === -1 ? { id, dir: 1 } : null) : { id, dir: -1 }));

  return (
    <div className="tracker">
      <table className="tracker-table">
        <caption className="sr-only">Näytönohjainten hinnat ja hinnan muutokset</caption>
        <thead>
          <tr>
            <th scope="col">Näytönohjain</th>
            {cols.map((c) => (
              <th
                key={c.id}
                scope="col"
                className="num"
                aria-sort={sort?.id === c.id ? (sort.dir === 1 ? 'ascending' : 'descending') : undefined}
              >
                <button type="button" className="sort-btn" onClick={() => toggleSort(c.id)}>
                  {c.label}
                  <span className="sort-ind" aria-hidden="true">{sort?.id === c.id ? (sort.dir === 1 ? '▲' : '▼') : '↕'}</span>
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((g) => (
            <tr key={g.id}>
              <th scope="row">
                <BrandTag brand={g.brand} label="" />
                <a href={gpuPath(g)}>{g.shortName}</a>
              </th>
              {cols.map((c) => (
                <td key={c.id} className="num" data-label={c.short ?? c.label}>
                  {c.render(g)}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={cols.length + 1} className="empty">Valinnoilla ei löytynyt näytönohjaimia.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
