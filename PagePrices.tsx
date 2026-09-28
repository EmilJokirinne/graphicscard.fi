import { useMemo, useState } from 'react';
import type { PageProps } from './pages';
import { DATA_UPDATED, getGpuById, getGpus, getPriceSummary } from './dataService';
import { breadcrumbsFor } from './seo';
import { fiDate } from './format';
import Breadcrumbs from './Breadcrumbs';
import FilterPanel, { emptyFilters, matchesFilters, type Filters } from './FilterPanel';
import PriceTracker from './PriceTracker';
import PriceHistoryChart from './PriceHistoryChart';
import HistoricalPrices from './HistoricalPrices';
import SourceBadge from './SourceBadge';

export default function PagePrices({ route }: PageProps) {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const list = useMemo(
    () => getGpus().filter((g) => matchesFilters(filters, g.brand, getPriceSummary(g.id)?.current ?? null)),
    [filters],
  );
  const flagship = ['rtx-5090', 'rtx-5080', 'rx-9070-xt', 'arc-b580'].map((id) => getGpuById(id)!);

  return (
    <>
      <div className="page-head">
        <div className="container">
          <Breadcrumbs items={breadcrumbsFor(route)} />
          <h1>Näytönohjainten hintakehitys</h1>
          <p className="lead">
            Grafiikkakorttien hinnat voivat muuttua merkittävästi saatavuuden, kysynnän, uusien mallien julkaisujen ja komponenttikustannusten
            perusteella. Tällä sivulla voit tarkastella eri mallien hintojen kehitystä ajan mittaan.
          </p>
          <SourceBadge sourceId="demo" date={DATA_UPDATED} />
        </div>
      </div>

      <section className="section section-tight" aria-labelledby="taulukko">
        <div className="container">
          <h2 id="taulukko" className="sr-only">Hintataulukko</h2>
          <FilterPanel value={filters} onChange={setFilters} count={list.length} />
          <PriceTracker gpus={list} columns={['current', 'change30', 'change90', 'change365', 'min']} />
          <p className="small muted section-foot">
            Muutos = nykyinen hinta verrattuna hintaan 30 päivää, 90 päivää tai vuosi sitten. Alin hinta = seurantajakson alin havaittu hinta.
            Lajittele napsauttamalla sarakkeen otsikkoa. Päivitetty {fiDate(DATA_UPDATED)}.
          </p>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="vertailukaavio">
        <div className="container">
          <h2 id="vertailukaavio">Hintakehitys: eri hintaluokkien mallit</h2>
          <p className="lead">Neljä mallia eri hintaluokista samassa kaaviossa. Valitse omat mallisi vertailutyökalussa.</p>
          <div className="chart-card">
            <PriceHistoryChart series={flagship.map((g) => ({ id: g.id, label: g.shortName }))} defaultRange="365" height={340} />
          </div>
          <p className="small">
            <a href={`/vertaa?gpu=${flagship.map((g) => g.id).join(',')}`}>Avaa nämä vertailutyökaluun →</a>
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="historia">
        <div className="container">
          <h2 id="historia">Miten näytönohjainten hinnat ovat muuttuneet?</h2>
          <p className="lead">
            Uuden sukupolven julkaisu ei aina laske vanhempien mallien hintoja. Kun tuotanto loppuu ja varastot vähenevät, hinta voi myös nousta.
          </p>
          <HistoricalPrices />
          <p>
            Lue lisää: <a href="/oppaat/miksi-naytonohjainten-hinnat-muuttuvat">Miksi näytönohjainten hinnat muuttuvat?</a>
          </p>
        </div>
      </section>
    </>
  );
}
