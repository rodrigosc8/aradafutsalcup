// @ts-check
import { defineConfig } from 'astro/config';

// Site 100% estático: o Cloudflare Pages serve a pasta dist/ sem servidor.
export default defineConfig({
  site: 'https://aradafutsalcup.pt',
});
