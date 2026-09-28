import type { PageProps } from './pages';
import { getArticle } from './articles';
import { breadcrumbsFor } from './seo';
import { fiDate } from './format';
import Breadcrumbs from './Breadcrumbs';
import ArticleCard from './ArticleCard';
import { Icon } from './ui';

export default function PageArticle({ route }: PageProps) {
  if (route.name !== 'article') return null;
  const a = getArticle(route.slug)!;
  const related = (a.related ?? []).map(getArticle).filter((x) => x !== undefined);
  return (
    <article className="article">
      <div className="page-head">
        <div className="container narrow">
          <Breadcrumbs items={breadcrumbsFor(route)} />
          <span className="article-cat">{a.category}</span>
          <h1>{a.title}</h1>
          <p className="lead">{a.description}</p>
          <p className="article-meta">
            Julkaistu <time dateTime={a.published}>{fiDate(a.published)}</time>
            {a.updated !== a.published && <> · Päivitetty <time dateTime={a.updated}>{fiDate(a.updated)}</time></>}
            {' · '}{a.readingMinutes} min lukuaika
          </p>
        </div>
      </div>
      <div className="section section-tight">
        <div className="container narrow prose">
          {a.body.map((b, i) => {
            switch (b.type) {
              case 'p': return <p key={i}>{b.text}</p>;
              case 'h2': return <h2 key={i}>{b.text}</h2>;
              case 'ul': return <ul key={i}>{b.items.map((t) => <li key={t}>{t}</li>)}</ul>;
              case 'note': return <aside key={i} className="note"><Icon name="info" size={16} /> {b.text}</aside>;
              case 'links':
                return (
                  <div key={i} className="prose-links">
                    {b.items.map((l) => (
                      <a key={l.href} href={l.href} className="btn btn-ghost">{l.label} <Icon name="arrowRight" size={16} /></a>
                    ))}
                  </div>
                );
            }
          })}
        </div>
      </div>
      {related.length > 0 && (
        <section className="section section-alt" aria-labelledby="liittyvat">
          <div className="container">
            <h2 id="liittyvat">Lue myös</h2>
            <div className="article-grid">
              {related.map((r) => <ArticleCard key={r!.slug} article={r!} />)}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
