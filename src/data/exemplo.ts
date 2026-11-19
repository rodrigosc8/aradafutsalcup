// ============================================================================
//  DADOS DE EXEMPLO. NÃO SÃO REAIS.
//  Equipas, cores, jogadores, horários e resultados inventados para o design e
//  para o modo de revisão (torneio.modoRevisao). Trocar pelos dados reais depois
//  do sorteio. Os dados reais do torneio (datas, local, números) estão em ./torneio.ts.
//  As páginas não importam este ficheiro: usam ./fonte.ts (exceto a /componentes).
//  Classificações, marcadores e estado dos jogos calculam-se em ./estado.ts.
// ============================================================================

export interface Equipa {
  id: string;
  nome: string;
  sigla: string;
  /** Cor da equipa: emblema e bloco do cromo. Tem de ter contraste AA com branco. */
  cor: string;
  grupo: 'A' | 'B' | 'C' | 'D';
}

export interface Jogador {
  id: string;
  nome: string;
  numero: number;
  equipa: string; // id da equipa
  posicao: string;
  golos: number;
  /** Só com autorização de imagem. Sem foto, o cromo mostra a silhueta. */
  foto?: string;
}

/** Id de uma equipa, ou um lugar ainda por decidir na fase final (ex.: "1.º Grupo A"). */
export type Lado = string | { texto: string };

export interface Jogo {
  id: string;
  /** ISO 8601 com fuso (Lisboa em dezembro = UTC+00:00). */
  inicio: string;
  casa: Lado;
  fora: Lado;
  grupo?: Equipa['grupo'];
  fase: 'grupos' | 'quartos' | 'meias' | 'terceiro' | 'final';
}

/** Resultado de um jogo: golos [casa, fora] e quem marcou (ids de jogadores, um por golo). */
export interface Resultado {
  golos: [number, number];
  marcadores: [string[], string[]];
}

export const equipas: Equipa[] = [
  { id: 'javalis', nome: 'Javalis', sigla: 'JV', cor: '#7A1E2C', grupo: 'A' },
  { id: 'bairro-fc', nome: 'Bairro FC', sigla: 'BF', cor: '#2F5D50', grupo: 'A' },
  { id: 'leoes', nome: 'Leões', sigla: 'LE', cor: '#9A6B1F', grupo: 'A' },
  { id: 'ponte', nome: 'Ponte', sigla: 'PO', cor: '#3E5A7A', grupo: 'A' },
  { id: 'unidos', nome: 'Unidos', sigla: 'UN', cor: '#5B3A78', grupo: 'B' },
  { id: 'vila', nome: 'Vila', sigla: 'VI', cor: '#1F5C7A', grupo: 'B' },
  { id: 'mar', nome: 'Mar', sigla: 'MA', cor: '#8A3B12', grupo: 'B' },
  { id: 'serra', nome: 'Serra', sigla: 'SE', cor: '#3D5A1E', grupo: 'B' },
  { id: 'moinho', nome: 'Moinho', sigla: 'MO', cor: '#6B2E5A', grupo: 'C' },
  { id: 'rio', nome: 'Rio', sigla: 'RI', cor: '#2B4A6F', grupo: 'C' },
  { id: 'castelo', nome: 'Castelo', sigla: 'CA', cor: '#7A4A1E', grupo: 'C' },
  { id: 'lagoa', nome: 'Lagoa', sigla: 'LA', cor: '#1E5E5A', grupo: 'C' },
  { id: 'pinhal', nome: 'Pinhal', sigla: 'PI', cor: '#5A2E2E', grupo: 'D' },
  { id: 'praia', nome: 'Praia', sigla: 'PR', cor: '#44506A', grupo: 'D' },
  { id: 'quinta', nome: 'Quinta', sigla: 'QU', cor: '#7C3A55', grupo: 'D' },
  { id: 'areal', nome: 'Areal', sigla: 'AR', cor: '#355E3B', grupo: 'D' },
];

// 12 jogadores por equipa (o máximo do regulamento): 16 × 12 = 192 cromos.
// Os dois primeiros de cada equipa são os do design (Rui n.º 7 e Tiago n.º 10 nos Javalis…).
const nomes = [
  'Rui', 'Tiago', 'Gonçalo', 'Vasco', 'Marco', 'André', 'Pedro', 'Nuno',
  'Diogo', 'Hugo', 'Bruno', 'Filipe', 'João', 'Miguel', 'Ricardo', 'Sérgio',
  'Luís', 'Carlos', 'Daniel', 'Fábio', 'Hélder', 'Ivo', 'Jorge', 'Paulo',
  'Rafael', 'Samuel', 'Simão', 'Tomás', 'Vítor', 'Xavier', 'Duarte', 'Martim',
];
const nomesPlantel = [
  'Afonso', 'Alexandre', 'António', 'Artur', 'Bernardo', 'Caetano', 'David', 'Dinis',
  'Eduardo', 'Emanuel', 'Fernando', 'Francisco', 'Gabriel', 'Gil', 'Guilherme', 'Henrique',
  'Igor', 'Jaime', 'José', 'Leandro', 'Lourenço', 'Manuel', 'Mário', 'Mateus',
  'Mauro', 'Nélson', 'Óscar', 'Patrício', 'Renato', 'Rúben', 'Salvador', 'Sandro',
  'Telmo', 'Valter', 'Vicente', 'Wilson', 'Bráulio', 'Cláudio', 'Domingos', 'Edgar',
  'Flávio', 'Gustavo', 'Hélio', 'Joel', 'Lucas', 'Marcelo', 'Norberto', 'Orlando',
];
const numeros = [7, 10, 9, 4, 11, 8, 5, 3];
const posicoes = ['Ala', 'Pivô', 'Fixo', 'Guarda-redes'];
const posicoesPlantel = ['Fixo', 'Ala', 'Pivô', 'Ala'];

export const jogadores: Jogador[] = equipas.flatMap((equipa, i) => {
  const base = [0, 1].map((j) => ({
    id: `${equipa.id}-${j + 1}`,
    nome: nomes[(i * 2 + j) % nomes.length],
    numero: numeros[(i * 2 + j) % numeros.length],
    equipa: equipa.id,
    posicao: posicoes[(i + j) % posicoes.length],
    golos: 0,
  }));
  const usados = new Set(base.map((b) => b.numero));
  const livres = Array.from({ length: 12 }, (_, k) => k + 1).filter((n) => !usados.has(n));
  const plantel = livres.slice(0, 10).map((numero, k) => ({
    id: `${equipa.id}-${k + 3}`,
    nome: nomesPlantel[(i * 10 + k) % nomesPlantel.length],
    numero,
    equipa: equipa.id,
    posicao: numero === 1 || numero === 12 ? 'Guarda-redes' : posicoesPlantel[k % posicoesPlantel.length],
    golos: 0,
  }));
  return [...base, ...plantel];
});

// Calendário de exemplo: 32 jogos.
// Fase de grupos: 4 grupos de 4, todos contra todos, 8 jogos por dia (21, 22 e 23).
// Fase final: quartos a 26; meias, 3.º lugar e final a 27.
const HORAS_GRUPOS = ['17:30', '18:10', '18:50', '19:30', '20:10', '20:50', '21:30', '22:10'];
// Jornadas de um grupo [a, b, c, d]: 1.ª a×b e c×d; 2.ª a×c e b×d; 3.ª a×d e b×c.
const JORNADAS: [number, number][][] = [
  [[0, 1], [2, 3]],
  [[0, 2], [1, 3]],
  [[0, 3], [1, 2]],
];
// Ordem dos jogos no dia (grupo e jogo da jornada), pelas horas acima.
const ORDEM: [Equipa['grupo'], number][] = [
  ['C', 0], ['D', 0], ['C', 1], ['A', 1], ['A', 0], ['B', 0], ['B', 1], ['D', 1],
];
const DIAS_GRUPOS = ['2026-12-21', '2026-12-22', '2026-12-23'];

const iso = (dia: string, hora: string) => `${dia}T${hora}:00+00:00`;
const doGrupo = (g: Equipa['grupo']) => equipas.filter((e) => e.grupo === g).map((e) => e.id);

const jogosGrupos: Jogo[] = DIAS_GRUPOS.flatMap((dia, d) =>
  ORDEM.map(([g, n], slot) => {
    const [x, y] = JORNADAS[d][n];
    const ids = doGrupo(g);
    return {
      id: `d${d + 1}-${g.toLowerCase()}${n + 1}`,
      inicio: iso(dia, HORAS_GRUPOS[slot]),
      casa: ids[x],
      fora: ids[y],
      grupo: g,
      fase: 'grupos' as const,
    };
  }),
);

const lugar = (texto: string) => ({ texto });
const jogosFinais: Jogo[] = [
  { id: 'q1', inicio: iso('2026-12-26', '18:50'), casa: lugar('1.º Grupo A'), fora: lugar('2.º Grupo B'), fase: 'quartos' },
  { id: 'q2', inicio: iso('2026-12-26', '19:50'), casa: lugar('1.º Grupo C'), fora: lugar('2.º Grupo D'), fase: 'quartos' },
  { id: 'q3', inicio: iso('2026-12-26', '20:50'), casa: lugar('1.º Grupo B'), fora: lugar('2.º Grupo A'), fase: 'quartos' },
  { id: 'q4', inicio: iso('2026-12-26', '21:50'), casa: lugar('1.º Grupo D'), fora: lugar('2.º Grupo C'), fase: 'quartos' },
  { id: 'm1', inicio: iso('2026-12-27', '18:00'), casa: lugar('Vencedor Q1'), fora: lugar('Vencedor Q2'), fase: 'meias' },
  { id: 'm2', inicio: iso('2026-12-27', '19:10'), casa: lugar('Vencedor Q3'), fora: lugar('Vencedor Q4'), fase: 'meias' },
  { id: 't1', inicio: iso('2026-12-27', '20:20'), casa: lugar('Vencido M1'), fora: lugar('Vencido M2'), fase: 'terceiro' },
  { id: 'f1', inicio: iso('2026-12-27', '21:30'), casa: lugar('Vencedor M1'), fora: lugar('Vencedor M2'), fase: 'final' },
];

export const jogos: Jogo[] = [...jogosGrupos, ...jogosFinais];

// Resultados de exemplo, coerentes com torneio.dataSimulada (22/12, 19:00): o dia 21 completo,
// os 2 primeiros jogos de 22 e o jogo das 18:50 de 22 (a decorrer às 19:00, resultado parcial).
// O estado de cada jogo (por jogar, a decorrer, terminado) depende do "agora" e calcula-se em estado.ts.
const placar: Record<string, [number, number]> = {
  'd1-c1': [2, 2],
  'd1-d1': [1, 3],
  'd1-c2': [2, 0],
  'd1-a2': [1, 2],
  'd1-a1': [3, 1],
  'd1-b1': [4, 0],
  'd1-b2': [2, 1],
  'd1-d2': [1, 1],
  'd2-c1': [1, 2],
  'd2-d1': [0, 0],
  'd2-c2': [1, 1],
};

// Quem marcou: golos repartidos pelos jogadores de campo, sempre da mesma forma.
const PADRAO = [0, 1, 0, 2, 1, 3, 0, 4];
function marcadoresDe(idEquipa: string, golos: number, semente: number): string[] {
  const campo = jogadores.filter((j) => j.equipa === idEquipa && j.posicao !== 'Guarda-redes');
  return Array.from({ length: golos }, (_, k) => campo[PADRAO[(semente + k) % PADRAO.length] % campo.length].id);
}

export const resultados: Record<string, Resultado> = Object.fromEntries(
  Object.entries(placar).map(([id, [c, f]], k) => {
    const jogo = jogos.find((j) => j.id === id)!;
    return [
      id,
      { golos: [c, f], marcadores: [marcadoresDe(jogo.casa as string, c, k), marcadoresDe(jogo.fora as string, f, k + 3)] },
    ];
  }),
);

/** Resultados de exemplo dos Javalis (mosaicos de resultado). */
export const resultadosJavalis = [
  { adversario: 'ponte', resultado: '3–1', href: '/jogos' },
  { adversario: 'leoes', resultado: '2–2', href: '/jogos' },
];


// ---- Ajudas ---------------------------------------------------------------

export function equipa(id: string): Equipa {
  const e = equipas.find((x) => x.id === id);
  if (!e) throw new Error(`Equipa de exemplo desconhecida: ${id}`);
  return e;
}

export function jogador(id: string): Jogador {
  const j = jogadores.find((x) => x.id === id);
  if (!j) throw new Error(`Jogador de exemplo desconhecido: ${id}`);
  return j;
}

export function jogadoresDe(idEquipa: string): Jogador[] {
  return jogadores.filter((j) => j.equipa === idEquipa);
}

/** A equipa de um lado do jogo, ou undefined se o lugar ainda está por decidir. */
export function equipaDoLado(lado: Lado): Equipa | undefined {
  return typeof lado === 'string' ? equipa(lado) : undefined;
}

export function nomeDoLado(lado: Lado): string {
  return typeof lado === 'string' ? equipa(lado).nome : lado.texto;
}
