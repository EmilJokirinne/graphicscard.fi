import type { FaqItem } from './types';

/** Natiivi <details> – toimii ilman JavaScriptiä ja on saavutettava. */
export default function FAQ({ items }: { items: FaqItem[] }) {
  return (
    <div className="faq">
      {items.map((f) => (
        <details key={f.q} className="faq-item">
          <summary>
            <h3>{f.q}</h3>
            <span className="faq-toggle" aria-hidden="true" />
          </summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
