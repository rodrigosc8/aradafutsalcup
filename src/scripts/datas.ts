// Datas e contagens, iguais no build (texto estático) e no browser (atualização).
// Tudo na hora de Lisboa.
import { torneio } from '../data/torneio';
import { agora as agoraSite } from './agora';

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
export function dataLonga(iso: string, agora = agoraSite()): string {
  const [a, m, d] = diaLisboa(new Date(iso)).split('-').map(Number);
  const semana = new Date(Date.UTC(a, m - 1, d)).getUTCDay();
  const dia = diaLisboa(new Date(iso)) === diaLisboa(agora) ? 'Hoje' : DIAS_LONGOS[semana];
  return `${dia}, ${d} de ${MESES_LONGOS[m - 1]}`;
}

/** "Segunda, 21 dez"; no próprio dia, "Hoje, 22 dez" (linha curta do destaque no telemóvel). */
export function dataMedia(iso: string, agora = agoraSite()): string {
  const [a, m, d] = diaLisboa(new Date(iso)).split('-').map(Number);
  const semana = new Date(Date.UTC(a, m - 1, d)).getUTCDay();
  const dia = diaLisboa(new Date(iso)) === diaLisboa(agora) ? 'Hoje' : DIAS_LONGOS[semana];
  return `${dia}, ${d} ${MESES[m - 1]}`;
}

export type PartesContagem =
  | { estado: 'antes'; dias: number; horas: number; minutos: number; segundos: number }
  | { estado: 'decorrer' }
  | { estado: 'fim' };

/** Dias, horas, minutos e segundos até ao apito do jogo. */
export function partesContagem(iso: string, agora = agoraSite()): PartesContagem {
  const inicio = Date.parse(iso);
  const t = agora.getTime();
  if (t >= inicio + torneio.duracaoJogoMinutos * 60_000) return { estado: 'fim' };
  if (t >= inicio) return { estado: 'decorrer' };
  const total = Math.ceil((inicio - t) / 1000);
  return {
    estado: 'antes',
    dias: Math.floor(total / 86_400),
    horas: Math.floor((total % 86_400) / 3600),
    minutos: Math.floor((total % 3600) / 60),
    segundos: total % 60,
  };
}

/**
 * Os mosaicos da contagem (telemóvel e computador):
 * - a partir de 1 dia: dias · horas · min;
 * - a menos de 1 dia: horas · min · seg (só horas · min com menos movimento pedido).
 * Horas, minutos e segundos com 2 dígitos; dias sem zero à esquerda.
 */
export function mosaicosContagem(p: PartesContagem, menosMovimento = false): { valor: string; rotulo: string }[] {
  if (p.estado !== 'antes') return [];
  const dois = (n: number) => String(n).padStart(2, '0');
  if (p.dias >= 1) {
    return [
      { valor: String(p.dias), rotulo: p.dias === 1 ? 'dia' : 'dias' },
      { valor: dois(p.horas), rotulo: 'horas' },
      { valor: dois(p.minutos), rotulo: 'min' },
    ];
  }
  const hm = [
    { valor: dois(p.horas), rotulo: 'horas' },
    { valor: dois(p.minutos), rotulo: 'min' },
  ];
  return menosMovimento ? hm : [...hm, { valor: dois(p.segundos), rotulo: 'seg' }];
}

/** "hoje" no próprio dia; senão "seg, 21 dez". */
export function textoDia(iso: string, agora = agoraSite()): string {
  return diaLisboa(new Date(iso)) === diaLisboa(agora) ? 'hoje' : dataCurta(iso);
}

/**
 * Contagem em texto (telemóvel). Usa exatamente a mesma conta que os mosaicos do computador
 * (partesContagem: dias inteiros arredondados para baixo), para os dois nunca diferirem.
 * - Falta 1 dia ou mais: "faltam 31 dias" (longo: "... para o apito inicial").
 * - Menos de 1 dia: "faltam 7 h 12 min".
 * - Durante o jogo: "a decorrer". Depois: vazio.
 */
export function textoContagem(iso: string, formato: 'curto' | 'longo', agora = agoraSite()): string {
  const p = partesContagem(iso, agora);
  if (p.estado === 'decorrer') return 'a decorrer';
  if (p.estado === 'fim') return '';
  let base: string;
  if (p.dias >= 1) base = p.dias === 1 ? 'falta 1 dia' : `faltam ${p.dias} dias`;
  else base = p.horas > 0 ? `faltam ${p.horas} h ${p.minutos} min` : `faltam ${p.minutos} min`;
  return formato === 'longo' ? `${base} para o apito inicial` : base;
}

/** Atualiza no browser todos os elementos [data-quando]. */
export function atualizarQuando(raiz: ParentNode = document): void {
  const agora = agoraSite();
  raiz.querySelectorAll<HTMLElement>('[data-quando]').forEach((el) => {
    const iso = el.dataset.inicio;
    if (!iso) return;
    if (el.dataset.quando === 'dia') {
      el.textContent = textoDia(iso, agora);
    } else if (el.dataset.quando === 'dia-longo') {
      el.textContent = dataLonga(iso, agora);
    } else if (el.dataset.quando === 'dia-medio') {
      el.textContent = dataMedia(iso, agora);
    } else if (el.dataset.quando === 'partes') {
      const p = partesContagem(iso, agora);
      const menosMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const valores = mosaicosContagem(p, menosMovimento);
      const mosaicos = el.querySelector<HTMLElement>('[data-mosaicos]');
      const legenda = el.querySelector<HTMLElement>('[data-legenda]');
      if (mosaicos) mosaicos.hidden = valores.length === 0;
      el.querySelectorAll<HTMLElement>('[data-mosaico]').forEach((li, i) => {
        const v = valores[i];
        li.hidden = !v;
        if (!v) return;
        li.querySelector<HTMLElement>('[data-valor]')!.textContent = v.valor;
        li.querySelector<HTMLElement>('[data-rotulo]')!.textContent = v.rotulo;
      });
      if (legenda) legenda.textContent = p.estado === 'antes' ? 'para o apito inicial' : p.estado === 'decorrer' ? 'A decorrer' : 'Jogo terminado';
    } else {
      const texto = textoContagem(iso, el.dataset.formato === 'longo' ? 'longo' : 'curto', agora);
      el.textContent = texto;
      el.hidden = texto === '';
    }
  });
}
