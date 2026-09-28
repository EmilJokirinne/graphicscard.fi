import { useEffect, useState } from 'react';
import { useNav } from './router';
import SearchBar from './SearchBar';
import { Icon } from './ui';

export const NAV = [
  { href: '/naytonohjaimet', label: 'Näytönohjaimet' },
  { href: '/vertaa', label: 'Vertaa' },
  { href: '/hintakehitys', label: 'Hintakehitys' },
  { href: '/naytonohjaimet/nvidia', label: 'NVIDIA' },
  { href: '/naytonohjaimet/amd', label: 'AMD' },
  { href: '/naytonohjaimet/intel', label: 'Intel' },
  { href: '/sukupolvet', label: 'Sukupolvet' },
  { href: '/oppaat', label: 'Oppaat' },
];

export function Logo() {
  return (
    <a href="/" className="logo" aria-label="graphicscard.fi – etusivu">
      <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
        <rect x="3" y="7" width="26" height="18" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="9" y="12" width="8" height="8" rx="1.5" style={{ fill: 'var(--accent)' }} />
        <path d="M21 12v8M25 12v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span>
        graphicscard<span className="logo-tld">.fi</span>
      </span>
    </a>
  );
}

export default function Header() {
  const { pathname } = useNav();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
  }, [open]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === '/' && !/input|textarea|select/i.test(t.tagName)) {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('.header-search input')?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const isActive = (href: string) =>
    href === '/naytonohjaimet' ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  return (
    <header className="header">
      <div className="container header-inner">
        <Logo />
        <nav className="nav-desktop" aria-label="Päävalikko">
          <ul>
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} aria-current={isActive(n.href) ? 'page' : undefined}>{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="header-search">
          <SearchBar />
        </div>
        <button
          className="menu-btn"
          aria-expanded={open}
          aria-controls="mobiilivalikko"
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? 'close' : 'menu'} size={22} />
          <span className="sr-only">{open ? 'Sulje valikko' : 'Avaa valikko'}</span>
        </button>
      </div>
      <div id="mobiilivalikko" className={`nav-mobile ${open ? 'is-open' : ''}`} hidden={!open}>
        <div className="container">
          <SearchBar onDone={() => setOpen(false)} />
          <ul>
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} aria-current={isActive(n.href) ? 'page' : undefined}>
                  {n.label}
                  <Icon name="chevron" size={16} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
