// O momento "agora" do site, num só sítio. Tudo o que depende da hora atual (jogo em destaque,
// "hoje", resultados, jogo a decorrer, classificações, contagem) usa esta função, no build e no browser.
// Com torneio.modoRevisao ligado, devolve sempre torneio.dataSimulada.
import { torneio } from '../data/torneio';

export function agora(): Date {
  return torneio.modoRevisao ? new Date(torneio.dataSimulada) : new Date();
}
