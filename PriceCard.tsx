import type { Gpu } from './types';
import { getPriceSummary, gpuPath } from './dataService';
import { eur, fiDate, usd } from './format';
import PriceChangeBadge from './PriceChangeBadge';
import SourceBadge from './SourceBadge';
import { BrandTag } from './ui';

/** Hintayhteenveto yhdelle mallille: nykyhinta, muutokset, alin/korkein, julkaisuhinta. */
export default function PriceCard({ gpu, variant = 'full', showName = true }: { gpu: Gpu; variant?: 'full' | 'compact'; showName?: boolean }) {
  const s = getPriceSummary(gpu.id);
  if (!s) return null;
  return (
    <article className={`price-card is-${variant}`}>
      {showName && (
        <header className="price-card-head">
          <BrandTag brand={gpu.brand} />
          <h3>
            <a href={gpuPath(gpu)}>{gpu.name}</a>
          </h3>
        </header>
      )}
      <div className="price-card-main">
        <div>
          <span className="label">Nykyinen hinta</span>
          <strong className="price price-lg">{eur(s.current)}</strong>
        </div>
        <div>
          <span className="label">30 päivän keskiarvo</span>
          <strong className="price">{eur(s.avg30)}</strong>
        </div>
      </div>
      <ul className="price-card-changes" aria-label="Hinnan muutos">
        <li><span className="label">7 pv</span><PriceChangeBadge value={s.change7} size="sm" /></li>
        <li><span className="label">30 pv</span><PriceChangeBadge value={s.change30} size="sm" /></li>
        <li><span className="label">90 pv</span><PriceChangeBadge value={s.change90} size="sm" /></li>
        <li><span className="label">1 vuosi</span><PriceChangeBadge value={s.change365} size="sm" /></li>
      </ul>
      {variant === 'full' && (
        <dl className="price-card-facts">
          <div>
            <dt>Alin havaittu hinta</dt>
            <dd>{eur(s.min)} <span className="muted">({fiDate(s.minDate)})</span></dd>
          </div>
          <div>
            <dt>Korkein havaittu hinta</dt>
            <dd>{eur(s.max)} <span className="muted">({fiDate(s.maxDate)})</span></dd>
          </div>
          <div>
            <dt>Julkaisuhinta (suositushinta)</dt>
            <dd>{usd(gpu.msrpUsd)} <span className="muted">(USA, ilman veroja)</span></dd>
          </div>
        </dl>
      )}
      <SourceBadge sourceId={s.sourceId} date={s.updatedAt} compact />
    </article>
  );
}
