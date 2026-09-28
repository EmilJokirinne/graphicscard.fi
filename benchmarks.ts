import type { Benchmark } from './types';

// Suhteellinen suorituskykyindeksi (RTX 5080 = 100), 1440p-rasterointi.
// ESIMERKKIARVIO: muodostettu karkeasti julkisten testien yleiskuvasta,
// ei omaa mittausta. Korvataan oikealla benchmark-datalla myöhemmin.
export const benchmarks: Benchmark[] = [
  { gpuId: 'rtx-5090', index: 131, sourceId: 'demo-benchmark' },
  { gpuId: 'rtx-5080', index: 100, sourceId: 'demo-benchmark' },
  { gpuId: 'rx-7900-xtx', index: 93, sourceId: 'demo-benchmark' },
  { gpuId: 'rtx-5070-ti', index: 86, sourceId: 'demo-benchmark' },
  { gpuId: 'rx-9070-xt', index: 85, sourceId: 'demo-benchmark' },
  { gpuId: 'rx-7900-xt', index: 80, sourceId: 'demo-benchmark' },
  { gpuId: 'rx-9070', index: 77, sourceId: 'demo-benchmark' },
  { gpuId: 'rtx-5070', index: 69, sourceId: 'demo-benchmark' },
  { gpuId: 'rtx-5060-ti', index: 52, sourceId: 'demo-benchmark' },
  { gpuId: 'rx-9060-xt', index: 50, sourceId: 'demo-benchmark' },
  { gpuId: 'rtx-5060', index: 44, sourceId: 'demo-benchmark' },
  { gpuId: 'arc-b580', index: 37, sourceId: 'demo-benchmark' },
  { gpuId: 'arc-b570', index: 32, sourceId: 'demo-benchmark' },
];
