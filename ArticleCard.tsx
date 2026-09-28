import type { Article } from './types';
import { Icon } from './ui';

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="article-card">
      <span className="article-cat">{article.category}</span>
      <h3>
        <a href={`/oppaat/${article.slug}`} className="stretched">{article.title}</a>
      </h3>
      <p>{article.description}</p>
      <span className="article-meta">
        <Icon name="book" size={14} /> {article.readingMinutes} min lukuaika
      </span>
    </article>
  );
}
