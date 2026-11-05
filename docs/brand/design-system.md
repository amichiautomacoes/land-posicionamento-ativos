# Design system da landing — ATIVOS Tecnologia

A landing aplica a identidade **Corporate Tech Premium discreta** dos arquivos fornecidos pelo usuário em 03/11/2026:

- [Foundations v0.3](../../design/design_system_ativos/foundations.md): identidade, paleta, tipografia e marca.
- [Web v0.1](../../design/design_system_ativos/web.md): tokens semânticos, componentes, acessibilidade e responsividade.

Foundations prevalece em conflitos de identidade. Os valores propostos em Web foram adotados para esta implementação; isso não representa homologação geral das pendências do manual. Os documentos de origem ficam em `design/`, conservado localmente e fora do versionamento remoto.

## Tokens e tipografia

`app/static/css/tokens.css` é a fonte única dos tokens usados pela landing.

| Papel | Token | Valor |
|---|---|---|
| Canvas | `--brand-background` | Midnight Navy `#101B33` |
| Ação principal | `--brand-primary` | Deep Cyan `#007FA8` |
| Apoio e ícones | `--brand-secondary` | Clear Sky `#55A9DD` |
| Painel claro | `--brand-surface` | Ice Blue `#DDF3FF` |
| Foco e ênfase pontual | `--brand-accent` | Acid Lime `#C7FF3D` |
| Superfícies escuras | `--web-surface-1` / `--web-surface-2` | `#192740` / `#22334F` |
| Texto | `--web-text` / `--web-text-muted` | `#FFFFFF` / `#C0D0E3` |
| Links sobre Navy | `--web-link` | `#80CCF1` |
| Borda de superfície | `--web-border` | `#40516B` |
| Hover / ação pressionada | `--web-action-hover` / `--web-action-active` | `#006A8C` / `#005B78` |
| Controle desabilitado | `--web-disabled-bg` / `--web-disabled-text` | `#34435A` / `#B0BACA` |

Títulos usam **Space Grotesk 600**, em caixa natural; corpo, navegação e controles usam **Inter 400–600**. As duas famílias são auto-hospedadas em WOFF2, com subsets Latin e Latin Extended e `font-display: swap`. O lettering do logotipo não foi alterado. A landing não carrega JetBrains Mono.

A escala tipográfica usa display fluido, H2 fluido, H3 de 24px, corpo de 16px e texto auxiliar de 14px. Parágrafos de leitura usam medida máxima de 65 caracteres quando o layout permite. Números de etapas usam algarismos tabulares.

O tracking dos títulos de seção permanece em `-.025em`; H3 e títulos da pilha usam `-.01em`, preservando famílias, pesos e tamanhos. Títulos e textos das soluções permitem quebrar palavras que excedam a largura disponível. Os links do cabeçalho podem quebrar em outra linha quando o texto ampliado ocupa mais espaço. Na jornada, dimensões em `rem` acompanham a ampliação da fonte; em telas estreitas, os cards respeitam a largura da área de rolagem.

Tracking e entrelinhas são definidos pelos tokens `--tracking-*` e `--leading-*`. Corpo e textos auxiliares usam tracking zero. A entrelinha é proporcional ao tamanho da fonte: corpo `1.6` (16px → 25,6px), texto auxiliar `1.5` (14px → 21px) e controles `1.4` (14px → 19,6px). Títulos mantêm razões menores por escala. O kerning usa `normal` e o ajuste óptico usa `auto` nas fontes que oferecem esse recurso. Títulos usam `text-wrap: balance`; parágrafos e listas de leitura usam `text-wrap: pretty`. `hyphens: none` evita hifenização automática, e as quebras de emergência continuam disponíveis para palavras que excedam a coluna.

## Layout e componentes

O container tem limite de **1200px**, com margens de 16px em celulares, 24px a partir de 640px, 32px a partir de 1024px e 40px a partir de 1440px. Cada borda de seção usa padding vertical de **24px em mobile, 32px em tablet e 40px em desktop**, definido por `--section-space`. A soma de seções consecutivas produz intervalos de **48px, 64px e 80px**, respectivamente. Dentro de cada seção, `--section-content-gap` separa a introdução do conteúdo por 24px em mobile e 32px a partir de 640px. As introduções da jornada e do processo usam 16px entre título e parágrafo; as demais distâncias seguem a escala de 4px e 8px dos manuais. O painel de contato usa padding vertical de 32px em mobile e 40px nas demais telas; o rodapé usa 32px.

A seção imediatamente após o hero recebe o intervalo completo no topo, pois o hero termina na mídia e não contribui com padding inferior. Essa compensação mantém a mesma distância de 48px, 64px ou 80px na primeira transição.

- **Botão primário:** Deep Cyan com texto branco, raio de 8px e altura mínima de 48px. Exemplo: contato pelo WhatsApp quando configurado. Não usar transparência, glow ou blur.
- **Botão secundário:** transparente com contorno e texto visíveis. Exemplo: contato no cabeçalho, que leva à seção final.
- **Desabilitado:** fundo e texto próprios, sem hover, movimento ou ativação. Sem `WHATSAPP_NUMBER`, os contatos são botões nativos com `disabled` e `aria-disabled="true"`. Com número configurado, são links nativos para o WhatsApp, com aviso acessível de abertura em nova aba.
- **Foco:** contorno externo Lime de 2px com offset de 4px. No painel Ice Blue, usar Navy para manter contraste do indicador.
- **Cards:** Navy elevado com borda discreta, raio de 12px e sem sombra. Exemplos: jornada e processo. Não tratar cards informativos como links.
- **Painel claro:** Ice Blue com texto Navy e raio de 16px. Exemplo: contato final. Não usar Clear Sky como texto sobre Ice Blue.
- **Menu e controles:** alvos mínimos de 44px, estados de hover e foco, Escape e retorno de foco no menu. A navegação fechada usa `hidden` real, retirando os links da ordem de Tab e da árvore de acessibilidade. Ao mudar o breakpoint de 1020px, o foco é recuperado para um controle visível. Links internos levam o foco ao destino com `preventScroll`, preservando a navegação nativa por fragmentos.

### Interações e desempenho

Os refinamentos seguem a skill `emil-design-eng`, preservando composição, marca e conteúdo. O feedback de pressão usa `scale(.97)` durante 100ms; o retorno e as camadas de estado usam 160ms, com `cubic-bezier(.23, 1, .32, 1)`. Os controles interpolam transformações e opacidade. Os benefícios usam recorte (`clip-path`) para revelar a imagem, sem animar dimensões de layout. Os fundos de hover/active ficam em pseudo-elementos com opacidade, sem animar cores ou bordas.

Hover é restrito a `(hover: hover) and (pointer: fine)`. Foco e ativação por teclado são imediatos, com contorno visível; o scroll suave e as entradas ao navegar pelo teclado são desativados. `prefers-reduced-motion` preserva todos os estados e remove animações. Visibilidade usa `IntersectionObserver` e breakpoints usam `matchMedia`. O trilho de soluções registra um listener passivo de scroll somente enquanto a seção está próxima da tela; as atualizações usam `requestAnimationFrame`, com geometria medida no redimensionamento, nas mudanças de layout e no carregamento das fontes. Não há listener global de mousemove. O Expanding Flow usa `pointermove` somente na própria linha para distinguir movimento real do cursor de entradas causadas pelo deslocamento dos cards. Ele mede as faces somente quando a seleção muda e no redimensionamento, usando `ResizeObserver` e animações nativas; essas medições não rodam a cada frame.

A segunda seção mantém a copy na metade esquerda e apresenta uma pilha de três cards na direita: Google, Redes Sociais e WhatsApp. Google e WhatsApp usam a mesma superfície Navy elevada, borda e texto branco; Redes Sociais usa Deep Cyan. Os três compartilham a tipografia. O hover endireita a face sem deslocar a área original de clique. Clique, toque, Enter ou Espaço abrem um card por completo; os outros dois ficam menores na base. Um novo clique no card aberto, Escape ou uma pressão fora da pilha recolhem o conjunto. Os botões nativos expõem a seleção com `aria-pressed`; sem JavaScript, os três títulos permanecem visíveis em cards estáticos. No celular, a pilha aparece abaixo da copy.

A jornada “Da primeira busca ao primeiro contato. Tudo conectado.” apresenta **uma única sequência horizontal**, inspirada nos blocos conectados do [AgentFlow](https://largest-europe-634809.framer.app/), referência escolhida pelo usuário em 04/11/2026. Descoberta, Atendimento e Acompanhamento são ligados por linhas com pequenos pontos Lime em movimento; o WhatsApp recebe destaque Deep Cyan. A copy foi encurtada para acompanhar essa leitura. No desktop, os três passos cabem no painel; em telas menores, a mesma linha oferece rolagem nativa, botões anterior/próximo, contador e navegação por setas, Home e End. Um controle pausa o movimento, que também para fora da tela, em aba oculta ou com `prefers-reduced-motion`. Sem JavaScript, o conteúdo permanece disponível por rolagem e os controles de aprimoramento ficam ocultos. A implementação usa CSS e JavaScript nativos, sem dependências da referência.

A seção seguinte mantém **Expanding Flow** para os quatro benefícios: Mais visibilidade, Mais oportunidades, Atendimento ágil e Mais produtividade. Acima de 1020px, o card selecionado ocupa duas partes da linha e os demais, uma parte cada. Hover, clique, toque ou foco selecionam outro card; Tab, setas, Home e End permitem navegação por teclado. A largura do texto permanece constante enquanto a imagem é revelada à direita. Até 1020px, ou sem JavaScript, os quatro benefícios ficam empilhados com texto e imagem disponíveis.

No Expanding Flow, os cards fechados exibem uma prévia da própria imagem acima do título. As prévias reutilizam as mídias existentes com recorte central; ao selecionar o card, a prévia desaparece e a imagem maior aparece à direita. A altura dos cards reserva espaço para imagem e texto sem sobreposição. Até 1020px, sem JavaScript ou com texto ampliado que exija a apresentação estática, apenas a imagem principal é exibida, evitando duplicação visual.

O card “Mais produtividade” tem uma [imagem exclusiva criada com ImageGen](productivity-imagen.md), substituindo a repetição da imagem de WhatsApp. A prévia mostra relógio, checklist e automação no mesmo estilo tecnológico azul. O arquivo de 384px atende à miniatura; a imagem principal usa versões de 384, 768 e 1254px com `srcset` e enquadramento central sem ampliação, preservando toda a composição.

Com JavaScript ativo, a pilha e os benefícios verificam se o texto cabe nas faces após redimensionamento, mudança do tamanho da fonte e carregamento das fontes. Quando faltar espaço, a pilha apresenta os canais sem sobreposição e os benefícios adotam altura natural em uma lista estática. Os controles de expansão ficam inativos ou ocultos; o foco retorna a um destino visível antes dessa mudança. A apresentação interativa retorna quando o texto volta a caber. A pilha não aplica redução de escala ao pressionar teclas. A jornada guarda o destino solicitado durante a rolagem, preservando cliques rápidos e reversões; rolagem manual e redimensionamento liberam esse destino.

A terceira seção usa **Interactive Process Rail**, baseado no modelo [Process Timeline, de Zoya Aqib](https://process-timeline-scrolling-animation.webflow.io/), solicitado em 04/11/2026. A coluna esquerda fixa uma imagem quadrada de 30vw (máximo de 432px), enquanto as três soluções percorrem a coluna direita. O ritmo usa `--rail-step-height: 80svh` como altura mínima das etapas seguintes. Em tablet e desktop, a primeira etapa e a área fixa da imagem têm uma altura de abertura mais compacta, limitada pela altura da etapa e pelo tamanho da imagem; a coluna visual permanece centralizada na tela. O título mantém 16px de intervalo antes do trilho, aproximando a primeira solução sem alterar as colunas. A moldura gira 45° por solução; a imagem gira no sentido inverso e usa escala 1,5 para cobrir a máscara. A troca de imagens acompanha o scroll com opacidade. O trilho usa Clear Sky e marcador Lime. A numeração, a moldura quadrada e o texto decorativo no celular são preservados da referência. Abaixo de 768px, o trilho desaparece e a altura mínima passa a 60svh; textos maiores expandem cada etapa naturalmente. Sem JavaScript ou com movimento reduzido, cada solução exibe sua imagem junto ao texto, em leitura estática, com espaçamento definido por `--section-content-gap`. As âncoras `centralize`, `discover` e `act` permanecem disponíveis.

O ícone do menu interpola somente transforms, mantendo sua posição de layout fixa. A primeira linha do cabeçalho mantém sua altura ao abrir a navegação. O vídeo não tem autoplay no HTML nem pré-carregamento obrigatório: o JavaScript respeita a preferência de movimento antes de iniciar a reprodução automática, permitindo reprodução manual explícita mesmo com movimento reduzido. A reprodução é pausada fora da tela ou em aba oculta, preservando a pausa manual. Seus controles têm largura mínima estável e rótulos sincronizados ao estado real; em erro de mídia, o botão fica desabilitado e o poster permanece disponível.

As ilustrações da seção de soluções foram adaptadas com ImageGen em 04/11/2026 para concentrar os elementos importantes no centro da moldura giratória. O fundo azul preenche as quatro bordas da imagem e mantém visível o quadrado de cantos retos: a moldura gira e a ilustração conserva sua orientação por contrarrotação. Cada serviço tem versões WebP de 384, 768 e 1254px com o sufixo `-imagen-square-`; `srcset` e `sizes` consideram a ampliação de 1,5× da animação, o tamanho da tela e a densidade de pixels. No modo estático, a seleção acompanha a largura das colunas. Os originais e os [prompts finais de geração](services-imagen-square.md) foram preservados.

O hero usa os vídeos fornecidos em `design/originals/hero/hero_desktop.mp4` (1920 × 1080) e `hero_cel.mp4` (1080 × 1920), ambos com 8 segundos. As cópias publicadas ficam em `app/static/videos/hero/{desktop,mobile}.mp4`, sem alterar os originais. O canvas Navy ocupa toda a seção. Acima de 1020px, vídeo e poster conservam a proporção 16:9, centralização vertical e alinhamento à direita; um recuo esquerdo de 10vw, limitado entre 80 e 192px, afasta a ilustração da copy. Máscaras suavizam apenas as bordas do quadro (96px à esquerda e 24px no topo e na base), sem sobreposição escura sobre os elementos da arte. No celular, vídeo e poster preenchem toda a seção com `object-fit: cover`, sem máscara. A altura mínima considera a viewport abaixo do header e permite crescimento natural com texto ampliado. Até 1020px, a versão vertical preserva também uma altura mínima proporcional à largura, limitada a 720px para esse cálculo. O enquadramento mobile usa o centro inferior.

No celular abaixo de 640px, o título começa a 4px do topo do hero; título e subtítulo têm 8px de intervalo, e os CTAs começam 12px após o subtítulo. Um scrim Navy acompanha a altura natural de todo o conteúdo, inclusive com fonte ampliada, e termina em um fade de 32px; não há card envolvendo a abertura. No desktop, a separação da copy vem do reenquadramento da mídia, sem scrim horizontal. O `<picture>` de fundo seleciona o poster correto mesmo sem JavaScript; esses JPGs são extraídos dos vídeos por `scripts/dev/prepare-hero-media.mjs` e ficam em `app/static/images/hero/`. A animação mantém os controles, pausa fora da tela, tratamento de erro e preferência de movimento já existentes. As âncoras, textos e destinos configuráveis são preservados. A seção de depoimentos foi removida a pedido do usuário; o processo é seguido pelo FAQ e pelo contato final. Movimento de entrada dura 220ms e é removido com `prefers-reduced-motion`.

Seis aberturas de seção usam **Subtle Radial Glow Section Transition**, solicitado pelo usuário em 04/11/2026. Após a revisão de intensidade, o glow radial Acid Lime tem pico de 9% sobre o Navy contínuo e altura de 128px, com brilho mais suave e menos disperso; a linha horizontal mantém 1px, com 44% de opacidade no centro, um ponto luminoso de 6px e traço vertical de 1px abaixo da abertura. A entrada do hero logo abaixo do cabeçalho e a passagem entre o FAQ e o contato final não recebem a decoração, conforme solicitado. O título e o subtítulo de “Como trabalhamos.” são centralizados, com a medida de 65ch do parágrafo preservada. O componente decorativo compartilhado é `components/section-transition.html`; seus gradientes e pseudo-elementos usam os tokens existentes, sem filtros de blur, sombras, cartões ou novas dependências. O observador de entrada existente revela apenas a opacidade da decoração em 220ms, uma vez por seção. A leitura, as fontes e os componentes permanecem iguais. Teclado, movimento reduzido e ausência de JavaScript apresentam o detalhe imediatamente; mudar a preferência de movimento não deixa elementos ocultos nem reinicia a entrada.

### FAQ

A seção `before-start`, logo após “Como trabalhamos.”, conserva o título, o subtítulo e o divisor aprovados. Título, subtítulo e CTA ficam centralizados acima das perguntas. Acima de 1020px, os seis cards se dividem em duas colunas iguais: três à esquerda e três à direita. Até esse breakpoint, as colunas são empilhadas, mantendo a ordem de leitura. As duas colunas pertencem ao mesmo accordion, com apenas uma resposta aberta no conjunto. As superfícies usam `--web-surface-1`, bordas `--web-border`, raio `--radius-card` e ícones SVG Clear Sky de mais/menos. O apoio reutiliza o botão secundário e leva ao contato existente, sem criar outro destino de WhatsApp.

O componente `components/faq-item.html` usa H3, botão nativo com `aria-expanded`/`aria-controls` e resposta identificada por `aria-labelledby`. Com JavaScript ativo, todas as perguntas começam fechadas; ao abrir uma resposta, as demais são recolhidas. Enter/Espaço alternam o estado, Tab percorre os controles e setas/Home/End movem o foco. Respostas fechadas ficam fora da leitura assistiva e da ordem de foco. A abertura e o fechamento interpolam as linhas de grid em 220ms e a opacidade em 160ms, usando os tokens existentes; teclado e movimento reduzido são imediatos. As transições podem ser interrompidas sem ocultar uma resposta reaberta. Sem JavaScript, todas as respostas permanecem legíveis em apresentação estática.

As seis perguntas e respostas fornecidas pelo usuário estão em `faq_07.txt` e em `sections/before-start.html`, com redação e ordem preservadas integralmente. O título e o subtítulo aprovados permanecem iguais. Nenhum dado estruturado de FAQ foi acrescentado. A verificação específica é `node tests/browser/faq.mjs`, que também compara os textos publicados com o arquivo de origem.

## Marca disponível

Em 03/11/2026, o usuário forneceu a assinatura **Ativos Negócios Locais** em `design/design_system_ativos/logo_negocios_locais.png`, que passa a ser a referência da marca nesta landing. A versão para fundo escuro foi preparada com ImageGen, preservando símbolo, lettering, cores e o descritor. A opção opaca foi escolhida por manter bordas e letras limpas; o original fornecido não foi alterado.

Em 04/11/2026, o usuário substituiu a assinatura do cabeçalho e do rodapé pela versão metálica fornecida em `design/design_system_ativos/Logo metálico ATIVOS Negócios Locais.png`. A exportação `app/static/images/brand/ativos-negocios-locais-metalico.webp` tem 960 × 255px, aproximadamente 79KB e transparência real preparada com ImageGen. As larguras de apresentação continuam em 240px no cabeçalho desktop, 208px no celular e 224px no rodapé desktop, respeitando a proporção da imagem. O fundo transparente dispensa a mistura de luminosidade anterior e preserva os tons metálicos. O [registro da preparação](metallic-logo.md) inclui a origem, o prompt final e o comando de exportação. Os ícones existentes de 32px e 180px permanecem independentes da assinatura horizontal.

A matriz metálica transparente fica em `design/originals/brand/ativos-negocios-locais-metalico-transparent.png`; a exportação para web apenas recorta as margens e reduz o tamanho, preservando o canal alpha. A adaptação anterior permanece em `design/originals/brand/ativos-negocios-locais-imagen.png` e `design/originals/brand/ativos-negocios-locais-web.png`. As assinaturas anteriores e `reference-mark.svg` continuam preservadas como arquivos, sem uso no cabeçalho e no rodapé. Os SVGs planos citados no manual não foram fornecidos e não foram simulados a partir do raster.

O favicon da aba também usa o símbolo metálico, com PNGs de 16 × 16px e 32 × 32px sobre Midnight Navy. O ícone de toque usa a mesma composição em 180 × 180px. Os arquivos publicados têm o prefixo `ativos-negocios-locais-metalico-`, com nomes próprios e versionamento por `static_url` para atualizar o cache. A exportação é reproduzida pelo mesmo script da assinatura horizontal.

## Verificação

- Integração HTTP: `python -m unittest discover -s tests/integration -v`.
- Navegador em 1440, 768, 390 e 320px: `node tests/browser/landing.mjs`.
- Estados reais de mouse, toque e teclado, foco, árvore de acessibilidade e custo de layout: `node tests/browser/interactions.mjs`.
- Pilha de cards, abertura por mouse/toque/teclado, recolhimento e movimento reduzido: `node tests/browser/card-stack.mjs`.
- Ampliação de texto a 200%, leitura sem cortes e recuperação das interações: `node tests/browser/typography-reflow.mjs`.
- Jornada horizontal, contenção da página, navegação, pausa e leitura sem JavaScript ou com movimento reduzido: `node tests/browser/horizontal-journey.mjs`.
- Expanding Flow dos quatro benefícios, teclado, seleção independente e leitura responsiva: `node tests/browser/benefits-flow.mjs`.
- Trilho de soluções, imagens sincronizadas ao scroll, rotação, links diretos, resize e fallback estático: `node tests/browser/process-rail.mjs`.
- Inspeção visual em 1440, 768 e 390px com o inspetor local da skill `design-taste-frontend`.
- Evidências da migração em `reports/qa/design-system-before/`, `reports/qa/design-system-after/` e `reports/qa/design-system-browser/` (arquivos locais, não versionados).

As regras de negócio, o conteúdo comercial e a configuração de contatos continuam sendo definidos pela aplicação. Esta migração não cria provas sociais, resultados, números ou condições comerciais.
