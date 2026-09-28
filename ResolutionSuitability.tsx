import type { Gpu } from './types';
import { getPerformance, levelScore, resolutionLevel } from './dataService';

const RES = [
  { id: '1080p' as const, label: '1080p', px: '1920 × 1080' },
  { id: '1440p' as const, label: '1440p', px: '2560 × 1440' },
  { id: '4K' as const, label: '4K', px: '3840 × 2160' },
];

function Meter({ score }: { score: number }) {
  return (
    <span className="meter" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= score ? 'on' : ''} />
      ))}
    </span>
  );
}

export default function ResolutionSuitability({ gpu }: { gpu: Gpu }) {
  const perf = getPerformance(gpu.id);
  if (perf === null) return null;
  const esports = resolutionLevel(perf * 1.6, '1440p');
  const aaa = resolutionLevel(perf, '1440p');
  const rtScore = gpu.brand === 'nvidia' ? perf * 1.1 : gpu.specs.architecture === 'RDNA 3' ? perf * 0.75 : perf * 0.95;
  const rt = resolutionLevel(rtScore, '1440p');
  return (
    <div className="suit">
      <div className="suit-grid">
        {RES.map((r) => {
          const lvl = resolutionLevel(perf, r.id);
          return (
            <div key={r.id} className="suit-card">
              <h3>{r.label}</h3>
              <span className="muted small">{r.px}</span>
              <Meter score={levelScore(lvl)} />
              <strong>{lvl} suorituskyky</strong>
            </div>
          );
        })}
      </div>
      <dl className="suit-list">
        <div>
          <dt>eSports-pelit</dt>
          <dd><Meter score={levelScore(esports)} /> {esports} (1440p)</dd>
        </div>
        <div>
          <dt>AAA-pelit</dt>
          <dd><Meter score={levelScore(aaa)} /> {aaa} (1440p)</dd>
        </div>
        <div>
          <dt>Säteenjäljitys</dt>
          <dd><Meter score={levelScore(rt)} /> {rt} (1440p)</dd>
        </div>
        <div>
          <dt>DLSS / FSR / XeSS</dt>
          <dd>
            {gpu.specs.upscaling}
            {gpu.specs.frameGeneration ? ` · ${gpu.specs.frameGeneration}` : ''}
          </dd>
        </div>
      </dl>
      <p className="small muted">
        Arvio perustuu suuntaa-antavaan suorituskykyindeksiin korkeilla asetuksilla ilman kuvanskaalausta. Todellinen ruudunpäivitysnopeus
        riippuu pelistä, asetuksista, prosessorista ja ajureista.
      </p>
    </div>
  );
}
