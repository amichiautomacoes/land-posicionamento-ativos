# Referências e arquivos de terceiros

## Referência visual e depoimento

A composição foi baseada na versão de outubro de 2023 da Enterpret, selecionada pelo usuário em [Landingfolio — Full page / Landing Page](https://www.landingfolio.com/inspiration/post/enterpret).

A captura de referência fica em `design/references/enterpret/landing-page-desktop.png`. Sua origem é [a imagem publicada no Landingfolio](https://landingfoliocom.imgix.net/inspiration/1697770701943Enterpretdesktopca90e2cd8616425cb5912b871953db2dpng). A antiga foto do depoimento, `app/static/images/testimonials/larisa.png`, foi recortada dessa captura. A seção foi removida a pedido do usuário; a foto foi preservada como arquivo e não é mais carregada pela landing. Marcas, foto e conteúdo pertencem aos respectivos titulares.

## Fontes em uso

Space Grotesk (títulos, pesos 500–700) e Inter (corpo e interface, pesos 400–700) são servidas localmente em WOFF2, com subsets Latin e Latin Extended. Os arquivos foram obtidos no Google Fonts (`fonts.googleapis.com` / `fonts.gstatic.com`). As licenças SIL Open Font License 1.1 ficam junto aos arquivos:

- `app/static/fonts/inter/OFL.txt`.
- `app/static/fonts/space-grotesk/OFL.txt` (fonte: repositório `google/fonts`, diretório `ofl/spacegrotesk`).

Os TTF anteriores de Inter e JetBrains Mono foram conservados no projeto, mas não são carregados pela landing.

## Marca e ilustrações

A logo anterior fica em `design/originals/brand/logo.png`; sua exportação `app/static/images/brand/ativos-logo.png` foi preservada, mas não é mais carregada pela página.

A assinatura atual **Ativos Negócios Locais** foi fornecida pelo usuário em `design/design_system_ativos/logo_negocios_locais.png`. A versão escura foi preparada com ImageGen em fundo Navy, com autorização para padronização. O original adaptado está em `design/originals/brand/ativos-negocios-locais-imagen.png`. A assinatura web fica em `app/static/images/brand/ativos-negocios-locais.webp`; favicon e ícone de toque ficam nos PNGs com esse mesmo prefixo. Recortes, redução e codificação foram feitos a partir da versão adaptada, sem deformar a marca. O PNG intermediário fica em `design/originals/brand/ativos-negocios-locais-web.png`, e o arquivo fornecido permanece intacto.

As ilustrações de Google, marketing digital e automação comercial foram fornecidas pelo usuário e ficam em `app/static/images/services/`, com suas cores e proporções originais. O vídeo original do hero e sua imagem de apoio ficam em `design/originals/hero/`; as versões publicadas ficam em `app/static/videos/hero/`.

O antigo `app/static/images/brand/reference-mark.svg` foi reconstruído a partir da referência visual e não é o símbolo da Ativos. Ele foi preservado como arquivo, mas deixou de ser usado no favicon e nas decorações. O favicon atual usa apenas o símbolo da assinatura Ativos Negócios Locais. Os ícones em `app/static/icons/ui.svg` foram desenhados em código neste projeto.

Os SVGs planos citados nos novos manuais (`simbolo-ativos.svg` e `simbolo-ativos-branco.svg`) não acompanham os arquivos disponíveis. A nova assinatura raster fornecida pelo usuário é a referência para esta landing; não foi produzido um vetor oficial a partir dela.

## Ferramentas

A origem das skills instaladas em `.agents/skills/` está registrada em `skills-lock.json`. O adaptador de QA em `tests/browser/support/browser-env.mjs` usa a biblioteca de navegador da skill `design-taste-frontend`.
