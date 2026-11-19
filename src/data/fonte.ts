// Ponto único de acesso a equipas, jogadores e jogos para as páginas públicas.
// - torneio.fase === 'pre-sorteio' (e modoRevisao desligado): listas vazias; o site mostra estados vazios.
// - torneio.modoRevisao: comporta-se como na fase 'grupos', com os dados de ./exemplo e o "agora"
//   fixo em torneio.dataSimulada.
// Só a /componentes importa ./exemplo diretamente.
//
// TODO: depois do sorteio, trocar `./exemplo` pela fonte dos dados reais.
import { torneio, type FaseTorneio } from './torneio';
import * as exemplo from './exemplo';
import { calcular, type EstadoJogo } from './estado';
import type { Jogo } from './exemplo';

export type { Equipa, Jogador, Jogo, Lado } from './exemplo';
export type { EstadoJogo, LinhaClassificacao } from './estado';

export const faseAtual: FaseTorneio = torneio.modoRevisao ? 'grupos' : torneio.fase;
export const haSorteio = faseAtual !== 'pre-sorteio';

const calculo = haSorteio ? calcular(exemplo) : undefined;

export const equipas = haSorteio ? exemplo.equipas : [];
export const jogadores = calculo?.jogadores ?? [];
export const jogos = haSorteio ? exemplo.jogos : [];
export const idJogoEmDestaque = calculo?.destaque?.id;
/** Jogos com cartão no Início: o destaque e o próximo jogo de cada equipa. */
export const idsCartoes = calculo?.cartoes.map((j) => j.id) ?? [];
export const classificacoes = calculo?.classificacoes ?? [];
export const classificacaoGrupoA = (classificacoes.find((c) => c.grupo === 'A')?.linhas ?? []).map((l) => ({
  equipa: l.equipa,
  dg: l.golosMarcados - l.golosSofridos,
  pontos: l.pontos,
}));
export const figuras = calculo?.figuras ?? [];
export const melhoresMarcadores = (n = 5) => calculo?.marcadores(n) ?? [];
export const estadoDoJogo = (j: Jogo): EstadoJogo => calculo?.estado(j) ?? 'por-jogar';
export const resultadoDo = (j: Jogo) => calculo?.resultado(j);

export { equipa, equipaDoLado, nomeDoLado } from './exemplo';
/** Jogadores de uma equipa, com os golos calculados. */
export const jogadoresDe = (idEquipa: string) => jogadores.filter((j) => j.equipa === idEquipa);

/** Os 4 grupos, mesmo antes do sorteio (os nomes dos grupos são reais). */
export const GRUPOS = ['A', 'B', 'C', 'D'] as const;
