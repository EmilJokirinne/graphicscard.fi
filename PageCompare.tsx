import { useEffect, useState } from 'react';
import type { PageProps } from './pages';
import { getGpuById, getGpus } from './dataService';
import { breadcrumbsFor } from './seo';
import { useNav } from './router';
import Breadcrumbs from './Breadcrumbs';
import GPUComparison from './GPUComparison';
import PerformanceChart from './PerformanceChart';
import PriceHistoryChart from './PriceHistoryChart';
import { DemoBadge, Icon } from './ui';

const DEFAULT = ['rtx-5080', 'rtx-5070-ti'];
const QUICK = [
  ['rtx-5080', 'rtx-5070-ti'],
  ['rtx-5070-ti', 'rx-9070-xt'],
  ['rtx-5070', 'rx-9070'],
  ['rtx-5060-ti', 'rx-9060-xt', 'arc-b580'],
  ['rx-9070-xt', 'rx-7900-xt'],
];

function parse(search: string): string[] {
  const p = new URLSearchParams(search).get('gpu');
  if (!p) return DEFAULT;
  const ids = Array.from(new Set(p.split(',').filter((id) => getGpuById(id)))).slice(0, 4);
  return ids.length >= 2 ? ids : DEFAULT;
}

export default function PageCompare({ route }: PageProps) {
  const { search, navigate } = useNav();
  const [ids, setIds] = useState<string[]>(DEFAULT);

  // URL -> tila (hydraation jälkeen)
  useEffect(() => setIds(parse(search)), [search]);

  const update = (next: string[]) => {
    setIds(next);
    navigate(`/vertaa?gpu=${next.join(',')}`, { replace: true, scroll: false });
  };

  const all = getGpus();
  const gpus = ids.map((id) => getGpuById(id)!);

  return (
    <>
      <div className="page-head">
        <div className="container">
          <Breadcrumbs items={breadcrumbsFor(route)} />
          <h1>Vertaa näytönohjaimia</h1>
          <p className="lead">Valitse 2–4 näytönohjainta. Vertailu näyttää tekniset tiedot, suorituskykyindeksin ja hintakehityksen rinnakkain.</p>
        </div>
      </div>

      <section className="section section-tight">
        <div className="container">
          <div className="picker" role="group" aria-label="Valitut näytönohjaimet">
            {ids.map((id, i) => (
              <div key={i} className="picker-slot">
                <label className="select">
                  <span>Näytönohjain {i + 1}</span>
                  <select
                    value={id}
                    onChange={(e) => {
                      const next = [...ids];
                      next[i] = e.target.value;
                      update(next);
                    }}
                  >
                    {all.map((g) => (
                      <option key={g.id} value={g.id} disabled={ids.includes(g.id) && g.id !== id}>
                        {g.manufacturer} {g.name}
                      </option>
                    ))}
                  </select>
                </label>
                {ids.length > 2 && (
                  <button type="button" className="icon-btn" onClick={() => update(ids.filter((_, j) => j !== i))} aria-label={`Poista ${getGpuById(id)!.shortName} vertailusta`}>
                    <Icon name="close" size={16} />
                  </button>
                )}
                {i < ids.length - 1 && <span className="picker-vs" aria-hidden="true">vs</span>}
              </div>
            ))}
            {ids.length < 4 && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => update([...ids, all.find((g) => !ids.includes(g.id))!.id])}
              >
                <Icon name="plus" size={16} /> Lisää näytönohjain
              </button>
            )}
          </div>
          <div className="quick">
            <span className="muted small">Suositut vertailut:</span>
            {QUICK.map((q) => (
              <button key={q.join()} type="button" className="chip" onClick={() => update(q)}>
                {q.map((id) => getGpuById(id)!.shortName).join(' vs ')}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tight" aria-labelledby="vt-otsikko">
        <div className="container">
          <h2 id="vt-otsikko" className="sr-only">Vertailutaulukko</h2>
          <GPUComparison gpus={gpus} />
          <p className="small muted section-foot">
            <DemoBadge /> Hinnat ja suorituskykyindeksit ovat esimerkkidataa. Tekniset tiedot: valmistajien julkaisutiedot.
          </p>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="sv-otsikko">
        <div className="container">
          <div className="two-col">
            <div>
              <h2 id="sv-otsikko">Suorituskykyvertailu</h2>
              <PerformanceChart gpus={gpus} />
            </div>
            <div>
              <h2>Hintakehityksen vertailu</h2>
              <div className="chart-card">
                <PriceHistoryChart key={ids.join()} series={gpus.map((g) => ({ id: g.id, label: g.shortName }))} defaultRange="365" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
