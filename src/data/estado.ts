// O que depende do momento atual, calculado a partir dos dados (equipas, jogadores, jogos e
// resultados) e de agora(): estado de cada jogo, resultados visíveis, classificações, golos,
// melhores marcadores, figuras de ontem, jogo em destaque e o próximo jogo de cada equipa.
// Serve para os dados de exemplo e, depois do sorteio, para os dados reais.
import { torneio } from './torneio';
import { agora as agoraSite } from '../scripts/agora';
import { diaLisboa } from '../scripts/datas';
import type { Equipa, Jogador, Jogo, Resultado } from './exemplo';

export type EstadoJogo = 'por-jogar' | 'a-decorrer' | 'terminado';

export interface LinhaClassificacao {
  equipa: string;
  jogos: number;
  vitorias: number;
  empates: number;
  derrotas: number;
  golosMarcados: number;
  golosSofridos: number;
  pontos: number;
}

export interface Dados {
  equipas: Equipa[];
  jogadores: Jogador[];
  jogos: Jogo[];
  resultados: Record<string, Resultado>;
}

export function calcular(d: Dados, momento: Date = agoraSite()) {
  const t = momento.getTime();
  const duracao = torneio.duracaoJogoMinutos * 60_000;

  const estado = (j: Jogo): EstadoJogo => {
    const inicio = Date.parse(j.inicio);
    if (t < inicio) return 'por-jogar';
    if (t < inicio + duracao) return 'a-decorrer';
    return d.resultados[j.id] ? 'terminado' : 'por-jogar';
  };
  /** Resultado visível: final se terminado, parcial se a decorrer, nenhum se por jogar. */
  const resultado = (j: Jogo): [number, number] | undefined =>
    estado(j) === 'por-jogar' ? undefined : d.resultados[j.id]?.golos;

  const ordenados = [...d.jogos].sort((a, b) => a.inicio.localeCompare(b.inicio));
  const terminados = ordenados.filter((j) => estado(j) === 'terminado');

  // Golos (só jogos terminados).
  const golos = new Map<string, number>();
  for (const j of terminados) {
    for (const lado of d.resultados[j.id].marcadores) for (const id of lado) golos.set(id, (golos.get(id) ?? 0) + 1);
  }
  const jogadores = d.jogadores.map((p) => ({ ...p, golos: golos.get(p.id) ?? 0 }));
  const porNome = (a: string, b: string) => a.localeCompare(b, 'pt');

  // Classificações (jogos de grupo terminados). Ordem: pontos, diferença de golos, golos marcados.
  // Nota: o confronto direto (1.º critério do regulamento) ainda não é aplicado.
  const grupos = [...new Set(d.equipas.map((e) => e.grupo))].sort();
  const classificacoes = grupos.map((grupo) => {
    const linhas = new Map<string, LinhaClassificacao>(
      d.equipas
        .filter((e) => e.grupo === grupo)
        .map((e) => [
          e.id,
          { equipa: e.id, jogos: 0, vitorias: 0, empates: 0, derrotas: 0, golosMarcados: 0, golosSofridos: 0, pontos: 0 },
        ]),
    );
    for (const j of terminados) {
      if (j.grupo !== grupo || typeof j.casa !== 'string' || typeof j.fora !== 'string') continue;
      const [c, f] = d.resultados[j.id].golos;
      const casa = linhas.get(j.casa)!;
      const fora = linhas.get(j.fora)!;
      casa.jogos++;
      fora.jogos++;
      casa.golosMarcados += c;
      casa.golosSofridos += f;
      fora.golosMarcados += f;
      fora.golosSofridos += c;
      if (c > f) {
        casa.vitorias++;
        fora.derrotas++;
        casa.pontos += 3;
      } else if (c < f) {
        fora.vitorias++;
        casa.derrotas++;
        fora.pontos += 3;
      } else {
        casa.empates++;
        fora.empates++;
        casa.pontos++;
        fora.pontos++;
      }
    }
    const nome = (id: string) => d.equipas.find((e) => e.id === id)!.nome;
    const dg = (l: LinhaClassificacao) => l.golosMarcados - l.golosSofridos;
    return {
      grupo,
      linhas: [...linhas.values()].sort(
        (a, b) => b.pontos - a.pontos || dg(b) - dg(a) || b.golosMarcados - a.golosMarcados || porNome(nome(a.equipa), nome(b.equipa)),
      ),
    };
  });

  // Jogo em destaque: o próximo a começar (ou o último, se o torneio acabou).
  const destaque = ordenados.find((j) => Date.parse(j.inicio) > t) ?? ordenados.at(-1);
  // Próximo jogo de cada equipa (a decorrer ou por jogar), para "Sigo: equipa".
  const proximoDe = (id: string) => ordenados.find((j) => estado(j) !== 'terminado' && (j.casa === id || j.fora === id));
  const cartoes = [...new Set([destaque, ...d.equipas.map((e) => proximoDe(e.id))].filter((j): j is Jogo => !!j))];

  // Figuras de ontem: quem mais marcou nos jogos do dia anterior.
  const ontem = diaLisboa(new Date(t - 86_400_000));
  const golosOntem = new Map<string, number>();
  for (const j of terminados.filter((j) => diaLisboa(new Date(j.inicio)) === ontem)) {
    for (const lado of d.resultados[j.id].marcadores) for (const id of lado) golosOntem.set(id, (golosOntem.get(id) ?? 0) + 1);
  }
  const figuras = [...golosOntem]
    .map(([id, n]) => ({ jogador: jogadores.find((p) => p.id === id)!, golos: n }))
    .sort((a, b) => b.golos - a.golos || porNome(a.jogador.nome, b.jogador.nome))
    .slice(0, 3);

  const marcadores = (n = 5) =>
    jogadores
      .filter((p) => p.golos > 0)
      .sort((a, b) => b.golos - a.golos || porNome(a.nome, b.nome))
      .slice(0, n);

  return { estado, resultado, jogadores, classificacoes, destaque, cartoes, figuras, marcadores };
}
