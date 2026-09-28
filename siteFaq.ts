import type { FaqItem } from './types';

export const siteFaq: FaqItem[] = [
  {
    q: 'Mikä näytönohjain kannattaa ostaa?',
    a: 'Yhtä kaikille sopivaa vastausta ei ole. Sopiva näytönohjain riippuu näytön resoluutiosta ja virkistystaajuudesta, pelattavista peleistä, budjetista, virtalähteen kapasiteetista ja siitä, kuinka monta vuotta korttia aiotaan käyttää. Vertailutyökalulla voit asettaa 2–4 mallia rinnakkain ja tarkastella niiden teknisiä tietoja, suorituskykyindeksiä ja hintakehitystä.',
  },
  {
    q: 'Paljonko näytönohjain maksaa?',
    a: 'Hinnat vaihtelevat mallin, kumppanivalmistajan, saatavuuden ja ajankohdan mukaan. Saman grafiikkasuorittimen eri versioiden (esimerkiksi perusmalli ja tehdasylikellotettu malli) hintaero voi olla satoja euroja. Tarkista aina jälleenmyyjän ajantasainen hinta.',
  },
  {
    q: 'Mikä on VRAM?',
    a: 'VRAM eli näyttömuisti on näytönohjaimen oma, nopea muisti. Sinne tallennetaan esimerkiksi pelin tekstuurit, geometria ja kuvapuskurit. Kun näyttömuisti loppuu, dataa joudutaan siirtämään hitaamman keskusmuistin kautta, mikä voi näkyä nykimisenä tai tekstuurien heikentyneenä laatuna.',
  },
  {
    q: 'Onko enemmän VRAM-muistia aina parempi?',
    a: 'Ei välttämättä. Näyttömuistin määrä on yksi suorituskykyyn vaikuttava tekijä, mutta se ei yksin määritä näytönohjaimen tehoa. Grafiikkasuorittimen laskentateho, muistiväylän leveys, muistin nopeus ja ajurit vaikuttavat vähintään yhtä paljon. Riittävä VRAM-määrä riippuu resoluutiosta ja asetuksista.',
  },
  {
    q: 'Miksi näytönohjainten hinnat muuttuvat?',
    a: 'Hintoihin vaikuttavat muun muassa saatavuus, kysyntä, uuden sukupolven julkaisu, vanhan mallin tuotannon loppuminen, komponenttien (kuten muistipiirien) hinnat, valuuttakurssit sekä jälleenmyyjien hinnoittelu ja kampanjat. Vanhan mallin hinta ei aina laske uuden sukupolven tullessa – se voi myös nousta, jos varastot hupenevat.',
  },
  {
    q: 'Ovatko sivuston hinnat ajantasaisia?',
    a: 'Sivuston ensimmäinen versio käyttää esimerkkidataa, joka on merkitty jokaisen hinnan yhteyteen. Kun oikea hintadata kytketään, jokaisen hinnan yhteydessä näytetään lähde ja päivityspäivä. Hintatiedot ovat aina suuntaa-antavia.',
  },
];
