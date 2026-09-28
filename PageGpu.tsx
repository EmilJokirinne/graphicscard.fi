import type { PageProps } from './pages';
import { getGpu, getGpus, getPerformance, getPriceSummary, performanceClass, recommendedResolution } from './dataService';
import { breadcrumbsFor } from './seo';
import { gpuFaq } from './gpuFaq';
import { eur, fiDate, partitive } from './format';
import Breadcrumbs from './Breadcrumbs';
import GpuIllustration from './GpuIllustration';
import PriceCard from './PriceCard';
import PriceHistoryChart from './PriceHistoryChart';
import PriceAnalysis from './PriceAnalysis';
import SpecificationTable from './SpecificationTable';
import PerformanceChart from './PerformanceChart';
import ResolutionSuitability from './ResolutionSuitability';
import PriceChangeBadge from './PriceChangeBadge';
import SourceBadge from './SourceBadge';
import FAQ from './FAQ';
import { BrandTag, Icon } from './ui';

export default function PageGpu({ route }: PageProps) {
  if (route.name !== 'gpu') return null;
  const g = getGpu(route.brand, route.slug)!;
  const s = getPriceSummary(g.id);
  const perf = getPerformance(g.id);

  // Suorituskykyvertailu: malli + 2 lähintä kumpaankin suuntaan
  const ranked = getGpus()
    .filter((x) => getPerformance(x.id) !== null)
    .sort((a, b) => getPerformance(b.id)! - getPerformance(a.id)!);
  const pos = ranked.findIndex((x) => x.id === g.id);
  const neighbours = ranked.slice(Math.max(0, pos - 2), pos + 3);

  // Vertailuehdotukset: lähimmät suorituskyvyltään, muut valmistajat ensin
  const suggestions = ranked
    .filter((x) => x.id !== g.id)
    .sort((a, b) => Math.abs(getPerformance(a.id)! - perf!) - Math.abs(getPerformance(b.id)! - perf!))
    .slice(0, 3);

  return (
    <>
      <div className="page-head gpu-head">
        <div className="container">
          <Breadcrumbs items={breadcrumbsFor(route)} />
          <div className="gpu-hero">
            <div className="gpu-hero-copy">
              <BrandTag brand={g.brand} label={`${g.manufacturer} · ${g.series}`} />
              <h1>{g.manufacturer} {g.name}</h1>
              <ul className="facts">
                <li><span>Arkkitehtuuri</span><strong>{g.specs.architecture}</strong></li>
                <li><span>Näyttömuisti</span><strong>{g.specs.vramGb} Gt {g.specs.memoryType}</strong></li>
                <li><span>Julkaistu</span><strong>{fiDate(g.launchDate)}</strong></li>
                <li><span>Virrankulutus</span><strong>{g.specs.boardPowerW} W</strong></li>
                {perf && <li><span>Suorituskykyluokka</span><strong>{performanceClass(perf)}</strong></li>}
                {perf && <li><span>Suositeltu resoluutio</span><strong>{recommendedResolution(perf)}</strong></li>}
              </ul>
              {g.note && <p className="small muted">{g.note}</p>}
            </div>
            <div className="gpu-hero-side">
              <GpuIllustration gpu={g} />
              {s && (
                <div className="gpu-hero-price">
                  <div>
                    <span className="label">Nykyinen hinta</span>
                    <strong className="price price-xl">{eur(s.current)}</strong>
                  </div>
                  <PriceChangeBadge value={s.change30} label="30 pv" />
                  <SourceBadge sourceId={s.sourceId} date={s.updatedAt} compact />
                </div>
              )}
            </div>
          </div>
          <nav className="jump" aria-label="Sivun osiot">
            <a href="#hinta">Hinta</a>
            <a href="#tekniset-tiedot">Tekniset tiedot</a>
            <a href="#suorituskyky">Suorituskyky</a>
            <a href="#pelaaminen">Pelaaminen</a>
            <a href="#ukk">UKK</a>
          </nav>
        </div>
      </div>

      <section id="hinta" className="section" aria-labelledby="hinta-otsikko">
        <div className="container">
          <h2 id="hinta-otsikko">{g.shortName}: hinta ja hintakehitys</h2>
          <div className="gpu-price-layout">
            <PriceCard gpu={g} showName={false} />
            <div className="chart-card">
              <PriceHistoryChart series={[{ id: g.id, label: g.shortName }]} title={g.shortName} />
              <PriceAnalysis gpu={g} />
            </div>
          </div>
        </div>
      </section>

      <section id="tekniset-tiedot" className="section section-alt" aria-labelledby="tt-otsikko">
        <div className="container narrow">
          <h2 id="tt-otsikko">Tekniset tiedot</h2>
          <SpecificationTable gpu={g} />
        </div>
      </section>

      <section id="suorituskyky" className="section" aria-labelledby="sk-otsikko">
        <div className="container narrow">
          <h2 id="sk-otsikko">Suorituskyky</h2>
          {perf && (
            <p>
              {g.shortName} sijoittuu suorituskyvyltään tämän vertailun {performanceClass(perf).toLowerCase().replace('luokka', 'luokkaan')}{' '}
              (indeksi {perf}, RTX 5080 = 100).
            </p>
          )}
          <PerformanceChart gpus={neighbours} highlightId={g.id} />
        </div>
      </section>

      <section id="pelaaminen" className="section section-alt" aria-labelledby="pel-otsikko">
        <div className="container">
          <h2 id="pel-otsikko">Mihin pelaamiseen {g.shortName} sopii?</h2>
          <ResolutionSuitability gpu={g} />
        </div>
      </section>

      <section className="section" aria-labelledby="vert-otsikko">
        <div className="container">
          <h2 id="vert-otsikko">Vertaa {partitive(g.shortName)} muihin</h2>
          <div className="cmp-suggest">
            {suggestions.map((x) => (
              <a key={x.id} className="cmp-suggest-card" href={`/vertaa?gpu=${g.id},${x.id}`}>
                <span>{g.shortName}</span>
                <span className="vs">vs</span>
                <span>{x.shortName}</span>
                <Icon name="arrowRight" size={16} />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="ukk" className="section section-alt" aria-labelledby="ukk-otsikko">
        <div className="container narrow">
          <h2 id="ukk-otsikko">Usein kysyttyä: {g.shortName}</h2>
          <FAQ items={gpuFaq(g)} />
        </div>
      </section>
    </>
  );
}
