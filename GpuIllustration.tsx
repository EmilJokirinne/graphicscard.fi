import type { Gpu } from './types';

// Tyylitelty, valmistajakohtainen näytönohjainkuva (SVG). Ei tuotekuva – oikeat
// kuvat voidaan myöhemmin lisätä data-kenttänä (esim. imageUrl) lazy-latauksella.
export default function GpuIllustration({ gpu, className = '' }: { gpu: Gpu; className?: string }) {
  const fans = gpu.specs.boardPowerW >= 250 ? 3 : 2;
  const width = 360;
  const fanR = fans === 3 ? 44 : 56;
  const gap = width / (fans + 1);
  const id = `g-${gpu.id}`;
  return (
    <svg className={`gpu-illu brand-${gpu.brand} ${className}`} viewBox="0 0 400 180" role="img" aria-label={`Havainnekuva: ${gpu.manufacturer} ${gpu.name}`}>
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2e36" />
          <stop offset="1" stopColor="#15171b" />
        </linearGradient>
        <radialGradient id={`${id}-fan`}>
          <stop offset="0" stopColor="#1b1e24" />
          <stop offset="1" stopColor="#0c0d10" />
        </radialGradient>
      </defs>
      <rect x="10" y="30" width="380" height="120" rx="16" fill={`url(#${id}-body)`} stroke="#3a3f48" />
      <rect x="10" y="30" width="380" height="120" rx="16" fill="none" style={{ stroke: 'var(--brand)' }} strokeOpacity=".35" />
      {Array.from({ length: fans }, (_, i) => {
        const cx = 20 + gap * (i + 1);
        return (
          <g key={i} transform={`translate(${cx} 90)`}>
            <circle r={fanR} fill={`url(#${id}-fan)`} stroke="#343944" />
            {Array.from({ length: 9 }, (_, b) => (
              <path
                key={b}
                d={`M0 -8 Q ${fanR * 0.55} ${-fanR * 0.45} ${fanR * 0.2} ${-fanR * 0.92}`}
                stroke="#3d434e"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                transform={`rotate(${b * 40})`}
              />
            ))}
            <circle r={fanR * 0.22} fill="#20242b" stroke="#454b57" />
          </g>
        );
      })}
      <rect x="30" y="150" width="130" height="10" rx="2" fill="#b8a15a" opacity=".65" />
      <rect x="10" y="44" width="4" height="92" rx="2" style={{ fill: 'var(--brand)' }} opacity=".8" />
    </svg>
  );
}
