import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType, type MouseEvent } from 'react';
import { NavContext, matchRoute, normalizePath, type Route } from './router';
import { loaders, type PageProps } from './pages';
import { buildMeta, type Meta } from './seo';
import Header from './Header';
import Footer from './Footer';

interface Props {
  initialPath: string;
  initialRoute: Route;
  initialPage: ComponentType<PageProps>;
}

export function applyHead(meta: Meta) {
  document.title = meta.title;
  const setMeta = (sel: string, attr: string, key: string, value: string) => {
    let el = document.head.querySelector<HTMLMetaElement>(sel);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.content = value;
  };
  setMeta('meta[name="description"]', 'name', 'description', meta.description);
  setMeta('meta[property="og:title"]', 'property', 'og:title', meta.title);
  setMeta('meta[property="og:description"]', 'property', 'og:description', meta.description);
  setMeta('meta[property="og:url"]', 'property', 'og:url', meta.canonical);
  setMeta('meta[property="og:type"]', 'property', 'og:type', meta.ogType);
  setMeta('meta[name="robots"]', 'name', 'robots', meta.robots ?? 'index,follow');
  const canon = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canon) canon.href = meta.canonical;
  document.head.querySelectorAll('script[data-seo]').forEach((s) => s.remove());
  for (const ld of meta.jsonLd) {
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.dataset.seo = '';
    s.textContent = JSON.stringify(ld);
    document.head.appendChild(s);
  }
}

export default function App({ initialPath, initialRoute, initialPage }: Props) {
  const [state, setState] = useState({ path: initialPath, route: initialRoute, Page: initialPage });
  const [search, setSearch] = useState('');
  const navId = useRef(0);

  const go = useCallback(async (href: string, push: boolean, scroll: boolean, replace = false) => {
    const url = new URL(href, window.location.href);
    const path = normalizePath(url.pathname);
    const route = matchRoute(path);
    const id = ++navId.current;
    const mod = await loaders[route.name]();
    if (id !== navId.current) return;
    if (push) window.history[replace ? 'replaceState' : 'pushState']({}, '', url.pathname + url.search + url.hash);
    setState({ path, route, Page: mod.default });
    setSearch(url.search);
    applyHead(buildMeta(route));
    if (scroll) {
      if (url.hash) document.getElementById(url.hash.slice(1))?.scrollIntoView();
      else window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    setSearch(window.location.search);
    const onPop = () => go(window.location.href, false, false);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [go]);

  const nav = useMemo(
    () => ({
      pathname: state.path,
      search,
      navigate: (href: string, opts?: { replace?: boolean; scroll?: boolean }) =>
        go(href, true, opts?.scroll ?? true, opts?.replace),
    }),
    [state.path, search, go],
  );

  // Delegoitu linkkien käsittely: kaikki sisäiset <a href="/..."> -linkit navigoivat ilman sivunlatausta.
  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as HTMLElement).closest('a');
    if (!a || a.target || a.hasAttribute('download')) return;
    const href = a.getAttribute('href');
    if (!href || !href.startsWith('/') || href.startsWith('//')) return;
    e.preventDefault();
    const url = new URL(href, window.location.href);
    if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) {
      document.getElementById(url.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState({}, '', href);
      return;
    }
    nav.navigate(href);
  };

  const { Page, route } = state;
  return (
    <NavContext.Provider value={nav}>
      <div className="site" onClick={onClick}>
        <a className="skip" href="#sisalto">Siirry sisältöön</a>
        <Header />
        <main id="sisalto" tabIndex={-1}>
          <Page route={route} />
        </main>
        <Footer />
      </div>
    </NavContext.Provider>
  );
}
