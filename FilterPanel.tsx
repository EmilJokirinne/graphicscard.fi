import type { BrandSlug } from './types';
import { BRANDS, PRICE_RANGES } from './dataService';

export interface Filters {
  brands: BrandSlug[];
  ranges: string[];
}

export const emptyFilters: Filters = { brands: [], ranges: [] };

export function matchesFilters(f: Filters, brand: BrandSlug, price: number | null): boolean {
  if (f.brands.length && !f.brands.includes(brand)) return false;
  if (f.ranges.length) {
    if (price === null) return false;
    const ok = PRICE_RANGES.filter((r) => f.ranges.includes(r.id)).some((r) => price >= r.min && price < r.max);
    if (!ok) return false;
  }
  return true;
}

function toggle<T>(list: T[], v: T): T[] {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

export default function FilterPanel({ value, onChange, count }: { value: Filters; onChange: (f: Filters) => void; count: number }) {
  const active = value.brands.length + value.ranges.length > 0;
  return (
    <div className="filters" role="group" aria-label="Suodattimet">
      <fieldset>
        <legend>Valmistaja</legend>
        <div className="chips">
          {BRANDS.map((b) => (
            <button
              key={b.slug}
              type="button"
              className={`chip brand-${b.slug}`}
              aria-pressed={value.brands.includes(b.slug)}
              onClick={() => onChange({ ...value, brands: toggle(value.brands, b.slug) })}
            >
              <span className="brand-dot" aria-hidden="true" />
              {b.name}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>Hintaluokka</legend>
        <div className="chips">
          {PRICE_RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              className="chip"
              aria-pressed={value.ranges.includes(r.id)}
              onClick={() => onChange({ ...value, ranges: toggle(value.ranges, r.id) })}
            >
              {r.label}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="filters-foot">
        <span className="muted small" aria-live="polite">{count} näytönohjainta</span>
        {active && (
          <button type="button" className="link-btn" onClick={() => onChange(emptyFilters)}>
            Tyhjennä suodattimet
          </button>
        )}
      </div>
    </div>
  );
}
