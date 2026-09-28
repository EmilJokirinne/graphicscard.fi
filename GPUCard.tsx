import type { Gpu } from './types';
import { getPerformance, getPriceSummary, gpuPath, performanceClass, recommendedResolution } from './dataService';
import { eur } from './format';
import PriceChangeBadge from './PriceChangeBadge';
import { BrandTag, Icon } from './ui';

export function GPUCard({ gpu }: { gpu: Gpu }) {
  const s = getPriceSummary(gpu.id);
  const perf = getPerformance(gpu.id);
  return (
    <article className="gpu-card">
      <div className="gpu-card-top">
        <BrandTag brand={gpu.brand} />
        <span className="muted small">{gpu.series}</span>
      </div>
      <h3>
        <a href={gpuPath(gpu)} className="stretched">{gpu.shortName}</a>
      </h3>
      <dl className="gpu-card-specs">
        <div>
          <dt>Näyttömuisti</dt>
          <dd>{gpu.specs.vramGb} Gt {gpu.specs.memoryType}</dd>
        </div>
        <div>
          <dt>Suositeltu resoluutio</dt>
          <dd>{perf ? recommendedResolution(perf) : '–'}</dd>
        </div>
        <div>
          <dt>Suorituskykyluokka</dt>
          <dd>{perf ? performanceClass(perf) : '–'}</dd>
        </div>
      </dl>
      <div className="gpu-card-price">
        <div>
          <span className="label">Hinta nyt</span>
          <strong className="price">{s ? eur(s.current) : '–'}</strong>
        </div>
        <PriceChangeBadge value={s?.change30 ?? null} label="30 pv" size="sm" />
      </div>
      <span className="gpu-card-link" aria-hidden="true">
        Katso tiedot <Icon name="arrowRight" size={15} />
      </span>
    </article>
  );
}

export default GPUCard;
