import type { Source, Retailer } from './types';

export const sources: Source[] = [
  {
    id: 'demo',
    name: 'Esimerkkidata',
    type: 'demo',
    description:
      'Sivuston ensimmäisen version havainnollistava esimerkkiaineisto. Luvut eivät ole todellisia kauppahintoja, eikä niitä tule käyttää ostopäätöksen pohjana.',
    isDemo: true,
  },
  {
    id: 'demo-benchmark',
    name: 'Esimerkkiarvio',
    type: 'demo',
    description:
      'Suuntaa-antava suorituskykyindeksi (RTX 5080 = 100), joka on muodostettu karkeasti julkisten testien yleiskuvan perusteella. Ei omaa mittausta.',
    isDemo: true,
  },
  {
    id: 'pending',
    name: 'Lähde vahvistetaan',
    type: 'pending',
    description:
      'Historiallinen havainto, jonka alkuperäinen lähde lisätään ennen julkaisua. Käsitellään esimerkkidatana siihen asti.',
    isDemo: true,
  },
  {
    id: 'nvidia',
    name: 'NVIDIA – tuotesivut ja julkaisutiedotteet',
    type: 'manufacturer',
    url: 'https://www.nvidia.com/fi-fi/geforce/graphics-cards/50-series/',
    description: 'Tekniset tiedot ja julkaisuhinnat (USD).',
    isDemo: false,
  },
  {
    id: 'amd',
    name: 'AMD – tuotesivut ja julkaisutiedotteet',
    type: 'manufacturer',
    url: 'https://www.amd.com/en/products/graphics/desktops/radeon.html',
    description: 'Tekniset tiedot ja julkaisuhinnat (USD).',
    isDemo: false,
  },
  {
    id: 'intel',
    name: 'Intel – Arc-tuotesivut',
    type: 'manufacturer',
    url: 'https://www.intel.com/content/www/us/en/products/details/discrete-gpus/arc.html',
    description: 'Tekniset tiedot ja julkaisuhinnat (USD).',
    isDemo: false,
  },
];

/**
 * Jälleenmyyjärekisteri tulevaa hintadataa varten.
 * Näille ei vielä ole kytketty hintoja – sivusto ei näytä kauppakohtaisia hintoja ennen kuin data on oikeaa.
 */
export const retailers: Retailer[] = [
  { id: 'verkkokauppa', name: 'Verkkokauppa.com', url: 'https://www.verkkokauppa.com' },
  { id: 'jimms', name: 'Jimm’s PC-Store', url: 'https://www.jimms.fi' },
  { id: 'proshop', name: 'Proshop', url: 'https://www.proshop.fi' },
  { id: 'gigantti', name: 'Gigantti', url: 'https://www.gigantti.fi' },
  { id: 'power', name: 'Power', url: 'https://www.power.fi' },
  { id: 'multitronic', name: 'Multitronic', url: 'https://www.multitronic.fi' },
];
