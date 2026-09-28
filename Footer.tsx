import { Logo } from './Header';
import { DATA_UPDATED, PRICES_ARE_DEMO } from './dataService';
import { fiDate } from './format';

const LINKS = [
  { href: '/naytonohjaimet', label: 'Näytönohjaimet' },
  { href: '/vertaa', label: 'Vertailu' },
  { href: '/hintakehitys', label: 'Hintakehitys' },
  { href: '/oppaat', label: 'Oppaat' },
  { href: '/tietoa', label: 'Tietoa sivustosta' },
  { href: '/lahteet', label: 'Lähteet' },
  { href: '/tietosuoja', label: 'Tietosuojakäytäntö' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo />
            <p>Suomalainen näytönohjainten tietosivusto.</p>
          </div>
          <nav aria-label="Alatunnisteen linkit">
            <ul className="footer-links">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="footer-note">
          <p>
            <strong>Hintatiedot ovat suuntaa-antavia ja voivat muuttua. Tarkista aina jälleenmyyjän ajantasainen hinta.</strong>
          </p>
          <p>
            {PRICES_ARE_DEMO && 'Sivuston hinnat ja suorituskykyindeksit ovat tällä hetkellä esimerkkidataa. '}
            Hintadata päivitetty {fiDate(DATA_UPDATED)}. Tuotenimet ja tavaramerkit kuuluvat omistajilleen; graphicscard.fi ei ole NVIDIAn, AMD:n tai Intelin ylläpitämä.
          </p>
          <p className="footer-copy">© 2026 graphicscard.fi</p>
        </div>
      </div>
    </footer>
  );
}
