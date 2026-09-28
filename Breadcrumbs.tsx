import type { Crumb } from './seo';

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (items.length < 2) return null;
  return (
    <nav className="breadcrumbs" aria-label="Murupolku">
      <ol>
        {items.map((c, i) => (
          <li key={c.href}>
            {i < items.length - 1 ? <a href={c.href}>{c.label}</a> : <span aria-current="page">{c.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
