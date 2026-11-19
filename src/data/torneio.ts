// Fonte única de verdade com os dados do torneio.
// Altera aqui e todas as páginas atualizam.

export const torneio = {
  nome: 'Abílio Pinto Futsal Cup',
  edicao: '2.ª edição',
  subtitulo: 'Torneio de Futsal de Natal de Arada',
  organizacao: 'Junta de Freguesia de Arada',
  local: 'Pavilhão Gimnodesportivo de Arada',
  patrocinadorPrincipal: 'Abílio Pinto',

  // Dias de jogo (ISO, hora de Lisboa).
  dias: ['2026-12-21', '2026-12-22', '2026-12-23', '2026-12-26', '2026-12-27'],
  diasTexto: '21, 22, 23, 26 e 27 de dezembro',
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

  // Preencher quando houver: link do formulário de inscrição e contacto da Junta.
  linkInscricao: '',
  contactoEmail: '',
};
