import type { Gpu } from './types';
import GPUCard from './GPUCard';

export default function GPUGrid({ gpus, columns = 'auto' }: { gpus: Gpu[]; columns?: 'auto' | '4' }) {
  return (
    <div className={`gpu-grid cols-${columns}`}>
      {gpus.map((g) => (
        <GPUCard key={g.id} gpu={g} />
      ))}
    </div>
  );
}
