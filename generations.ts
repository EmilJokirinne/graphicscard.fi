import type { Generation, HistoricalObservation } from './types';

export const generations: Generation[] = [
  {
    id: 'rtx-50', brand: 'nvidia', manufacturer: 'NVIDIA', name: 'GeForce RTX 50', year: 2025,
    architecture: 'Blackwell', process: 'TSMC 4N', vramRange: '8–32 Gt (GDDR7)',
    performanceClass: 'Perusluokasta huippuluokkaan', typicalPriceClass: '299–1 999 USD',
    models: 'RTX 5090, 5080, 5070 Ti, 5070, 5060 Ti, 5060',
  },
  {
    id: 'rtx-40', brand: 'nvidia', manufacturer: 'NVIDIA', name: 'GeForce RTX 40', year: 2022,
    architecture: 'Ada Lovelace', process: 'TSMC 4N', vramRange: '8–24 Gt (GDDR6/GDDR6X)',
    performanceClass: 'Perusluokasta huippuluokkaan', typicalPriceClass: '299–1 599 USD',
    models: 'RTX 4090, 4080 Super, 4070 Ti Super, 4070 Super, 4060 Ti, 4060',
  },
  {
    id: 'rtx-30', brand: 'nvidia', manufacturer: 'NVIDIA', name: 'GeForce RTX 30', year: 2020,
    architecture: 'Ampere', process: 'Samsung 8 nm', vramRange: '6–24 Gt (GDDR6/GDDR6X)',
    performanceClass: 'Nykyisin perus- ja keskiluokka', typicalPriceClass: '169–1 999 USD',
    models: 'RTX 3090 Ti, 3090, 3080, 3070, 3060 Ti, 3060, 3050',
  },
  {
    id: 'rx-9000', brand: 'amd', manufacturer: 'AMD', name: 'Radeon RX 9000', year: 2025,
    architecture: 'RDNA 4', process: 'TSMC N4P', vramRange: '8–16 Gt (GDDR6)',
    performanceClass: 'Perusluokasta yläluokkaan', typicalPriceClass: '299–599 USD',
    models: 'RX 9070 XT, 9070, 9060 XT',
  },
  {
    id: 'rx-7000', brand: 'amd', manufacturer: 'AMD', name: 'Radeon RX 7000', year: 2022,
    architecture: 'RDNA 3', process: 'TSMC N5 + N6', vramRange: '8–24 Gt (GDDR6)',
    performanceClass: 'Perusluokasta yläluokkaan', typicalPriceClass: '269–999 USD',
    models: 'RX 7900 XTX, 7900 XT, 7800 XT, 7700 XT, 7600',
  },
  {
    id: 'rx-6000', brand: 'amd', manufacturer: 'AMD', name: 'Radeon RX 6000', year: 2020,
    architecture: 'RDNA 2', process: 'TSMC N7', vramRange: '4–16 Gt (GDDR6)',
    performanceClass: 'Nykyisin perus- ja keskiluokka', typicalPriceClass: '199–1 099 USD',
    models: 'RX 6950 XT, 6900 XT, 6800 XT, 6700 XT, 6600, 6500 XT',
  },
  {
    id: 'arc-b', brand: 'intel', manufacturer: 'Intel', name: 'Arc B', year: 2024,
    architecture: 'Xe2 (Battlemage)', process: 'TSMC N5', vramRange: '10–12 Gt (GDDR6)',
    performanceClass: 'Perusluokka', typicalPriceClass: '219–249 USD',
    models: 'Arc B580, B570',
  },
  {
    id: 'arc-a', brand: 'intel', manufacturer: 'Intel', name: 'Arc A', year: 2022,
    architecture: 'Xe-HPG (Alchemist)', process: 'TSMC N6', vramRange: '4–16 Gt (GDDR6)',
    performanceClass: 'Perusluokka', typicalPriceClass: '139–349 USD',
    models: 'Arc A770, A750, A580, A380, A310',
  },
];

/**
 * Historiallinen esimerkki: RTX 4090:n havaittu hintataso Suomessa.
 * Luvut ovat sivuston tilaajan toimittamia esimerkkihavaintoja; alkuperäinen
 * lähde lisätään ennen julkaisua (sourceId 'pending'). Ei tämänhetkisiä hintoja.
 */
export const rtx4090History: HistoricalObservation[] = [
  { date: '2024-07-15', price: 1726, sourceId: 'pending' },
  { date: '2024-10-15', price: 1802, sourceId: 'pending' },
  { date: '2024-11-15', price: 1999, sourceId: 'pending' },
  { date: '2024-12-15', price: 2095, sourceId: 'pending' },
  { date: '2025-01-15', price: 2700, sourceId: 'pending' },
];
