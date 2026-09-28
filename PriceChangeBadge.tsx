import { pct } from './format';
import { Icon } from './ui';

/**
 * Hinnan muutos neutraalisti: nuoli + etumerkki + teksti, ei pelkkä väri.
 * Lasku = "down", nousu = "up", alle ±0,5 % = "vakaa".
 */
export default function PriceChangeBadge({ value, label, size = 'md' }: { value: number | null; label?: string; size?: 'sm' | 'md' }) {
  if (value === null) {
    return <span className={`chg chg-na chg-${size}`}>{label && <span className="chg-label">{label}</span>}–</span>;
  }
  const dir = Math.abs(value) < 0.5 ? 'flat' : value > 0 ? 'up' : 'down';
  const icon = dir === 'flat' ? 'minus' : dir === 'up' ? 'arrowUp' : 'arrowDown';
  const sr = dir === 'flat' ? 'hinta pysynyt vakaana' : dir === 'up' ? 'hinta noussut' : 'hinta laskenut';
  return (
    <span className={`chg chg-${dir} chg-${size}`}>
      {label && <span className="chg-label">{label}</span>}
      <Icon name={icon} size={size === 'sm' ? 12 : 14} />
      <span>{pct(value)}</span>
      <span className="sr-only">, {sr}</span>
    </span>
  );
}
