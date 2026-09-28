import { useState } from 'react';
import { BRANDS, DATA_UPDATED, getGpuById, getGpus, getGpusByBrand, getPopularGpus, getPriceSummary, PRICES_ARE_DEMO } from './dataService';
import { articles } from './articles';
import { siteFaq } from './siteFaq';
import { eur, fiDate } from './format';
import GPUGrid from './GPUGrid';
import PriceTracker from './PriceTracker';
import PriceHistoryChart from './PriceHistoryChart';
import PriceAnalysis from './PriceAnalysis';
import GPUComparison from './GPUComparison';
import HistoricalPrices from './HistoricalPrices';
import FAQ from './FAQ';
import HeroVisual from './HeroVisual';
import ArticleCard from './ArticleCard';
import { DemoBadge, Icon, Section } from './ui';

export default function PageHome() {
  const all = getGpus();
  const popular = getPopularGpus();
  const [chartId, setChartId] = useState('rtx-5080');
  const chartGpu = getGpuById(chartId)!;

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">Suomalainen näytönohjainten tietosivusto</p>
            <h1>Näytönohjaimet vertailussa</h1>
            <p className="hero-sub">Vertaa suorituskykyä, ominaisuuksia ja hintakehitystä – löydä sinulle sopiva näytönohjain.</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="/vertaa">
                <Icon name="compare" /> Vertaa näytönohjaimia
              </a>
              <a className="btn" href="/naytonohjaimet">
                <Icon name="grid" /> Selaa näytönohjaimia
              </a>
              <a className="btn" href="/hintakehitys">
                <Icon name="chart" /> Katso hintakehitys
              </a>
            </div>
            <ul className="hero-stats">
              <li><strong>{all.length}</strong> näytönohjainta</li>
              <li><strong>3</strong> valmistajaa</li>
              <li><strong>Päivittäinen</strong> hintahistoria</li>
            </ul>
            {PRICES_ARE_DEMO && (
              <p className="hero-demo">
                <DemoBadge /> Sivuston ensimmäinen versio: hinnat ja suorituskykyindeksit ovat esimerkkidataa.
              </p>
            )}
          </div>
          <div className="hero-art">
            <HeroVisual />
          </div>
        </div>
      </section>

      <Section
        id="suositut"
        eyebrow="Mallit"
        title="Suositut näytönohjaimet"
        lead="Nykyisten sukupolvien kysytyimmät mallit NVIDIAlta, AMD:lta ja Inteliltä."
        actions={<a className="btn btn-ghost" href="/naytonohjaimet">Kaikki näytönohjaimet <Icon name="arrowRight" size={16} /></a>}
      >
        <GPUGrid gpus={popular} />
      </Section>

      <Section
        id="hintaseuranta"
        eyebrow="Hintaseuranta"
        title="Näytönohjainten hinnat nyt"
        lead="Seuraa näytönohjainten hintojen muutoksia ja tarkista, miten nykyinen hinta vertautuu aikaisempaan hintatasoon."
        actions={<a className="btn btn-ghost" href="/hintakehitys">Kaikki hinnat <Icon name="arrowRight" size={16} /></a>}
        className="section-alt"
      >
        <PriceTracker gpus={popular} columns={['current', 'change7', 'change30', 'change90', 'change365', 'min', 'max', 'msrp']} />
        <p className="small muted section-foot">
          Päivitetty: {fiDate(DATA_UPDATED)} · Muutos = nykyinen hinta verrattuna hintaan valitun ajan takaa.
          {PRICES_ARE_DEMO && ' Lähde: esimerkkidata.'}
        </p>
      </Section>

      <Section id="hintakaavio" eyebrow="Hintakehitys" title="Hintakehitys ajan mittaan" lead="Valitse malli ja aikaväli. Vie osoitin kaavion päälle nähdäksesi päivämäärän, hinnan ja muutoksen edelliseen havaintoon.">
        <div className="chart-card">
          <div className="chart-card-head">
            <label className="select">
              <span>Näytönohjain</span>
              <select value={chartId} onChange={(e) => setChartId(e.target.value)}>
                {all.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.manufacturer} {g.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="chart-card-price">
              <span className="label">Hinta nyt</span>
              <strong className="price price-lg">{eur(getPriceSummary(chartId)!.current)}</strong>
            </div>
          </div>
          <PriceHistoryChart key={chartId} series={[{ id: chartId, label: chartGpu.shortName }]} title={chartGpu.shortName} />
          <PriceAnalysis gpu={chartGpu} />
        </div>
      </Section>

      <Section id="valmistajat" eyebrow="Valmistajat" title="NVIDIA, AMD ja Intel" lead="Kolme valmistajaa, kolme erilaista mallistoa. Tutustu kunkin valmistajan nykyisiin näytönohjaimiin." className="section-alt">
        <div className="brand-tiles">
          {BRANDS.map((b) => {
            const list = getGpusByBrand(b.slug);
            const prices = list.map((g) => getPriceSummary(g.id)?.current ?? 0).filter(Boolean);
            return (
              <a key={b.slug} href={`/naytonohjaimet/${b.slug}`} className={`brand-tile brand-${b.slug}`}>
                <span className="brand-tile-name">
                  <span className="brand-dot" aria-hidden="true" />
                  {b.name}
                </span>
                <span className="brand-tile-series">{b.series}</span>
                <p>{b.lead}</p>
                <span className="brand-tile-meta">
                  {list.length} mallia · {eur(Math.min(...prices))} – {eur(Math.max(...prices))}
                </span>
                <span className="brand-tile-link">
                  Katso mallisto <Icon name="arrowRight" size={16} />
                </span>
              </a>
            );
          })}
        </div>
      </Section>

      <Section
        id="vertailu"
        eyebrow="Vertailu"
        title="Näytönohjainten vertailu"
        lead="Aseta 2–4 näytönohjainta rinnakkain. Esimerkkinä RTX 5080 ja RTX 5070 Ti, joissa on sama grafiikkasuoritin ja muistimäärä."
        actions={<a className="btn btn-primary" href="/vertaa?gpu=rtx-5080,rtx-5070-ti">Avaa vertailutyökalu <Icon name="arrowRight" size={16} /></a>}
      >
        <GPUComparison gpus={[getGpuById('rtx-5080')!, getGpuById('rtx-5070-ti')!]} />
      </Section>

      <Section
        id="hintojen-muutos"
        eyebrow="Hintahistoria"
        title="Miten näytönohjainten hinnat ovat muuttuneet?"
        lead="Näytönohjainten hinnat eivät aina laske uuden sukupolven tullessa markkinoille. Vanhojen mallien hinnat voivat jopa nousta, jos tuotanto loppuu ja varastot vähenevät."
        className="section-alt"
      >
        <HistoricalPrices />
      </Section>

      <Section id="oppaat" eyebrow="Oppaat" title="Oppaat" lead="Perusteet selkeästi: näyttömuisti, resoluutiot, hinnat ja valmistajien erot." actions={<a className="btn btn-ghost" href="/oppaat">Kaikki oppaat <Icon name="arrowRight" size={16} /></a>}>
        <div className="article-grid">
          {articles.slice(0, 4).map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </Section>

      <Section id="ukk" eyebrow="UKK" title="Usein kysytyt kysymykset" className="section-alt">
        <FAQ items={siteFaq} />
      </Section>
    </>
  );
}
