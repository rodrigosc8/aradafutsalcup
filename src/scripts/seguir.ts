// Equipa seguida: guardada só neste dispositivo (localStorage). Sem contas.
// Quando muda, é emitido o evento "apfc:equipa" em window com { id: string | null }.

const CHAVE = 'apfc-equipa';
export const EVENTO = 'apfc:equipa';

export function lerEquipa(): string | null {
  try {
    return localStorage.getItem(CHAVE);
  } catch {
    return null; // modo privado ou armazenamento bloqueado
  }
}

export function guardarEquipa(id: string | null): void {
  try {
    if (id) localStorage.setItem(CHAVE, id);
    else localStorage.removeItem(CHAVE);
  } catch {
    // sem armazenamento: a escolha vale só nesta visita
  }
  window.dispatchEvent(new CustomEvent(EVENTO, { detail: { id } }));
}

/** Chama `fn` já com a equipa guardada e sempre que mudar. */
export function aoMudarEquipa(fn: (id: string | null) => void): void {
  window.addEventListener(EVENTO, (ev) => fn((ev as CustomEvent<{ id: string | null }>).detail.id));
  fn(lerEquipa());
}
