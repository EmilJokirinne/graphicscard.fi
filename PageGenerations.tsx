import type { PageProps } from './pages';
import { BRANDS } from './dataService';
import { generations } from './generations';
import { breadcrumbsFor } from './seo';
import Breadcrumbs from './Breadcrumbs';
import { BrandTag } from './ui';

export default function PageGenerations({ route }: PageProps) {
  return (
    <>
      <div className="page-head">
        <div className="container">
          <Breadcrumbs items={breadcrumbsFor(route)} />
          <h1>Näytönohjainten sukupolvet</h1>
          <p className="lead">
            Vertaa NVIDIA-, AMD- ja Intel-näytönohjainten sukupolvia: julkaisuvuosi, arkkitehtuuri, valmistustekniikka, näyttömuisti,
            suorituskykyluokka ja valmistajan julkaisuhintojen vaihteluväli.
          </p>
        </div>
      </div>

      {BRANDS.map((b, bi) => {
        const rows = generations.filter((g) => g.brand === b.slug);
        return (
          <section key={b.slug} className={`section ${bi % 2 ? 'section-alt' : ''}`} aria-labelledby={`gen-${b.slug}`}>
            <div className="container">
              <div className="gen-head">
                <BrandTag brand={b.slug} />
                <h2 id={`gen-${b.slug}`}>{b.name}: {b.series}</h2>
              </div>
              <div className="gen-grid">
                {rows.map((g) => (
                  <article key={g.id} className="gen-card">
                    <header>
                      <h3>{g.name}</h3>
                      <span className="gen-year">{g.year}</span>
                    </header>
                    <dl>
                      <div><dt>Julkaisuvuosi</dt><dd>{g.year}</dd></div>
                      <div><dt>Arkkitehtuuri</dt><dd>{g.architecture}</dd></div>
                      <div><dt>Valmistustekniikka</dt><dd>{g.process}</dd></div>
                      <div><dt>Näyttömuisti</dt><dd>{g.vramRange}</dd></div>
                      <div><dt>Suorituskykyluokka</dt><dd>{g.performanceClass}</dd></div>
                      <div><dt>Julkaisuhinnat</dt><dd>{g.typicalPriceClass}</dd></div>
                    </dl>
                    <p className="small muted">Mallit: {g.models}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section className="section" aria-labelledby="gen-huom">
        <div className="container narrow">
          <h2 id="gen-huom">Huomioita sukupolvien vertailusta</h2>
          <p>
            Julkaisuhinnat ovat valmistajien Yhdysvaltain suositushintoja ilman veroja sukupolven edullisimmasta kalleimpaan malliin.
            Suomalaiset kauppahinnat sisältävät arvonlisäveron ja vaihtelevat saatavuuden mukaan.
          </p>
          <p>
            Sukupolvien välinen suorituskykyero riippuu mallista: uuden sukupolven keskiluokan kortti voi olla nopeampi tai hitaampi kuin
            edellisen sukupolven huippumalli. Vertaa yksittäisiä malleja <a href="/vertaa">vertailutyökalulla</a>.
          </p>
        </div>
      </section>
    </>
  );
}
