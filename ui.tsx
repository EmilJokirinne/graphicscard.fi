// Pienet jaetut UI-osat: BrandTag, DemoBadge, Section, Icon
import type { ReactNode } from 'react';
import type { BrandSlug } from './types';

export function BrandTag({ brand, label }: { brand: BrandSlug; label?: string }) {
  const name = label ?? { nvidia: 'NVIDIA', amd: 'AMD', intel: 'Intel' }[brand];
  return (
    <span className={`brand-tag brand-${brand}${label === '' ? ' is-dot' : ''}`} title={label === '' ? { nvidia: 'NVIDIA', amd: 'AMD', intel: 'Intel' }[brand] : undefined}>
      <span className="brand-dot" aria-hidden="true" />
      {name}
    </span>
  );
}

export function DemoBadge({ label = 'Esimerkkidata' }: { label?: string }) {
  return (
    <span className="demo-badge" title="Luvut ovat havainnollistavaa esimerkkidataa, eivät todellisia hintoja.">
      <Icon name="info" size={13} />
      {label}
    </span>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  lead,
  actions,
  children,
  className = '',
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const hid = id ? `${id}-otsikko` : undefined;
  return (
    <section id={id} className={`section ${className}`} aria-labelledby={hid}>
      <div className="container">
        <div className="section-head">
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h2 id={hid}>{title}</h2>
            {lead && <p className="lead">{lead}</p>}
          </div>
          {actions && <div className="section-actions">{actions}</div>}
        </div>
        {children}
      </div>
    </section>
  );
}

const PATHS: Record<string, string> = {
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-4.35-4.35',
  info: 'M12 8h.01M11 12h1v5h1M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z',
  arrowRight: 'M5 12h14M13 6l6 6-6 6',
  arrowUp: 'M12 19V5M6 11l6-6 6 6',
  arrowDown: 'M12 5v14M6 13l6 6 6-6',
  minus: 'M5 12h14',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6 6 18',
  chart: 'M4 19h16M6 16l4-5 3 3 5-7',
  compare: 'M8 4v16M16 4v16M4 8h4M16 16h4',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  plus: 'M12 5v14M5 12h14',
  chevron: 'M9 6l6 6-6 6',
  check: 'M5 12l5 5 9-10',
  book: 'M5 4h10a4 4 0 0 1 4 4v12H9a4 4 0 0 1-4-4V4Zm0 12a4 4 0 0 1 4-4h10',
};

export function Icon({ name, size = 18, className = '' }: { name: keyof typeof PATHS | string; size?: number; className?: string }) {
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
