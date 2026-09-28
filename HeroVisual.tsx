// Abstrakti grafiikkasuoritin: piisiru, laskentayksiköiden ruudukko ja datapolut.
export default function HeroVisual() {
  const cells = [];
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 8; c++) {
      const lit = (r * 3 + c * 5) % 7 === 0 || (r === 2 && c > 2 && c < 6);
      cells.push(
        <rect
          key={`${r}-${c}`}
          x={118 + c * 21}
          y={118 + r * 21}
          width="16"
          height="16"
          rx="3"
          className={lit ? 'hv-cell hv-lit' : 'hv-cell'}
          style={lit ? { animationDelay: `${((r + c) % 5) * 0.6}s` } : undefined}
        />,
      );
    }
  }
  const traces = [
    'M100 150 H40 V80', 'M100 190 H20', 'M100 230 H50 V300', 'M300 150 H360 V70',
    'M300 200 H380', 'M300 240 H350 V320', 'M160 100 V30 H110', 'M240 100 V40 H300',
    'M170 280 V350 H120', 'M230 280 V360 H290',
  ];
  return (
    <svg className="hero-visual" viewBox="0 0 400 400" aria-hidden="true">
      <defs>
        <radialGradient id="hv-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" style={{ stopColor: 'var(--accent)', stopOpacity: 0.35 }} />
          <stop offset="1" style={{ stopColor: 'var(--accent)', stopOpacity: 0 }} />
        </radialGradient>
        <linearGradient id="hv-die" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1d2129" />
          <stop offset="1" stopColor="#111317" />
        </linearGradient>
      </defs>
      <circle cx="200" cy="195" r="190" fill="url(#hv-glow)" />
      {traces.map((d, i) => (
        <g key={i}>
          <path d={d} className="hv-trace" />
          <path d={d} className="hv-pulse" style={{ animationDelay: `${i * 0.45}s` }} />
        </g>
      ))}
      <rect x="92" y="92" width="216" height="196" rx="18" fill="url(#hv-die)" stroke="#353a45" />
      <rect x="104" y="104" width="192" height="172" rx="10" fill="none" stroke="#2a2f38" />
      {cells}
      {[60, 110, 160, 210].map((y) => (
        <g key={y}>
          <rect x={y + 55} y="62" width="36" height="18" rx="3" className="hv-mem" />
          <rect x={y + 55} y="300" width="36" height="18" rx="3" className="hv-mem" />
        </g>
      ))}
    </svg>
  );
}
