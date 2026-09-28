import SearchBar from './SearchBar';

export default function PageNotFound() {
  return (
    <div className="page-head notfound">
      <div className="container narrow">
        <p className="eyebrow">404</p>
        <h1>Sivua ei löytynyt</h1>
        <p className="lead">Hakemaasi sivua ei ole olemassa tai se on siirretty. Hae näytönohjainta tai palaa etusivulle.</p>
        <SearchBar />
        <p>
          <a className="btn" href="/">Etusivulle</a> <a className="btn btn-ghost" href="/naytonohjaimet">Kaikki näytönohjaimet</a>
        </p>
      </div>
    </div>
  );
}
