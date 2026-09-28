import { getSource } from './dataService';
import { fiDate } from './format';
import { DemoBadge } from './ui';

/** Näyttää hinnan lähteen ja päivityspäivän. Demo-lähteillä aina näkyvä Esimerkkidata-merkintä. */
export default function SourceBadge({ sourceId, date, compact = false }: { sourceId: string; date?: string; compact?: boolean }) {
  const s = getSource(sourceId);
  return (
    <span className={`source-badge ${compact ? 'is-compact' : ''}`}>
      {s?.isDemo && <DemoBadge />}
      {date && <span>Päivitetty: {fiDate(date)}</span>}
      <span>
        Lähde:{' '}
        {s?.url ? (
          <a href={s.url} rel="noopener" target="_blank">{s.name}</a>
        ) : (
          <a href="/lahteet">{s?.name ?? 'tuntematon'}</a>
        )}
      </span>
    </span>
  );
}
