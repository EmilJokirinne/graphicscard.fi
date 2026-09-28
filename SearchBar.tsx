import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { getGpus, getPriceSummary, gpuPath } from './dataService';
import { useNav } from './router';
import { eur } from './format';
import { BrandTag, Icon } from './ui';
import type { Gpu } from './types';

interface Result {
  key: string;
  gpu: Gpu;
  title: string;
  subtitle: string;
}

const norm = (s: string) => s.toLowerCase().replace(/geforce|radeon/g, '').replace(/[\s-]+/g, '');

export function searchGpus(query: string): Result[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const nq = norm(q);
  const out: Result[] = [];
  for (const g of getGpus()) {
    const brandHit = g.manufacturer.toLowerCase().startsWith(q) || g.brand.startsWith(q) || g.series.toLowerCase().includes(q);
    const nameHit = norm(`${g.manufacturer} ${g.name}`).includes(nq) || g.aliases.some((a) => norm(a).includes(nq));
    if (brandHit || nameHit) {
      out.push({ key: g.id, gpu: g, title: `${g.manufacturer} ${g.name}`, subtitle: `${g.specs.vramGb} Gt ${g.specs.memoryType} · ${g.series}` });
    }
    const modelHit = norm(g.name).includes(nq) || g.aliases.some((a) => norm(a).includes(nq));
    if (modelHit && nq.length >= 2) {
      for (const v of g.variants) {
        out.push({ key: `${g.id}-${v.name}`, gpu: g, title: `${v.maker} ${v.name}`, subtitle: `Kumppanimalli · tiedot mallisivulla ${g.shortName}` });
      }
    }
  }
  // Tarkat mallinimet ensin, kumppanimallit perään
  return out.slice(0, 10);
}

export default function SearchBar({ onDone, autoFocus = false }: { onDone?: () => void; autoFocus?: boolean }) {
  const { navigate } = useNav();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => searchGpus(q), [q]);

  const go = (r: Result) => {
    setOpen(false);
    setQ('');
    inputRef.current?.blur();
    onDone?.();
    navigate(gpuPath(r.gpu));
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault();
      go(results[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const showList = open && q.trim().length > 0;

  return (
    <div className="search" role="search">
      <label className="search-field">
        <Icon name="search" size={17} />
        <span className="sr-only">Hae näytönohjainta</span>
        <input
          ref={inputRef}
          type="search"
          value={q}
          autoFocus={autoFocus}
          placeholder="Hae näytönohjainta"
          autoComplete="off"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-activedescendant={showList && results[active] ? `${listId}-${active}` : undefined}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setActive(0);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={onKey}
        />
        <kbd className="search-kbd" aria-hidden="true">/</kbd>
      </label>
      {showList && (
        <ul className="search-results" id={listId} role="listbox">
          {results.length === 0 && <li className="search-empty">Ei tuloksia haulla ”{q}”. Kokeile esim. ”5080” tai ”AMD”.</li>}
          {results.map((r, i) => {
            const s = getPriceSummary(r.gpu.id);
            return (
              <li
                key={r.key}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                className={i === active ? 'is-active' : ''}
                onMouseDown={(e) => {
                  e.preventDefault();
                  go(r);
                }}
                onMouseEnter={() => setActive(i)}
              >
                <BrandTag brand={r.gpu.brand} />
                <span className="search-title">
                  {r.title}
                  <small>{r.subtitle}</small>
                </span>
                {s && <span className="search-price">{eur(s.current)}</span>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
