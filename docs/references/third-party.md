# Fontes, referências e mídias

## Fontes distribuídas

Space Grotesk e Inter são servidas localmente em WOFF2, com subsets Latin e Latin Extended. Os arquivos foram obtidos no Google Fonts. As licenças SIL Open Font License 1.1 acompanham as respectivas famílias:

- `app/static/fonts/inter/OFL.txt`.
- `app/static/fonts/space-grotesk/OFL.txt`.

## Marca e imagens atuais

As logos de Google, Instagram e WhatsApp dos cartões de canais foram fornecidas pelo usuário em `design/originals/received-2026-11-05/{google_logo.png,instagram_logo.jpg,whatsapp_logo.jpg}`. Os fundos externos foram removidos com ImageGen; as versões WebP com transparência ficam em `app/static/images/channels/`. As matrizes e os [prompts e comando de preparo](../brand/channel-logos-imagen.md) foram preservados.

A assinatura metálica foi fornecida pelo usuário em `design/design_system_ativos/Logo metálico ATIVOS Negócios Locais.png`. A matriz transparente usada na exportação fica em `design/originals/brand/ativos-negocios-locais-metalico-transparent.png`. O cabeçalho e o rodapé usam `app/static/images/brand/ativos-negocios-locais-metalico.webp`; os ícones de 16px, 32px e 180px são derivados do mesmo símbolo. O [procedimento da marca](../brand/metallic-logo.md) contém o prompt e o comando de exportação.

As três matrizes atuais dos serviços ficam em `design/originals/services/*-imagen-square-responsive.png`, adaptadas com ImageGen a partir dos arquivos fornecidos pelo usuário: `Diorama neon de busca e crescimento.png`, `Marketing Neon Futurista.png` e `CRM Neon_ Conexões em Ação.png`. Suas exportações WebP de 384, 768 e 1254px são usadas no trilho com a moldura giratória. Os [prompts e critérios de exportação](../brand/services-imagen-square.md) descrevem a composição atual; as matrizes anteriores `*-imagen-square.png` foram preservadas.

Os benefícios usam as adaptações WebP de `benefit-visibility.png`, `benefit-opportunities.png` e `sales-automation.png`, fornecidas pelo usuário, além das versões WebP de produtividade. As três primeiras foram adaptadas com ImageGen e exportadas em 384, 768 e 1254px; suas matrizes ficam em `design/originals/services/*-responsive.png`, conforme o [procedimento e prompts](../brand/benefits-responsive-imagen.md). A produtividade atual foi adaptada com ImageGen a partir de `app/static/images/services/Painel CRM Neon Isométrico.png`, fornecida pelo usuário. Suas quatro matrizes ficam em `design/originals/services/productivity-crm-{preview,expanded-desktop,expanded-tablet,expanded-mobile}.png`; o [procedimento e os prompts](../brand/productivity-crm-imagen.md) descrevem as nove exportações WebP. As matrizes anteriores de relógio e checklist foram preservadas. As ilustrações são conceituais e não representam resultados comerciais comprovados.

As artes quadradas acima atendem às miniaturas dos cartões fechados. Os painéis abertos usam [doze composições independentes por dispositivo](../brand/benefits-expanded-imagen.md), também feitas com ImageGen. As matrizes ficam em `design/originals/services/*-expanded-{desktop,tablet,mobile}.png`, e as exportações WebP correspondentes são publicadas em `app/static/images/services/`.

Os vídeos do hero foram fornecidos pelo usuário em `design/originals/hero/hero_desktop.mp4` e `hero_cel.mp4`. São copiados para `app/static/videos/hero/{desktop,mobile}.mp4`. Os posters em `app/static/images/hero/` são quadros dos mesmos vídeos, extraídos por `scripts/media/prepare-hero-media.mjs`.

## Referências de composição e movimento

A composição tem como referência a página Enterpret selecionada pelo usuário no [Landingfolio](https://www.landingfolio.com/inspiration/post/enterpret).

O trilho de serviços adapta a estrutura de imagem fixa, moldura com contrarrotação e marcador vertical do [Process and Timeline Animation While Scrolling, de Zoya Aqib](https://webflow.com/made-in-webflow/website/process-timeline-scrolling-animation), selecionado pelo usuário.

A jornada usa a ideia de blocos conectados do [AgentFlow](https://largest-europe-634809.framer.app/), indicado pelo usuário. O código e as animações da landing foram implementados no projeto; não há runtime Webflow ou Framer distribuído na aplicação.

## Ferramentas locais

`skills-lock.json` registra a origem das skills instaladas em `.agents/skills/`. O adaptador `scripts/lib/browser.mjs` usa o cliente de navegador da skill `design-taste-frontend`, compartilhado entre QA e preparo de mídia. As ferramentas locais não fazem parte da imagem de produção.
