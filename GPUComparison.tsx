import type { Gpu } from './types';
import { getPerformance, getPriceSummary, gpuPath, performanceClass } from './dataService';
import { eur, fiDate, usd } from './format';
import PriceChangeBadge from './PriceChangeBadge';
import { BrandTag } from './ui';
import type { ReactNode } from 'react';

type Row = { label: string; cell: (g: Gpu) => ReactNode };

const ROWS: Row[] = [
  { label: 'Valmistaja', cell: (g) => g.manufacturer },
  { label: 'Näyttömuisti', cell: (g) => `${g.specs.vramGb} Gt` },
  { label: 'Muistityyppi', cell: (g) => g.specs.memoryType },
  { label: 'Muistiväylä', cell: (g) => `${g.specs.memoryBusBits} bit` },
  { label: 'Arkkitehtuuri', cell: (g) => g.specs.architecture },
  { label: 'Julkaisupäivä', cell: (g) => fiDate(g.launchDate) },
  { label: 'Julkaisuhinta (USA)', cell: (g) => usd(g.msrpUsd) },
  { label: 'Nykyinen hinta', cell: (g) => { const s = getPriceSummary(g.id); return s ? <strong>{eur(s.current)}</strong> : '–'; } },
  { label: '30 pv muutos', cell: (g) => <PriceChangeBadge value={getPriceSummary(g.id)?.change30 ?? null} size="sm" /> },
  { label: 'Alin havaittu hinta', cell: (g) => { const s = getPriceSummary(g.id); return s ? eur(s.min) : '–'; } },
  { label: 'Suorituskykyindeksi', cell: (g) => { const p = getPerformance(g.id); return p ? `${p} (${performanceClass(p).toLowerCase()})` : '–'; } },
  { label: 'Virrankulutus', cell: (g) => `${g.specs.boardPowerW} W` },
  { label: 'Suositeltu virtalähde', cell: (g) => (g.specs.psuW ? `${g.specs.psuW} W` : 'Tarkista valmistajalta') },
  { label: 'Väylä', cell: (g) => g.specs.pcie },
  { label: 'Kuvan skaalaus', cell: (g) => g.specs.upscaling },
  { label: 'Säteenjäljitys', cell: (g) => g.specs.rayTracing },
];

export default function GPUComparison({ gpus }: { gpus: Gpu[] }) {
  return (
    <div className="cmp" style={{ ['--cols' as string]: gpus.length }}>
      <table className="cmp-table">
        <caption className="sr-only">Näytönohjainten vertailu: {gpus.map((g) => g.shortName).join(', ')}</caption>
        <thead>
          <tr>
            <th scope="col">Ominaisuus</th>
            {gpus.map((g) => (
              <th key={g.id} scope="col">
                <BrandTag brand={g.brand} />
                <a href={gpuPath(g)}>{g.shortName}</a>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.label}>
              <th scope="row">{r.label}</th>
              {gpus.map((g) => (
                <td key={g.id} data-label={g.shortName}>
                  {r.cell(g)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
