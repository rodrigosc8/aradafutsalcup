// ============================================================================
//  DADOS DE EXEMPLO. NÃO SÃO REAIS.
//  Equipas, cores, jogadores, horários e resultados inventados para o design.
//  Trocar pelos dados reais depois do sorteio (as cores das equipas ainda vão
//  ser definidas com a comissão). Os dados reais do torneio (datas, local,
//  números) estão em ./torneio.ts.
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

export interface Jogo {
  id: string;
  /** ISO 8601 com fuso (Lisboa em dezembro = UTC+00:00). */
  inicio: string;
  casa: string; // id da equipa
  fora: string; // id da equipa
  grupo?: Equipa['grupo'];
  fase: 'grupos' | 'quartos' | 'meias' | 'final';
  resultado?: [number, number];
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

// Dois jogadores por equipa chegam para o design ("Jogadores a seguir").
const nomes = [
  'Rui', 'Tiago', 'Gonçalo', 'Vasco', 'Marco', 'André', 'Pedro', 'Nuno',
  'Diogo', 'Hugo', 'Bruno', 'Filipe', 'João', 'Miguel', 'Ricardo', 'Sérgio',
  'Luís', 'Carlos', 'Daniel', 'Fábio', 'Hélder', 'Ivo', 'Jorge', 'Paulo',
  'Rafael', 'Samuel', 'Simão', 'Tomás', 'Vítor', 'Xavier', 'Duarte', 'Martim',
];
const numeros = [7, 10, 9, 4, 11, 8, 5, 3];
const posicoes = ['Ala', 'Pivô', 'Fixo', 'Guarda-redes'];
const golos = [3, 1, 0, 1, 2, 0, 1, 0];

export const jogadores: Jogador[] = equipas.flatMap((equipa, i) =>
  [0, 1].map((j) => ({
    id: `${equipa.id}-${j + 1}`,
    nome: nomes[(i * 2 + j) % nomes.length],
    numero: numeros[(i * 2 + j) % numeros.length],
    equipa: equipa.id,
    posicao: posicoes[(i + j) % posicoes.length],
    golos: golos[(i * 2 + j) % golos.length],
  })),
);

export const jogos: Jogo[] = [
  // 21 de dezembro (Grupos A e B)
  { id: 'j01', inicio: '2026-12-21T19:30:00+00:00', casa: 'leoes', fora: 'ponte', grupo: 'A', fase: 'grupos' },
  { id: 'j02', inicio: '2026-12-21T20:10:00+00:00', casa: 'javalis', fora: 'bairro-fc', grupo: 'A', fase: 'grupos' },
  { id: 'j03', inicio: '2026-12-21T20:50:00+00:00', casa: 'unidos', fora: 'vila', grupo: 'B', fase: 'grupos' },
  { id: 'j04', inicio: '2026-12-21T21:30:00+00:00', casa: 'mar', fora: 'serra', grupo: 'B', fase: 'grupos' },
  // 22 de dezembro (Grupos C e D)
  { id: 'j05', inicio: '2026-12-22T19:30:00+00:00', casa: 'moinho', fora: 'rio', grupo: 'C', fase: 'grupos' },
  { id: 'j06', inicio: '2026-12-22T20:10:00+00:00', casa: 'castelo', fora: 'lagoa', grupo: 'C', fase: 'grupos' },
  { id: 'j07', inicio: '2026-12-22T20:50:00+00:00', casa: 'pinhal', fora: 'praia', grupo: 'D', fase: 'grupos' },
  { id: 'j08', inicio: '2026-12-22T21:30:00+00:00', casa: 'quinta', fora: 'areal', grupo: 'D', fase: 'grupos' },
];

/** Jogo mostrado no Início quando o visitante não segue nenhuma equipa. */
export const idJogoEmDestaque = 'j02';

/** Classificação de exemplo do Grupo A. */
export const classificacaoGrupoA = [
  { equipa: 'javalis', dg: 2, pontos: 4 },
  { equipa: 'bairro-fc', dg: 1, pontos: 3 },
  { equipa: 'ponte', dg: -1, pontos: 1 },
  { equipa: 'leoes', dg: -2, pontos: 0 },
];

/** Resultados de exemplo dos Javalis (mosaicos de resultado). */
export const resultadosJavalis = [
  { adversario: 'ponte', resultado: '3–1', href: '/jogos#j-exemplo-1' },
  { adversario: 'leoes', resultado: '2–2', href: '/jogos#j-exemplo-2' },
];

/** "Figuras de ontem": jogadores de exemplo com golos. */
export const figuras = ['leoes-1', 'ponte-1', 'javalis-1'];

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
