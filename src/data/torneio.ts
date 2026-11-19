// Fonte única de verdade com os dados do torneio.
// Altera aqui e todas as páginas atualizam.

export type FaseTorneio = 'pre-sorteio' | 'grupos' | 'final';

export const torneio = {
  // Fase do site. Em 'pre-sorteio' nenhuma página pública usa equipas, jogadores ou jogos:
  // o Início mostra estados vazios. Mudar para 'grupos' depois do sorteio (com dados reais).
  fase: 'pre-sorteio' as FaseTorneio,

  nome: 'Abílio Pinto Futsal Cup',
  edicao: '2.ª edição',
  subtitulo: 'Torneio de Futsal de Natal de Arada',
  organizacao: 'Junta de Freguesia de Arada',
  local: 'Pavilhão Gimnodesportivo de Arada',
  // TODO: morada do pavilhão (rua, código postal, localidade). Enquanto vazia, não aparece no rodapé.
  morada: '',
  patrocinadorPrincipal: 'Abílio Pinto',

  // Dias de jogo (ISO, hora de Lisboa).
  dias: ['2026-12-21', '2026-12-22', '2026-12-23', '2026-12-26', '2026-12-27'],
  diasTexto: '21, 22, 23, 26 e 27 de dezembro',
  datasCurtas: '21–27 dez 2026',
  // Início da contagem decrescente. Atualizar com a hora do 1.º jogo quando houver horários.
  inicio: '2026-12-21T00:00:00+00:00',
  fimInscricoes: '19 de dezembro',

  numeros: [
    { valor: '16', rotulo: 'equipas' },
    { valor: '224', rotulo: 'cromos para colecionar' },
    { valor: '32', rotulo: 'jogos' },
    { valor: '5', rotulo: 'dias de dezembro' },
  ],

  // Fase de cada dia de jogo (mesma ordem de `dias`).
  fases: ['grupos', 'grupos', 'grupos', 'quartos', 'finais'],
  pausaNatal: '24 e 25: pausa de Natal.',

  // Duração usada no evento de calendário (.ics). Estimativa: confirmar com a organização.
  duracaoJogoMinutos: 50,

  // 1.ª edição (Natal de 2025): números reais, da carta da Junta.
  primeiraEdicao: {
    rotulo: 'Natal de 2025',
    texto:
      'Três dias de pavilhão cheio, centenas de visitantes e uma freguesia inteira à volta do futsal. Este ano há mais equipas e mais dias.',
    numeros: [
      { valor: '12', rotulo: 'equipas' },
      { valor: '120', rotulo: 'atletas' },
      { valor: '3', rotulo: 'dias de pavilhão cheio' },
    ],
    // Preencher com o link do vídeo de 2025 quando estiver publicado.
    video: '',
  },

  // Patamares de patrocínio da 2.ª edição.
  patamares: [
    { nome: 'Anual', valor: 500 },
    { nome: 'Destaque', valor: 250 },
    { nome: 'Cartaz', valor: 100 },
    { nome: 'Parceiro', valor: 50 },
    { nome: 'Apoiante', valor: 25 },
  ],

  // Patrocinadores confirmados (além do principal), pela ordem da barra "Quem apoia".
  // Cada um ocupa um dos `espacosPatrocinio`; os que sobram ficam "O seu logótipo aqui".
  // Ex.: { nome: 'Café Central', logo: '/patrocinadores/cafe-central.svg' }
  patrocinadores: [] as { nome: string; logo: string }[],
  espacosPatrocinio: 5,

  // Destinos ainda por criar/confirmar.
  links: {
    patamares: '/patrocinar',
    regulamento: '/regulamento',
    contactos: '/contactos',
    privacidade: '/privacidade',
    acessibilidade: '/acessibilidade',
    comoChegar: 'https://www.google.com/maps/search/?api=1&query=Pavilh%C3%A3o+Gimnodesportivo+de+Arada',
  },

  // Preencher quando houver: link do formulário de inscrição e contacto da Junta.
  linkInscricao: '',
  contactoEmail: '',
};
