# graphicscard.fi

Suomalainen näytönohjainten tietosivusto ja hintaseuranta: tekniset tiedot, suorituskyky, vertailu ja hintahistoria.

**Tila:** ensimmäinen versio. Frontend toimii kokonaan **demo-datalla**. Hinnat ja suorituskykyindeksit on merkitty käyttöliittymässä merkinnällä *Esimerkkidata*. Tekniset tiedot ja julkaisuhinnat (USD) tulevat valmistajien julkaisutiedoista.

## Käyttö

```bash
npm install
npm run build      # -> dist/ (esirenderöidyt HTML-sivut + JS/CSS)
npm run preview    # http://localhost:4173
npm run dev        # kehityspalvelin http://localhost:5173
npm run typecheck  # TypeScript-tarkistus
npm run data:demo  # generoi demo-hintadatan uudelleen (Node 22+)
```

Kaikki tiedostot ovat projektin juuressa (ei alikansioita). Build luo `dist/`-kansion, jonka sisältö ladataan palvelimelle sellaisenaan.

## Tekninen ratkaisu

- **React 19 + TypeScript**, build **esbuildillä** (`build.mjs`).
- **Esirenderöinti (SSG):** jokainen reitti renderöidään buildissa valmiiksi HTML:ksi (`/hintakehitys/index.html` jne.), jolloin hakukoneet ja käyttäjä näkevät sisällön heti. Selain hydratoi sivun ja jatkaa SPA-navigoinnilla.
- **Code splitting:** jokainen sivutyyppi on oma chunkinsa; hintahistoria (`prices-history.json`) ladataan vasta, kun kaavio tarvitsee sitä.
- **SEO:** sivukohtaiset title/description/canonical/Open Graph, `sitemap.xml`, `robots.txt`, JSON-LD (WebSite, BreadcrumbList, Product, FAQPage, Article).
- **Kaaviot** ovat omaa SVG:tä (ei kaaviokirjastoa): aikaväli 7 pv / 30 pv / 6 kk / 1 v / Kaikki, tarkkuus Päivä / Viikko / Kuukausi / Vuosi, hover-tooltip, datataulukkonäkymä.
- **Hosting:** mikä tahansa staattinen palvelin. `.htaccess` (Apache) ja `_headers` (Netlify / Cloudflare Pages) mukana.

## Reitit

| Polku | Sisältö |
| --- | --- |
| `/` | Etusivu |
| `/naytonohjaimet` | Kaikki mallit, suodattimet ja järjestys |
| `/naytonohjaimet/nvidia` · `/amd` · `/intel` | Valmistajasivut (`/nvidia` jne. ohjaavat kanonisesti näihin) |
| `/naytonohjaimet/<valmistaja>/<malli>` | Mallisivu, esim. `/naytonohjaimet/nvidia/geforce-rtx-5080` |
| `/vertaa?gpu=rtx-5080,rtx-5070-ti` | Vertailutyökalu (2–4 mallia) |
| `/hintakehitys` | Hintataulukko, suodattimet, historia |
| `/sukupolvet` | Sukupolvien vertailu |
| `/oppaat`, `/oppaat/<slug>` | Artikkelit |
| `/tietoa`, `/lahteet`, `/tietosuoja` | Infosivut |

## Data-arkkitehtuuri

Data on eroteltu, ja kaikki komponentit hakevat sen **`dataService.ts`**:n kautta:

| Tiedosto | Sisältö |
| --- | --- |
| `gpus.ts` | GPU-metadata ja tekniset tiedot |
| `benchmarks.ts` | Suorituskykyindeksi (RTX 5080 = 100) – **esimerkkiarvio** |
| `prices-summary.json` | Nykyhinta, muutokset 7/30/90/365 pv, 30 pv keskiarvo, alin/korkein |
| `prices-history.json` | Hintahistoria `{ date, price, sourceId }` |
| `sources.ts` | Hintalähteet ja jälleenmyyjät |
| `generations.ts` | Sukupolvet + RTX 4090 -historiaesimerkki |
| `articles.ts` | Oppaat (uusi artikkeli = uusi objekti listaan) |
| `types.ts` | Tietomallit |

### Oikean hintadatan kytkeminen

1. **Build-aikainen päivitys (suositus):** ajastettu skripti hakee hinnat, kirjoittaa `prices-history.json`-tiedoston samassa muodossa, laskee yhteenvedon `priceStats.ts`:n `summarize()`-funktiolla (`prices-summary.json`, `meta.isDemo: false`) ja ajaa `npm run build`. Käyttöliittymään ei tarvita muutoksia.
2. **API:** vaihda `dataService.ts`:ssä `loadPriceHistory()` hakemaan `fetch('/api/…')`, ja yhteenveto vastaavasti.

Jokainen hintapiste sisältää `sourceId`:n, joka viittaa `sources.ts`:n lähteeseen. Demo-merkinnät poistuvat automaattisesti, kun lähde ei ole demo-lähde.

## Ennen julkaisua

- [ ] Korvaa demo-hinnat oikealla, lähteistetyllä datalla.
- [ ] Korvaa suorituskykyindeksi omilla tai lähteistetyillä testituloksilla.
- [ ] Lisää RTX 4090 -historiaesimerkin alkuperäiset lähteet (`generations.ts`, `sourceId: 'pending'`) tai poista esimerkki.
- [ ] Lisää rekisterinpitäjän yhteystiedot tietosuojasivulle.
- [ ] Kun oikea hintadata on käytössä, lisää `Product`-schemaan `offers`.
