# Referências e arquivos de terceiros

## Referência visual e depoimento

A composição foi baseada na versão de outubro de 2023 da Enterpret, selecionada pelo usuário em [Landingfolio — Full page / Landing Page](https://www.landingfolio.com/inspiration/post/enterpret).

A captura de referência fica em `design/references/enterpret/landing-page-desktop.png`. Sua origem é [a imagem publicada no Landingfolio](https://landingfoliocom.imgix.net/inspiration/1697770701943Enterpretdesktopca90e2cd8616425cb5912b871953db2dpng). A antiga foto do depoimento, `app/static/images/testimonials/larisa.png`, foi recortada dessa captura. A seção foi removida a pedido do usuário; a foto foi preservada como arquivo e não é mais carregada pela landing. Marcas, foto e conteúdo pertencem aos respectivos titulares.

## Referência do trilho de soluções

A seção “Soluções para o seu negócio” segue a estrutura e o movimento do [Process and Timeline Animation While Scrolling, de Zoya Aqib](https://webflow.com/made-in-webflow/website/process-timeline-scrolling-animation), referência selecionada pelo usuário em 04/11/2026. O [exemplo publicado](https://process-timeline-scrolling-animation.webflow.io/) combina imagem fixa à esquerda, moldura que gira com contrarrotação da imagem, transições de opacidade e trilho vertical com marcador.

A implementação usa CSS e JavaScript nativos do projeto. Conserva as três soluções, suas ilustrações e a identidade visual da Ativos. As fotos, os textos de exemplo, as fontes e o runtime Webflow da referência não são distribuídos com a landing. As capturas de comparação ficam em `reports/qa/process-rail/reference/`.

## Referência da jornada horizontal

A jornada “Do Google ao WhatsApp, sem perder o próximo passo” parte da ideia de blocos conectados do [AgentFlow](https://largest-europe-634809.framer.app/), indicado pelo usuário em 04/11/2026. A referência usa conexões com pontos animados e um bloco central em destaque. A adaptação apresenta apenas uma linha com três passos, preservando as fontes e cores da Ativos e ajustando a copy existente. O código, os ícones e as animações foram implementados no projeto; não foram importados arquivos nem código do componente comercial. As capturas de referência ficam em `reports/qa/horizontal-journey/reference/`.

## Fontes em uso

Space Grotesk (títulos, pesos 500–700) e Inter (corpo e interface, pesos 400–700) são servidas localmente em WOFF2, com subsets Latin e Latin Extended. Os arquivos foram obtidos no Google Fonts (`fonts.googleapis.com` / `fonts.gstatic.com`). As licenças SIL Open Font License 1.1 ficam junto aos arquivos:

- `app/static/fonts/inter/OFL.txt`.
- `app/static/fonts/space-grotesk/OFL.txt` (fonte: repositório `google/fonts`, diretório `ofl/spacegrotesk`).

Os TTF anteriores de Inter e JetBrains Mono foram conservados no projeto, mas não são carregados pela landing.

## Marca e ilustrações

A logo anterior fica em `design/originals/brand/logo.png`; sua exportação `app/static/images/brand/ativos-logo.png` foi preservada, mas não é mais carregada pela página.

A assinatura **Ativos Negócios Locais** foi fornecida pelo usuário em `design/design_system_ativos/logo_negocios_locais.png`. Sua adaptação escura anterior permanece em `design/originals/brand/ativos-negocios-locais-imagen.png`, com exportações `design/originals/brand/ativos-negocios-locais-web.png` e `app/static/images/brand/ativos-negocios-locais.webp`. Os ícones anteriores também permanecem preservados como arquivos, sem uso na página.

Em 04/11/2026, o usuário forneceu `design/design_system_ativos/Logo metálico ATIVOS Negócios Locais.png` para substituir a logo do cabeçalho e do rodapé, autorizando o uso de ImageGen para remover o fundo. A matriz transparente selecionada fica em `design/originals/brand/ativos-negocios-locais-metalico-transparent.png`; o arquivo publicado é `app/static/images/brand/ativos-negocios-locais-metalico.webp`, em 960 × 255px. A preparação web recorta margens e reduz o tamanho, preservando o alpha e a proporção. O original fornecido permanece intacto. O [registro da preparação](../brand/metallic-logo.md) conserva o prompt final e o comando de exportação.

As ilustrações originais de Google, marketing digital e automação comercial foram fornecidas pelo usuário e ficam em `app/static/images/services/`, com suas cores e proporções originais. Em 04/11/2026, a pedido do usuário, a ferramenta integrada ImageGen criou adaptações para a moldura giratória da seção “Soluções para o seu negócio”, com elementos centrais maiores e menos detalhes pequenos. A versão final mantém um fundo azul quadrado até as quatro bordas, para que a moldura continue visível ao girar e a ilustração permaneça orientada pela contrarrotação. As novas matrizes ficam em `design/originals/services/*-imagen-square.png`; as nove exportações WebP, em `app/static/images/services/*-imagen-square-{384,768,1254}.webp`. Os [prompts e critérios de exportação](../brand/services-imagen-square.md) documentam a geração e os tamanhos responsivos. As imagens são ilustrações conceituais dos serviços. Os PNGs anteriores permanecem disponíveis para as demais seções.

Os vídeos atuais do hero foram fornecidos pelo usuário em `design/originals/hero/hero_desktop.mp4` (1920 × 1080) e `hero_cel.mp4` (1080 × 1920), ambos com 8 segundos. São copiados sem alterações para `app/static/videos/hero/{desktop,mobile}.mp4`. Os posters em `app/static/images/hero/{desktop,mobile}-poster.jpg` são quadros extraídos desses mesmos vídeos com browser Canvas pelo script `scripts/dev/prepare-hero-media.mjs`; não houve geração ou edição da ilustração. Os originais permanecem intactos.

O antigo `app/static/images/brand/reference-mark.svg` foi reconstruído a partir da referência visual e não é o símbolo da Ativos. Ele foi preservado como arquivo, mas deixou de ser usado no favicon e nas decorações. Os favicons atuais de 16px e 32px e o ícone de toque de 180px usam apenas o símbolo da assinatura metálica Ativos Negócios Locais, extraído da matriz transparente e reduzido proporcionalmente sobre Midnight Navy. Os ícones em `app/static/icons/ui.svg` foram desenhados em código neste projeto.

Os SVGs planos citados nos novos manuais (`simbolo-ativos.svg` e `simbolo-ativos-branco.svg`) não acompanham os arquivos disponíveis. A nova assinatura raster fornecida pelo usuário é a referência para esta landing; não foi produzido um vetor oficial a partir dela.

A ilustração de “Mais produtividade” foi criada com a ferramenta integrada ImageGen em 05/11/2026, a pedido do usuário. A matriz local é `design/originals/services/productivity-imagen.png`; as versões públicas são `app/static/images/services/productivity-imagen-{384,768,1254}.webp`. O [registro da geração](../brand/productivity-imagen.md) conserva o prompt final e o processo de exportação. A imagem representa automação de tarefas e ganho de tempo e substitui a repetição da arte de WhatsApp nesse card.

## Ferramentas

A origem das skills instaladas em `.agents/skills/` está registrada em `skills-lock.json`. O adaptador de QA em `tests/browser/support/browser-env.mjs` usa a biblioteca de navegador da skill `design-taste-frontend`.
