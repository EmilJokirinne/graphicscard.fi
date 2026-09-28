import type { Gpu } from './types';
import { getSource } from './dataService';
import { fiDate, usd } from './format';

export function specRows(g: Gpu): [string, string][] {
  const s = g.specs;
  return [
    ['Valmistaja', g.manufacturer],
    ['Arkkitehtuuri', s.architecture],
    ['Grafiikkasuoritin', s.chip],
    ['Valmistustekniikka', s.process],
    ['Julkaisupäivä', fiDate(g.launchDate)],
    ['Julkaisuhinta (suositushinta, USA)', usd(g.msrpUsd)],
    [s.cores.label, s.cores.value],
    ['Näyttömuisti (VRAM)', `${s.vramGb} Gt`],
    ['Muistityyppi', s.memoryType],
    ['Muistiväylä', `${s.memoryBusBits}-bittinen`],
    ['Virrankulutus (TGP/TBP)', `${s.boardPowerW} W`],
    ['Suositeltu virtalähde', s.psuW ? `${s.psuW} W` : 'Tarkista valmistajalta'],
    ['Väylä', s.pcie],
    ['Säteenjäljitys', s.rayTracing],
    ['AI-ominaisuudet', s.aiFeatures],
    ['Kuvan skaalaus', s.upscaling],
    ['Kehysgenerointi', s.frameGeneration ?? '–'],
  ];
}

export default function SpecificationTable({ gpu }: { gpu: Gpu }) {
  const src = getSource(gpu.specSourceId);
  return (
    <div className="spec-table">
      <table>
        <caption className="sr-only">{gpu.name}: tekniset tiedot</caption>
        <tbody>
          {specRows(gpu).map(([k, v]) => (
            <tr key={k}>
              <th scope="row">{k}</th>
              <td>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {gpu.msrpNote && <p className="small muted">{gpu.msrpNote}</p>}
      <p className="small muted">
        Lähde: {src?.url ? <a href={src.url} target="_blank" rel="noopener">{src.name}</a> : src?.name}. Kumppanivalmistajien mallien
        kellotaajuudet, virrankulutus ja mitat voivat poiketa.
      </p>
    </div>
  );
}
