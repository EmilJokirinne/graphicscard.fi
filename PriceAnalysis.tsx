import type { Gpu, PriceSummary } from './types';
import { getPriceSummary, getSource } from './dataService';
import { eur, fiDate, pct } from './format';

/**
 * Automaattinen, neutraali tekstiyhteenveto hintakehityksestä.
 * Ei ostosuosituksia – vain havainnot: noussut / laskenut / pysynyt vakaana.
 */
export function analysisSentences(gpu: Gpu, s: PriceSummary): string[] {
  const n = gpu.shortName;
  const out: string[] = [];
  const c30 = s.change30;
  if (c30 !== null) {
    const a = Math.abs(c30);
    if (a < 2) out.push(`${n}:n hinta on pysynyt viimeisen 30 päivän aikana melko vakaana (muutos ${pct(c30)}).`);
    else if (c30 < 0) out.push(`${n}:n hinta on laskenut viimeisen 30 päivän aikana noin ${pct(a, false)}.`);
    else out.push(`${n}:n hinta on noussut viimeisen 30 päivän aikana noin ${pct(a, false)}.`);
  }
  const d = ((s.current - s.avg30) / s.avg30) * 100;
  if (Math.abs(d) < 1.5) out.push(`Nykyinen hinta on lähellä kuukauden keskiarvoa (${eur(s.avg30)}).`);
  else if (d < -6) out.push(`Nykyinen hinta on selvästi alle viimeisen kuukauden keskimääräisen hintatason (${eur(s.avg30)}).`);
  else if (d < 0) out.push(`Nykyinen hinta on hieman alle viimeisen kuukauden keskimääräisen hintatason (${eur(s.avg30)}).`);
  else if (d > 6) out.push(`Nykyinen hinta on selvästi korkeampi kuin kuukauden keskiarvo (${eur(s.avg30)}).`);
  else out.push(`Nykyinen hintataso on hieman korkeampi kuin kuukauden keskiarvo (${eur(s.avg30)}).`);

  if (s.change365 !== null) {
    const a = Math.abs(s.change365);
    if (a < 2) out.push('Vuoden takaiseen hintatasoon verrattuna hinta on lähes ennallaan.');
    else out.push(`Vuoden takaiseen hintatasoon verrattuna hinta on ${s.change365 < 0 ? 'laskenut' : 'noussut'} noin ${pct(a, false)}.`);
  }
  const fromMin = ((s.current - s.min) / s.min) * 100;
  if (fromMin < 1) out.push(`Nykyinen hinta on seurantajakson alin havaittu hinta.`);
  else out.push(`Alin havaittu hinta on ${eur(s.min)} (${fiDate(s.minDate)}), korkein ${eur(s.max)} (${fiDate(s.maxDate)}).`);
  return out;
}

export default function PriceAnalysis({ gpu }: { gpu: Gpu }) {
  const s = getPriceSummary(gpu.id);
  if (!s) return null;
  const src = getSource(s.sourceId);
  return (
    <div className="analysis">
      <h3>Hintakehitys</h3>
      <p>{analysisSentences(gpu, s).join(' ')}</p>
      <p className="analysis-note">
        Yhteenveto muodostetaan automaattisesti hintahistoriasta, eikä se ole ostosuositus.
        {src?.isDemo && ' Luvut perustuvat esimerkkidataan.'}
      </p>
    </div>
  );
}
