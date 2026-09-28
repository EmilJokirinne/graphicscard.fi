import type { PageProps } from './pages';
import { DATA_UPDATED, getRetailers, getSources } from './dataService';
import { breadcrumbsFor } from './seo';
import { fiDate } from './format';
import Breadcrumbs from './Breadcrumbs';
import { DemoBadge } from './ui';

function About() {
  return (
    <>
      <h1>Tietoa sivustosta</h1>
      <p className="lead">graphicscard.fi on suomalainen näytönohjainten tietosivusto ja hintaseuranta.</p>
      <div className="prose">
        <p>
          Sivuston tavoitteena on koota yhteen paikkaan näytönohjainten tekniset tiedot, suorituskyky, vertailu ja hintahistoria. Emme ole
          verkkokauppa emmekä myy tuotteita.
        </p>
        <h2>Periaatteet</h2>
        <ul>
          <li>Emme anna automaattisia ostosuosituksia. Kerromme havainnot neutraalisti: hinta on noussut, laskenut tai pysynyt vakaana.</li>
          <li>Jokainen hinta on sidottu päivämäärään ja lähteeseen.</li>
          <li>Esimerkkidata merkitään aina näkyvästi.</li>
          <li>Suorituskykyluvut ovat vertailuarvoja, eivät lupauksia tietystä ruudunpäivitysnopeudesta.</li>
        </ul>
        <p>graphicscard.fi ei ole NVIDIAn, AMD:n tai Intelin ylläpitämä. Tuotenimet ja tavaramerkit kuuluvat omistajilleen.</p>
      </div>
    </>
  );
}

function Sources() {
  const typeLabel = { demo: 'Esimerkkidata', manufacturer: 'Valmistaja', retailer: 'Jälleenmyyjä', aggregator: 'Hintavertailu', pending: 'Vahvistamatta' };
  return (
    <>
      <h1>Lähteet</h1>
      <p className="lead">Mistä sivuston tiedot tulevat ja miten ne on merkitty.</p>
      <div className="prose">
        <h2>Hintadatan periaatteet</h2>
        <ul>
          <li>Emme keksi hintoja. Jos todellista hintadataa ei ole saatavilla, käytämme selvästi merkittyä esimerkkidataa.</li>
          <li>Jokaisen hinnan yhteydessä näytetään päivityspäivä ja lähde.</li>
          <li>Hintahistoriassa säilytetään havaintojen päivämäärät, jotta muutoksen muodostuminen on nähtävissä.</li>
          <li>Historiallisia hintoja ei esitetä tämänhetkisinä hintoina.</li>
        </ul>
        <p>
          <DemoBadge /> Sivuston ensimmäisen version hinnat ja suorituskykyindeksit ovat esimerkkidataa (päivitetty {fiDate(DATA_UPDATED)}).
        </p>
        <h2>Lähdeluettelo</h2>
      </div>
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Lähde</th>
              <th scope="col">Tyyppi</th>
              <th scope="col">Käyttö</th>
            </tr>
          </thead>
          <tbody>
            {getSources().map((s) => (
              <tr key={s.id}>
                <td>{s.url ? <a href={s.url} target="_blank" rel="noopener">{s.name}</a> : s.name}</td>
                <td>{typeLabel[s.type]}</td>
                <td>{s.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="prose">
        <h2>Jälleenmyyjät</h2>
        <p>
          Kauppakohtaisia hintoja ei vielä näytetä. Hintaseurantaan on valmisteltu seuraavat suomalaiset jälleenmyyjät; hinnat lisätään vasta,
          kun data on todellista ja lähteistettyä:
        </p>
        <ul>
          {getRetailers().map((r) => (
            <li key={r.id}>{r.name}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

function Privacy() {
  return (
    <>
      <h1>Tietosuojakäytäntö</h1>
      <p className="lead">Päivitetty {fiDate(DATA_UPDATED)}.</p>
      <div className="prose">
        <p>
          graphicscard.fi ei vaadi rekisteröitymistä eikä kerää käyttäjiltä henkilötietoja lomakkeilla. Sivusto ei käytä mainosevästeitä.
        </p>
        <h2>Palvelinlokit</h2>
        <p>
          Palveluntarjoajamme palvelimet voivat tallentaa teknisiä lokitietoja (kuten IP-osoite, selaimen tyyppi ja pyydetty sivu) palvelun
          turvallisuuden ja toimivuuden varmistamiseksi.
        </p>
        <h2>Kävijätilastot</h2>
        <p>Jos sivustolle otetaan käyttöön kävijätilastointi, tämä seloste päivitetään ennen käyttöönottoa.</p>
        <h2>Yhteydenotot</h2>
        <p>Rekisterinpitäjän yhteystiedot lisätään tähän ennen sivuston julkaisua.</p>
      </div>
    </>
  );
}

export default function PageInfo({ route }: PageProps) {
  return (
    <div className="page-head page-info">
      <div className="container narrow">
        <Breadcrumbs items={breadcrumbsFor(route)} />
        {route.name === 'about' && <About />}
        {route.name === 'sources' && <Sources />}
        {route.name === 'privacy' && <Privacy />}
      </div>
    </div>
  );
}
