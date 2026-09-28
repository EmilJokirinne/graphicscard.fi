// Suomalaiset muotoilut: 1 397 €, -8,5 %, 28.9.2026

const nf0 = new Intl.NumberFormat('fi-FI', { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat('fi-FI', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

// Intl käyttää fi-FI:ssä sitovaa välilyöntiä ja miinusmerkkiä (U+2212); pidetään ne.
export const eur = (n: number) => `${nf0.format(n)} €`;
export const num = (n: number) => nf0.format(n);
export const usd = (n: number) => `${nf0.format(n)} USD`;

export function pct(n: number | null, withSign = true): string {
  if (n === null) return '–';
  const s = nf1.format(Math.abs(n));
  if (!withSign) return `${s} %`;
  if (Math.abs(n) < 0.05) return `0,0 %`;
  return `${n > 0 ? '+' : '−'}${s} %`;
}

export function fiDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d}.${m}.${y}`;
}

export function fiDateShort(iso: string): string {
  const [, m, d] = iso.split('-').map(Number);
  return `${d}.${m}.`;
}

const MONTHS = ['tammi', 'helmi', 'maalis', 'huhti', 'touko', 'kesä', 'heinä', 'elo', 'syys', 'loka', 'marras', 'joulu'];
const MONTHS_LONG = ['tammikuu', 'helmikuu', 'maaliskuu', 'huhtikuu', 'toukokuu', 'kesäkuu', 'heinäkuu', 'elokuu', 'syyskuu', 'lokakuu', 'marraskuu', 'joulukuu'];

export function fiMonth(iso: string, withYear = false): string {
  const [y, m] = iso.split('-').map(Number);
  const name = MONTHS[m - 1];
  return withYear ? `${name} ${String(y).slice(2)}` : name;
}

export function fiMonthLong(iso: string): string {
  const [y, m] = iso.split('-').map(Number);
  return `${MONTHS_LONG[m - 1]} ${y}`;
}

/** Mallinimen partitiivi: "RTX 5080:aa", "RX 9070 XT:tä", "RX 7900 XTX:ää". */
export function partitive(name: string): string {
  if (/XTX$/.test(name)) return `${name}:ää`;
  if (/(XT|Ti)$/.test(name)) return `${name}:tä`;
  return `${name}:aa`;
}

/** Mallinimen inessiivi: "RTX 5080:ssa", "RX 9070 XT:ssä". */
export function inessive(name: string): string {
  return /(XTX|XT|Ti)$/.test(name) ? `${name}:ssä` : `${name}:ssa`;
}
