# aradafutsalcup.pt

Site oficial da **Abílio Pinto Futsal Cup**, 2.ª edição do Torneio de Futsal de Natal de Arada (Junta de Freguesia de Arada).

- **Stack:** Astro (site estático), alojado no Cloudflare Pages.
- **Dados do torneio:** `src/data/torneio.ts`, a fonte única de verdade (datas, números, links).
- **Cores e tipos de letra:** `src/styles/global.css`. As fontes são servidas pelo próprio site (Fontsource), sem pedidos ao Google.

## Desenvolver

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # gera dist/
npm run preview  # pré-visualiza o build
```

## Publicar (Cloudflare Pages)

Cada `git push` para `main` publica o site automaticamente.

Configuração do projeto no Cloudflare Pages:

| Campo | Valor |
| --- | --- |
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Variável de ambiente | `NODE_VERSION` = `22` |

Domínios personalizados: `aradafutsalcup.pt` e `www.aradafutsalcup.pt`.

## Por preencher

Em `src/data/torneio.ts`:

- `linkInscricao`: link do formulário de inscrição;
- `contactoEmail`: email de contacto para patrocínios;
- `inicio`: hora do 1.º jogo, quando houver horários.
