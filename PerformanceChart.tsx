import type { Gpu } from './types';
import { getPerformance, gpuPath } from './dataService';
import { BrandTag } from './ui';

/** Vaakapalkkikaavio suhteellisesta suorituskyvystä (RTX 5080 = 100). HTML-pohjainen: toimii SSR:ssä. */
export default function PerformanceChart({
  gpus,
  highlightId,
  caption = true,
}: {
  gpus: Gpu[];
  highlightId?: string;
  caption?: boolean;
}) {
  const rows = gpus
    .map((g) => ({ g, v: getPerformance(g.id) }))
    .filter((r): r is { g: Gpu; v: number } => r.v !== null)
    .sort((a, b) => b.v - a.v);
  const max = Math.max(...rows.map((r) => r.v), 100);
  return (
    <figure className="perf">
      <ol className="perf-list">
        {rows.map(({ g, v }) => (
          <li key={g.id} className={g.id === highlightId ? 'is-hl' : ''} title={`${g.shortName}: indeksi ${v}`}>
            <span className="perf-name">
              <BrandTag brand={g.brand} label="" />
              <a href={gpuPath(g)}>{g.shortName}</a>
            </span>
            <span className="perf-track" aria-hidden="true">
              <span className="perf-bar" style={{ width: `${(v / max) * 100}%` }} />
            </span>
            <span className="perf-val">{v}</span>
          </li>
        ))}
      </ol>
      {caption && (
        <figcaption>
          Suhteellinen suorituskykyindeksi, RTX 5080 = 100 (1440p, rasterointi). Luvut ovat suuntaa-antavia vertailuarvoja
          eivätkä takaa tiettyä FPS-lukemaa kaikissa peleissä. Nykyiset arvot ovat esimerkkiarvioita.
        </figcaption>
      )}
    </figure>
  );
}
