import { useMemo, useState } from 'react';
import type { PageProps } from './pages';
import { getBrand, getGpus, getGpusByBrand, getPerformance, getPriceSummary } from './dataService';
import { generations } from './generations';
import { breadcrumbsFor } from './seo';
import Breadcrumbs from './Breadcrumbs';
import GPUGrid from './GPUGrid';
import FilterPanel, { emptyFilters, matchesFilters, type Filters } from './FilterPanel';
import PerformanceChart from './PerformanceChart';
import { BrandTag, DemoBadge } from './ui';

const SORTS = [
  { id: 'perf', label: 'Suorituskyky' },
  { id: 'price-asc', label: 'Hinta: halvin ensin' },
  { id: 'price-desc', label: 'Hinta: kallein ensin' },
  { id: 'new', label: 'Uusimmat' },
  { id: 'change', label: 'Suurin hinnanlasku (30 pv)' },
] as const;

export default function PageGpuList({ route }: PageProps) {
  const brand = route.name === 'brand' ? getBrand(route.brand)! : null;
  const base = brand ? getGpusByBrand(brand.slug) : getGpus();
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [sort, setSort] = useState<(typeof SORTS)[number]['id']>('perf');

  const list = useMemo(() => {
    const f = base.filter((g) => matchesFilters(filters, g.brand, getPriceSummary(g.id)?.current ?? null));
    const price = (id: string) => getPriceSummary(id)?.current ?? 0;
    return [...f].sort((a, b) => {
      switch (sort) {
        case 'price-asc': return price(a.id) - price(b.id);
        case 'price-desc': return price(b.id) - price(a.id);
        case 'new': return b.launchDate.localeCompare(a.launchDate);
        case 'change': return (getPriceSummary(a.id)?.change30 ?? 0) - (getPriceSummary(b.id)?.change30 ?? 0);
        default: return (getPerformance(b.id) ?? 0) - (getPerformance(a.id) ?? 0);
      }
    });
  }, [base, filters, sort]);

  const gens = brand ? generations.filter((g) => g.brand === brand.slug) : [];

  return (
    <>
      <div className="page-head">
        <div className="container">
          <Breadcrumbs items={breadcrumbsFor(route)} />
          {brand ? (
            <>
              <BrandTag brand={brand.slug} label={`${brand.name} · ${brand.series}`} />
              <h1>{brand.name} {brand.series} -näytönohjaimet</h1>
              <p className="lead">{brand.lead}</p>
            </>
          ) : (
            <>
              <h1>Näytönohjaimet</h1>
              <p className="lead">
                Kaikki seurannassa olevat NVIDIA GeForce-, AMD Radeon- ja Intel Arc -näytönohjaimet. Suodata valmistajan tai hintaluokan mukaan
                ja avaa malli nähdäksesi tekniset tiedot, suorituskyvyn ja hintakehityksen.
              </p>
            </>
          )}
        </div>
      </div>

      <section className="section section-tight">
        <div className="container">
          <div className="list-toolbar">
            {!brand ? <FilterPanel value={filters} onChange={setFilters} count={list.length} /> : <span className="muted small">{list.length} mallia</span>}
            <label className="select">
              <span>Järjestys</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </label>
          </div>
          <GPUGrid gpus={list} />
          <p className="small muted section-foot">
            <DemoBadge /> Hinnat ja suorituskykyluokat perustuvat esimerkkidataan. Suositeltu resoluutio on suuntaa-antava arvio.
          </p>
        </div>
      </section>

      {brand && (
        <>
          <section className="section section-alt" aria-labelledby="mallisto">
            <div className="container">
              <h2 id="mallisto">Mallisto ja sukupolvet</h2>
              <div className="gen-mini">
                {gens.map((g) => (
                  <article key={g.id} className="gen-mini-card">
                    <h3>{g.name}</h3>
                    <p className="muted small">{g.year} · {g.architecture} · {g.process}</p>
                    <p>{g.models}</p>
                  </article>
                ))}
              </div>
              <p><a href="/sukupolvet">Vertaa kaikkia sukupolvia →</a></p>
            </div>
          </section>
          <section className="section" aria-labelledby="suorituskyky">
            <div className="container narrow">
              <h2 id="suorituskyky">Suorituskyky: {brand.name}-mallit</h2>
              <PerformanceChart gpus={base} />
            </div>
          </section>
        </>
      )}
    </>
  );
}
