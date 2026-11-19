// "Adicionar ao calendário": gera um .ics no browser, sem servidor nem dependências.
// Qualquer <button data-ics ...> na página fica ligado.
import { torneio } from '../data/torneio';

function escapar(texto: string): string {
  return texto.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

/** Dobra linhas com mais de 75 octetos (RFC 5545), sem partir caracteres UTF-8. */
function dobrar(linha: string): string {
  const enc = new TextEncoder();
  const partes: string[] = [];
  let atual = '';
  let octetos = 0;
  for (const c of linha) {
    const n = enc.encode(c).length;
    const limite = partes.length === 0 ? 75 : 74; // as continuações começam com um espaço
    if (octetos + n > limite) {
      partes.push(atual);
      atual = '';
      octetos = 0;
    }
    atual += c;
    octetos += n;
  }
  partes.push(atual);
  return partes.join('\r\n ');
}

function utc(data: Date): string {
  return data.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export interface EventoJogo {
  uid: string;
  inicio: string; // ISO
  titulo: string;
  descricao?: string;
}

/** Torneio inteiro: um evento de dia inteiro por dia de jogo (antes de haver horários). */
export function criarIcsTorneio(uid: string, titulo: string, dias: string[]): string {
  const data = (iso: string) => iso.replace(/-/g, '');
  const diaSeguinte = (iso: string) => {
    const d = new Date(`${iso}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() + 1);
    return d.toISOString().slice(0, 10);
  };
  const eventos = dias.flatMap((dia, i) => [
    'BEGIN:VEVENT',
    `UID:${uid}-${data(dia)}@aradafutsalcup.pt`,
    `DTSTAMP:${utc(new Date())}`,
    `DTSTART;VALUE=DATE:${data(dia)}`,
    `DTEND;VALUE=DATE:${data(diaSeguinte(dia))}`,
    `SUMMARY:${escapar(`${titulo} · dia ${i + 1} de ${dias.length}`)}`,
    `LOCATION:${escapar(torneio.local)}`,
    `DESCRIPTION:${escapar(`${torneio.edicao} do ${torneio.subtitulo}. Horários publicados depois do sorteio.`)}`,
    'URL:https://aradafutsalcup.pt/',
    'TRANSP:TRANSPARENT',
    'END:VEVENT',
  ]);
  const linhas = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//aradafutsalcup.pt//Abilio Pinto Futsal Cup//PT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...eventos,
    'END:VCALENDAR',
  ];
  return linhas.map(dobrar).join('\r\n') + '\r\n';
}

export function criarIcs(e: EventoJogo): string {
  const inicio = new Date(e.inicio);
  const fim = new Date(inicio.getTime() + torneio.duracaoJogoMinutos * 60_000);
  const linhas = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//aradafutsalcup.pt//Abilio Pinto Futsal Cup//PT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${e.uid}@aradafutsalcup.pt`,
    `DTSTAMP:${utc(new Date())}`,
    `DTSTART:${utc(inicio)}`,
    `DTEND:${utc(fim)}`,
    `SUMMARY:${escapar(e.titulo)}`,
    `LOCATION:${escapar(torneio.local)}`,
    `DESCRIPTION:${escapar(e.descricao ?? `${torneio.nome}: ${torneio.subtitulo}.`)}`,
    'URL:https://aradafutsalcup.pt/',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapar(e.titulo)}`,
    'TRIGGER:-PT30M',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return linhas.map(dobrar).join('\r\n') + '\r\n';
}

function descarregar(nome: string, conteudo: string): void {
  const blob = new Blob([conteudo], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nome;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ligarBotoesCalendario(): void {
  document.addEventListener('click', (ev) => {
    const botao = (ev.target as Element | null)?.closest<HTMLButtonElement>('button[data-ics]');
    if (!botao) return;
    const { icsUid, icsInicio, icsTitulo, icsFicheiro, icsDias } = botao.dataset;
    if (!icsUid || !icsTitulo) return;
    if (icsDias) {
      descarregar(icsFicheiro || 'torneio.ics', criarIcsTorneio(icsUid, icsTitulo, icsDias.split(',')));
    } else if (icsInicio) {
      descarregar(icsFicheiro || 'jogo.ics', criarIcs({ uid: icsUid, inicio: icsInicio, titulo: icsTitulo }));
    }
  });
}
