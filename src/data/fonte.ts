// Ponto único de acesso a equipas, jogadores e jogos para as páginas públicas.
// Antes do sorteio (torneio.fase === 'pre-sorteio') devolve listas vazias, para que os
// dados de exemplo nunca apareçam no site como se fossem reais.
// Só a /componentes importa ./exemplo diretamente.
//
// TODO: depois do sorteio, trocar `./exemplo` pela fonte dos dados reais.
import { torneio } from './torneio';
import * as exemplo from './exemplo';

export type { Equipa, Jogador, Jogo, Lado } from './exemplo';

export const haSorteio = torneio.fase !== 'pre-sorteio';

export const equipas = haSorteio ? exemplo.equipas : [];
export const jogos = haSorteio ? exemplo.jogos : [];
export const idJogoEmDestaque = haSorteio ? exemplo.idJogoEmDestaque : undefined;
export const classificacoes = haSorteio ? exemplo.classificacoes : [];
export const classificacaoGrupoA = haSorteio ? exemplo.classificacaoGrupoA : [];
export const figuras = haSorteio ? exemplo.figuras : [];
export const melhoresMarcadores = (n = 5) => (haSorteio ? exemplo.melhoresMarcadores(n) : []);

// Procuras por id: só recebem ids vindos das listas acima (vazias antes do sorteio).
export { equipa, equipaDoLado, jogador, jogadoresDe, nomeDoLado } from './exemplo';

/** Os 4 grupos, mesmo antes do sorteio (os nomes dos grupos são reais). */
export const GRUPOS = ['A', 'B', 'C', 'D'] as const;
