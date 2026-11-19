# Design aprovado — Abílio Pinto Futsal Cup (19/11/2026)

Os ficheiros `.html` desta pasta são os ecrãs aprovados, exportados do canvas de design. Abrem num browser só como referência visual: usam um runtime de pré-visualização (`support.js`, `<x-dc>`, `<helmet>`) que **não** existe no site. Copia daqui as medidas, as cores e a estrutura, mas nunca a marcação.

| Ficheiro | Ecrã |
| --- | --- |
| `bordo-Inicio.html` | Início, telemóvel (390 × 844) |
| `bordo-Equipa.html` | Página de equipa, telemóvel |
| `bordo-Cromo.html` | Cromo do jogador, telemóvel |
| `bordo-Inicio-PC.html` | Início, computador (1440), 1.ª versão (substituída pela v2) |
| `bordo-Inicio-PC-v2.html` | Início, computador (1440), a partir de 1024px |
| `bordo-Equipa-PC.html` | Página de equipa, computador |

## Princípios

- Simples e fácil de perceber, com uma experiência divertida: o cromo de cada jogador.
- Nada de efeitos "a mais": sem rotações, sem texturas, sem gradientes decorativos, sem emoji.
- Não há contas nem login. A equipa que o utilizador segue fica guardada só no dispositivo (`localStorage`). Sem equipa escolhida, o Início mostra o "Jogo em destaque".
- O telemóvel vem primeiro. O computador usa os mesmos componentes com mais espaço.

## Tokens

| Token | Valor | Uso |
| --- | --- | --- |
| `--bordo` | `#7A1E2C` | cor principal, botões primários, item ativo da navegação, faixa de destaque |
| `--bordo-claro` | `#E7B9BF` | texto secundário sobre bordô |
| `--papel` | `#F7F1EA` | fundo das páginas |
| `--branco` | `#FFFFFF` | superfícies (cartões, navegação, moldura do cromo) |
| `--dourado` | `#C98E2B` | estrela de Natal, fio interior do cromo |
| `--dourado-claro` | `#F3D9A6` | etiquetas pequenas sobre bordô |
| `--destaque` | `#B0412E` | "Futsal Cup" no logótipo de texto |
| `--texto` | `#2A1418` | texto principal |
| `--texto-2` | `#7A6A62` | texto secundário |
| `--linha` | `#E8DDD2` | contornos e separadores |
| `--azul-ap` | `#1F2A55` | faixa do patrocinador principal (Abílio Pinto) |

Cores de equipa (exemplo, ainda por definir com a comissão): Javalis `#7A1E2C`, Bairro FC `#2F5D50`, Leões `#9A6B1F`, Ponte `#3E5A7A`. Cada equipa tem uma cor, usada no emblema e no bloco do cromo.

Raios de canto: 999px (cápsulas), 18–28px (cartões grandes), 12–14px (botões, linhas de jogo), 7% da largura (cromo).
Sombras: só na navegação flutuante (`0 10px 30px rgba(42,20,24,.10–.14)`) e nos cromos (`0 1px 2px rgba(0,0,0,.08), 0 6px 16px rgba(0,0,0,.08)`).

## Tipografia

- **Barlow Condensed** 700/800, em maiúsculas: títulos, nomes de equipas e jogadores, números, horas e resultados.
- **Inter** 400–800: todo o texto corrido, botões e etiquetas.
- Servir as fontes a partir do próprio site, com Fontsource (`@fontsource/barlow-condensed`, `@fontsource-variable/inter`). Nunca a partir do Google Fonts.
- O nome do patrocinador principal aparece por agora em Montserrat itálico 800, como marcador. Vai ser trocado pelo logótipo oficial.

## Componentes

1. **Logótipo de texto:** "ABÍLIO PINTO" e, por baixo, "FUTSAL CUP" na cor `--destaque`, em Barlow Condensed 800. No computador fica numa só linha.
2. **Navegação flutuante.**
   - Computador: uma cápsula branca, `sticky` no topo, com 16px de margem, contorno `--linha` e sombra. Leva o logótipo, os itens (Início, Jogos, Grupos, Cromos) e, à direita, o seletor de equipa. O item ativo fica numa cápsula bordô com texto branco.
   - Telemóvel: uma cápsula branca, fixa em baixo, a 16px dos lados e 20px do fundo, com 4 itens. O item ativo fica numa cápsula bordô.
3. **Seletor "Sigo: [equipa] ▾":** um botão com um quadrado na cor da equipa e uma seta. Abre a lista das 16 equipas e guarda a escolha em `localStorage`.
4. **Emblema de equipa:** um círculo na cor da equipa, com as iniciais em Barlow Condensed e um anel branco.
5. **Cromo** (o componente mais importante):
   - proporção 1 : 1,4;
   - moldura branca com padding de cerca de 4,5% da largura;
   - por dentro, cantos arredondados e um fio dourado de 1,5px (`inset box-shadow`);
   - nos 60% de cima, um bloco na cor da equipa com uma silhueta (cabeça e ombros a branco, com 20% de opacidade) e uma estrela dourada pequena no canto superior direito;
   - o número do jogador num círculo branco com anel na cor da equipa, centrado na linha de divisão, encostado à esquerda;
   - em baixo, o nome em maiúsculas e um subtítulo (posição, equipa ou golos).

   O cromo tem de funcionar em todas as larguras, de 68px a 240px. A fotografia substitui a silhueta só quando houver autorização de imagem.
6. **Cartão "Jogo em destaque":** fundo bordô. Mostra os emblemas das duas equipas e a hora ao centro. Por baixo de uma linha, "Jogadores a seguir", com 2 cromos de cada equipa. Os jogadores **nunca** representam a equipa sozinhos. Leva também o botão branco "Adicionar ao calendário", que gera um `.ics` no browser.
7. **Linha de jogo:** um cartão branco com contorno, que se carrega inteiro (`<a>`). Mostra a hora, "Equipa × Equipa", "Ver jogo" e uma seta ›.
8. **Botões.**
   - Primário: bordô e branco, com 48px de altura mínima.
   - Secundário: transparente, com contorno.
   - Cápsula de link: fundo branco, contorno, texto bordô e uma seta ›.
9. **Mosaico de resultado:** um cartão com contorno, o resultado em Barlow, o adversário e "Ver jogo ›".
10. **Barra de patrocinadores "Quem apoia":** uma fila que se desloca com `@keyframes translateX(0 → -50%)` e o conteúdo duplicado (a cópia com `aria-hidden`). Esbate nas pontas com `mask-image`. Para quando o rato passa por cima e fica parada com `prefers-reduced-motion`. A Abílio Pinto aparece primeiro, numa faixa `--azul-ap`; os outros espaços são marcadores. No computador tem o botão "Quero patrocinar".
11. **Faixa de números:** 16 equipas, 192 cromos (16 × 12 jogadores, o máximo do regulamento), 32 jogos e 5 dias.
12. **Rodapé:** "Patrocinador principal: Abílio Pinto" e "Organização: Junta de Freguesia de Arada · Pavilhão Gimnodesportivo de Arada".

## Regra de interação

Tudo o que se carrega tem fundo ou contorno e uma seta ›. O texto simples nunca é clicável. As áreas de toque têm pelo menos 44px.

**Exceção: rodapé.** No rodapé, os links podem ser texto simples (sem fundo, contorno nem seta), sublinhados no hover, por ser a convenção dos rodapés. Fundo `#2A1418`, links `#E7D9CF` (no hover `#FFFFFF` e sublinhados). O botão "Abrir no mapa ›" continua a ser um botão secundário com contorno claro.

## Acessibilidade

- Contraste AA em todo o texto.
- Botões e links verdadeiros (`<button>`, `<a href>`).
- `aria-label` em tudo o que só tem ícone.
- Silhuetas e decoração com `aria-hidden`.
- `lang="pt-PT"`.

## Antes do sorteio (estados vazios)

- `torneio.fase` em `src/data/torneio.ts`: `'pre-sorteio'` (por omissão), `'grupos'` ou `'final'`.
- Em `'pre-sorteio'` nenhuma página pública mostra equipas, jogadores ou jogos: as páginas leem tudo de `src/data/fonte.ts`, que devolve listas vazias. Só a `/componentes` usa o exemplo diretamente.
- O que é real mantém-se: datas, local, contagem decrescente, 1.ª edição, patamares, barra de patrocinadores e rodapé.
- Estado vazio: contorno `--linha` tracejado (1,5px), texto `--texto-2`, sem ícones decorativos a mais. Componente `EstadoVazio`.
- Equipa por sortear: emblema neutro (fundo `--linha`, "?" em `--texto`) e o texto "Por sortear" em cinzento.
- Cromo por preencher: bloco `--linha`, silhueta, sem estrela, número nem nome.
- Escondidos até haver equipas: "Jogadores a seguir", "Figuras de ontem" e o seletor "Sigo: equipa".

## Conteúdo de exemplo

Os nomes das equipas e dos jogadores (Javalis, Bairro FC, Rui n.º 7…) são exemplos. Têm de ficar num ficheiro de dados de exemplo separado, para serem trocados pelos dados reais depois do sorteio.
