// @ts-check
import { writeFile } from 'node:fs/promises';
import { defineConfig } from 'astro/config';
import { torneio } from './src/data/torneio.ts';

// Site 100% estático, servido pelo Cloudflare Workers (static assets) a partir de dist/.
// No modo de revisão (torneio.modoRevisao) gera um robots.txt que bloqueia tudo.
// Fora desse modo não gera robots.txt (o site fica indexável, como antes).
/** @returns {import('astro').AstroIntegration} */
const robotsRevisao = () => ({
  name: 'robots-revisao',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      if (!torneio.modoRevisao) return;
      await writeFile(new URL('robots.txt', dir), 'User-agent: *\nDisallow: /\n');
    },
  },
});

export default defineConfig({
  site: 'https://aradafutsalcup.pt',
  integrations: [robotsRevisao()],
});
