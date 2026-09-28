import type { Route } from './router';
import { SITE_URL, getBrand, getGpu, getPerformance, gpuPath } from './dataService';
import { getArticle } from './articles';
import { siteFaq } from './siteFaq';
import { gpuFaq } from './gpuFaq';
import { fiDate, partitive } from './format';

export interface Crumb {
  label: string;
  href: string;
}

export interface Meta {
  title: string;
  description: string;
  canonical: string;
  robots?: string;
  ogType: 'website' | 'article' | 'product';
  jsonLd: object[];
}

const SITE = 'graphicscard.fi';

export function breadcrumbsFor(route: Route): Crumb[] {
  const home = { label: 'Etusivu', href: '/' };
  const list = { label: 'Näytönohjaimet', href: '/naytonohjaimet' };
  switch (route.name) {
    case 'gpuList':
      return [home, list];
    case 'brand': {
      const b = getBrand(route.brand)!;
      return [home, list, { label: b.name, href: `/naytonohjaimet/${b.slug}` }];
    }
    case 'gpu': {
      const b = getBrand(route.brand)!;
      const g = getGpu(route.brand, route.slug)!;
      return [home, list, { label: b.name, href: `/naytonohjaimet/${b.slug}` }, { label: g.shortName, href: gpuPath(g) }];
    }
    case 'compare':
      return [home, { label: 'Vertaa', href: '/vertaa' }];
    case 'prices':
      return [home, { label: 'Hintakehitys', href: '/hintakehitys' }];
    case 'generations':
      return [home, { label: 'Sukupolvet', href: '/sukupolvet' }];
    case 'guides':
      return [home, { label: 'Oppaat', href: '/oppaat' }];
    case 'article': {
      const a = getArticle(route.slug)!;
      return [home, { label: 'Oppaat', href: '/oppaat' }, { label: a.title, href: `/oppaat/${a.slug}` }];
    }
    case 'about':
      return [home, { label: 'Tietoa sivustosta', href: '/tietoa' }];
    case 'sources':
      return [home, { label: 'Lähteet', href: '/lahteet' }];
    case 'privacy':
      return [home, { label: 'Tietosuojakäytäntö', href: '/tietosuoja' }];
    default:
      return [];
  }
}

function breadcrumbLd(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: SITE_URL + (c.href === '/' ? '/' : c.href),
    })),
  };
}

export function faqLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function canonicalPath(route: Route): string {
  switch (route.name) {
    case 'home': return '/';
    case 'gpuList': return '/naytonohjaimet';
    case 'brand': return `/naytonohjaimet/${route.brand}`;
    case 'gpu': return `/naytonohjaimet/${route.brand}/${route.slug}`;
    case 'compare': return '/vertaa';
    case 'prices': return '/hintakehitys';
    case 'generations': return '/sukupolvet';
    case 'guides': return '/oppaat';
    case 'article': return `/oppaat/${route.slug}`;
    case 'about': return '/tietoa';
    case 'sources': return '/lahteet';
    case 'privacy': return '/tietosuoja';
    default: return '/404';
  }
}

export function buildMeta(route: Route): Meta {
  const canonical = SITE_URL + canonicalPath(route);
  const crumbs = breadcrumbsFor(route);
  const crumbLd = crumbs.length ? [breadcrumbLd(crumbs)] : [];
  const base = { canonical, ogType: 'website' as const, jsonLd: crumbLd };

  switch (route.name) {
    case 'home':
      return {
        ...base,
        title: 'Näytönohjaimet vertailussa – hinnat, suorituskyky ja hintakehitys | graphicscard.fi',
        description:
          'Suomalainen näytönohjainten tietosivusto: vertaa NVIDIA-, AMD- ja Intel-näytönohjainten suorituskykyä, teknisiä tietoja ja hintakehitystä.',
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: SITE,
            url: SITE_URL + '/',
            inLanguage: 'fi-FI',
            description: 'Suomalainen näytönohjainten tietosivusto.',
          },
          faqLd(siteFaq),
        ],
      };
    case 'gpuList':
      return {
        ...base,
        title: 'Näytönohjaimet – kaikki mallit, tekniset tiedot ja hinnat | graphicscard.fi',
        description: 'Selaa NVIDIA GeForce-, AMD Radeon- ja Intel Arc -näytönohjaimia. Näyttömuisti, suorituskykyluokka, hinta ja hinnan muutos yhdellä silmäyksellä.',
      };
    case 'brand': {
      const b = getBrand(route.brand)!;
      return {
        ...base,
        title: `${b.name} ${b.series} -näytönohjaimet – mallit ja hinnat | graphicscard.fi`,
        description: `Kaikki ${b.name} ${b.series} -näytönohjaimet: tekniset tiedot, suorituskyky, nykyinen hinta ja hintakehitys.`,
      };
    }
    case 'gpu': {
      const g = getGpu(route.brand, route.slug)!;
      const perf = getPerformance(g.id);
      return {
        ...base,
        ogType: 'product',
        title: `${g.shortName} – Hinta, suorituskyky ja tekniset tiedot | graphicscard.fi`,
        description: `Katso ${g.manufacturer} ${g.name}:n tekniset tiedot, suorituskyky, hinnat ja hintakehitys. Vertaa ${partitive(g.shortName)} muihin näytönohjaimiin.`,
        jsonLd: [
          ...crumbLd,
          {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: `${g.manufacturer} ${g.name}`,
            brand: { '@type': 'Brand', name: g.manufacturer },
            category: 'Näytönohjain',
            releaseDate: g.launchDate,
            description: `${g.manufacturer} ${g.name}: ${g.specs.vramGb} Gt ${g.specs.memoryType}, ${g.specs.architecture}-arkkitehtuuri, julkaistu ${fiDate(g.launchDate)}.`,
            additionalProperty: [
              { '@type': 'PropertyValue', name: 'Näyttömuisti', value: `${g.specs.vramGb} Gt ${g.specs.memoryType}` },
              { '@type': 'PropertyValue', name: 'Arkkitehtuuri', value: g.specs.architecture },
              { '@type': 'PropertyValue', name: 'Virrankulutus', value: `${g.specs.boardPowerW} W` },
              ...(perf ? [{ '@type': 'PropertyValue', name: 'Suorituskykyindeksi (RTX 5080 = 100)', value: perf }] : []),
            ],
            // Offers lisätään, kun sivustolla on oikeaa, lähteistettyä hintadataa.
          },
          faqLd(gpuFaq(g)),
        ],
      };
    }
    case 'compare':
      return {
        ...base,
        title: 'Vertaa näytönohjaimia – tekniset tiedot, suorituskyky ja hinnat | graphicscard.fi',
        description: 'Valitse 2–4 näytönohjainta ja vertaa näyttömuistia, arkkitehtuuria, virrankulutusta, suorituskykyä ja hintakehitystä rinnakkain.',
      };
    case 'prices':
      return {
        ...base,
        title: 'Näytönohjainten hintakehitys – hinnat nyt ja aiemmin | graphicscard.fi',
        description: 'Seuraa näytönohjainten hintojen muutoksia 30 päivän, 90 päivän ja vuoden ajalta. Suodata valmistajan ja hintaluokan mukaan.',
      };
    case 'generations':
      return {
        ...base,
        title: 'Näytönohjainten sukupolvet – RTX 30–50, RX 6000–9000, Arc | graphicscard.fi',
        description: 'Vertaa näytönohjainsukupolvia: julkaisuvuosi, arkkitehtuuri, valmistustekniikka, näyttömuisti ja hintaluokka.',
      };
    case 'guides':
      return {
        ...base,
        title: 'Oppaat – näytönohjaimet selkeästi selitettynä | graphicscard.fi',
        description: 'Oppaita näytönohjaimen valintaan: VRAM, resoluutiot, NVIDIA vs AMD, hintojen muodostuminen ja sukupolvet.',
      };
    case 'article': {
      const a = getArticle(route.slug)!;
      return {
        ...base,
        ogType: 'article',
        title: `${a.title} | graphicscard.fi`,
        description: a.description,
        jsonLd: [
          ...crumbLd,
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: a.title,
            description: a.description,
            inLanguage: 'fi-FI',
            datePublished: a.published,
            dateModified: a.updated,
            author: { '@type': 'Organization', name: SITE },
            publisher: { '@type': 'Organization', name: SITE },
            mainEntityOfPage: canonical,
          },
        ],
      };
    }
    case 'about':
      return { ...base, title: 'Tietoa sivustosta | graphicscard.fi', description: 'graphicscard.fi on suomalainen näytönohjainten tietosivusto ja hintaseuranta. Näin sivusto toimii.' };
    case 'sources':
      return { ...base, title: 'Lähteet ja hintadatan periaatteet | graphicscard.fi', description: 'Mistä graphicscard.fi:n tekniset tiedot, suorituskykyarviot ja hintatiedot tulevat, ja miten esimerkkidata on merkitty.' };
    case 'privacy':
      return { ...base, title: 'Tietosuojakäytäntö | graphicscard.fi', description: 'graphicscard.fi:n tietosuojakäytäntö.' };
    default:
      return {
        ...base,
        robots: 'noindex',
        title: 'Sivua ei löytynyt | graphicscard.fi',
        description: 'Hakemaasi sivua ei löytynyt.',
      };
  }
}
