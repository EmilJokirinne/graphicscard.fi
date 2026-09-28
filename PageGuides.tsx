import type { PageProps } from './pages';
import { articles } from './articles';
import { breadcrumbsFor } from './seo';
import Breadcrumbs from './Breadcrumbs';
import ArticleCard from './ArticleCard';

export default function PageGuides({ route }: PageProps) {
  const cats = Array.from(new Set(articles.map((a) => a.category)));
  return (
    <>
      <div className="page-head">
        <div className="container">
          <Breadcrumbs items={breadcrumbsFor(route)} />
          <h1>Oppaat</h1>
          <p className="lead">Selkeitä oppaita näytönohjaimen valintaan, teknisiin termeihin ja hintojen muodostumiseen.</p>
        </div>
      </div>
      {cats.map((c, i) => (
        <section key={c} className={`section ${i % 2 ? 'section-alt' : ''}`} aria-labelledby={`cat-${i}`}>
          <div className="container">
            <h2 id={`cat-${i}`}>{c}</h2>
            <div className="article-grid">
              {articles
                .filter((a) => a.category === c)
                .map((a) => (
                  <ArticleCard key={a.slug} article={a} />
                ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
