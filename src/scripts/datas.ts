// Datas e contagens, iguais no build (texto estático) e no browser (atualização).
// Tudo na hora de Lisboa.
import { torneio } from '../data/torneio';

const FUSO = 'Europe/Lisbon';
const DIAS_SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

/** "AAAA-MM-DD" do dia em Lisboa. */
export function diaLisboa(data: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: FUSO }).format(data);
}

/** "20:10" em Lisboa. */
export function horaLisboa(iso: string): string {
  return new Intl.DateTimeFormat('pt-PT', {
    timeZone: FUSO,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(iso));
}

/** "seg, 21 dez" (sem depender das abreviaturas do browser). */
export function dataCurta(iso: string): string {
  const [a, m, d] = diaLisboa(new Date(iso)).split('-').map(Number);
  const semana = new Date(Date.UTC(a, m - 1, d)).getUTCDay();
  return `${DIAS_SEMANA[semana]}, ${d} ${MESES[m - 1]}`;
}

const DIAS_LONGOS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const MESES_LONGOS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

/** "Segunda, 21 de dezembro"; no próprio dia, "Hoje, 21 de dezembro". */
export function dataLonga(iso: string, agora = new Date()): string {
  const [a, m, d] = diaLisboa(new Date(iso)).split('-').map(Number);
  const semana = new Date(Date.UTC(a, m - 1, d)).getUTCDay();
  const dia = diaLisboa(new Date(iso)) === diaLisboa(agora) ? 'Hoje' : DIAS_LONGOS[semana];
  return `${dia}, ${d} de ${MESES_LONGOS[m - 1]}`;
}

export type PartesContagem =
  | { estado: 'antes'; dias: number; horas: number; minutos: number }
  | { estado: 'decorrer' }
  | { estado: 'fim' };

/** Dias, horas e minutos até ao apito do jogo (para os mosaicos do cartaz). */
export function partesContagem(iso: string, agora = new Date()): PartesContagem {
  const inicio = Date.parse(iso);
  const t = agora.getTime();
  if (t >= inicio + torneio.duracaoJogoMinutos * 60_000) return { estado: 'fim' };
  if (t >= inicio) return { estado: 'decorrer' };
  const totalMin = Math.ceil((inicio - t) / 60_000);
  return {
    estado: 'antes',
    dias: Math.floor(totalMin / 1440),
    horas: Math.floor((totalMin % 1440) / 60),
    minutos: totalMin % 60,
  };
}

/** "hoje" no próprio dia; senão "seg, 21 dez". */
export function textoDia(iso: string, agora = new Date()): string {
  return diaLisboa(new Date(iso)) === diaLisboa(agora) ? 'hoje' : dataCurta(iso);
}

/**
 * Contagem para o cartão em destaque.
 * - Antes do torneio: dias até ao apito inicial (21/12).
 * - No dia do jogo: horas e minutos até ao jogo, ou "a decorrer".
 * - Noutros casos: vazio.
 */
export function textoContagem(iso: string, formato: 'curto' | 'longo', agora = new Date()): string {
  const t = agora.getTime();
  const inicioTorneio = Date.parse(torneio.inicio);

  if (t < inicioTorneio) {
    const dias = Math.max(1, Math.ceil((inicioTorneio - t) / 86_400_000));
    const base = dias === 1 ? 'falta 1 dia' : `faltam ${dias} dias`;
    return formato === 'longo' ? `${base} para o apito inicial` : base;
  }

  const inicioJogo = Date.parse(iso);
  const fimJogo = inicioJogo + torneio.duracaoJogoMinutos * 60_000;
  if (diaLisboa(new Date(iso)) !== diaLisboa(agora)) return '';
  if (t >= inicioJogo && t < fimJogo) return 'a decorrer';
  if (t < inicioJogo) {
    const min = Math.ceil((inicioJogo - t) / 60_000);
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h > 0 ? `faltam ${h} h ${m} min` : `faltam ${m} min`;
  }
  return '';
}

/** Atualiza no browser todos os elementos [data-quando]. */
export function atualizarQuando(raiz: ParentNode = document): void {
  const agora = new Date();
  raiz.querySelectorAll<HTMLElement>('[data-quando]').forEach((el) => {
    const iso = el.dataset.inicio;
    if (!iso) return;
    if (el.dataset.quando === 'dia') {
      el.textContent = textoDia(iso, agora);
    } else if (el.dataset.quando === 'dia-longo') {
      el.textContent = dataLonga(iso, agora);
    } else if (el.dataset.quando === 'partes') {
      const p = partesContagem(iso, agora);
      const mosaicos = el.querySelector<HTMLElement>('[data-mosaicos]');
      const legenda = el.querySelector<HTMLElement>('[data-legenda]');
      if (mosaicos) mosaicos.hidden = p.estado !== 'antes';
      if (p.estado === 'antes') {
        const pares = { dias: p.dias, horas: p.horas, minutos: p.minutos };
        for (const [k, v] of Object.entries(pares)) {
          const n = el.querySelector<HTMLElement>(`[data-parte="${k}"]`);
          if (n) n.textContent = String(v).padStart(k === 'dias' ? 1 : 2, '0');
        }
      }
      if (legenda) legenda.textContent = p.estado === 'antes' ? 'para o apito inicial' : p.estado === 'decorrer' ? 'A decorrer' : 'Jogo terminado';
    } else {
      const texto = textoContagem(iso, el.dataset.formato === 'longo' ? 'longo' : 'curto', agora);
      el.textContent = texto;
      el.hidden = texto === '';
    }
  });
}
