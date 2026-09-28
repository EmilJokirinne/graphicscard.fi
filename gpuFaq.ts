import type { FaqItem, Gpu } from './types';
import { getPerformance, getPriceSummary, recommendedResolution, PRICES_ARE_DEMO } from './dataService';
import { eur, fiDate, inessive, pct, usd } from './format';

/** Mallikohtainen FAQ – sama sisältö näkyvässä sivussa ja FAQPage-schemassa. */
export function gpuFaq(g: Gpu): FaqItem[] {
  const s = getPriceSummary(g.id);
  const perf = getPerformance(g.id);
  const n = g.shortName;
  const items: FaqItem[] = [];
  if (s) {
    items.push({
      q: `Paljonko ${n} maksaa?`,
      a: `Nykyinen ${PRICES_ARE_DEMO ? 'esimerkkihinta' : 'havaittu hinta'} on ${eur(s.current)} (päivitetty ${fiDate(s.updatedAt)}). 30 päivän aikana hinta on muuttunut ${pct(s.change30)}. Valmistajan julkaisuhinta oli ${usd(g.msrpUsd)} (USA, ilman veroja). Tarkista aina jälleenmyyjän ajantasainen hinta.`,
    });
  }
  items.push({
    q: `Kuinka paljon näyttömuistia ${inessive(n)} on?`,
    a: `${inessive(n)} on ${g.specs.vramGb} Gt ${g.specs.memoryType}-näyttömuistia ${g.specs.memoryBusBits}-bittisellä muistiväylällä.${g.note ? ' ' + g.note : ''}`,
  });
  if (perf) {
    items.push({
      q: `Mihin resoluutioon ${n} sopii?`,
      a: `Suuntaa-antavan suorituskykyindeksin (${perf}, RTX 5080 = 100) perusteella ${n} sijoittuu ${recommendedResolution(perf)}-pelaamisen luokkaan korkeilla asetuksilla. Kuvanskaalaus (${g.specs.upscaling}) voi nostaa ruudunpäivitysnopeutta tuetuissa peleissä.`,
    });
  }
  items.push({
    q: `Millainen virtalähde ${n}:lle tarvitaan?`,
    a: g.specs.psuW
      ? `${g.manufacturer} ilmoittaa kortin virrankulutukseksi ${g.specs.boardPowerW} W ja suosittelee vähintään ${g.specs.psuW} W:n virtalähdettä. Kumppanivalmistajien ylikellotetut mallit voivat vaatia enemmän.`
      : `${g.manufacturer} ilmoittaa kortin virrankulutukseksi ${g.specs.boardPowerW} W. Tarkista suositeltu virtalähde kortin valmistajalta, sillä suositus vaihtelee kumppanimalleittain.`,
  });
  return items;
}
