# Sistema visual da landing - ATIVOS

A identidade do site segue o **Design System Geral v0.5, de 16/11/2026**, fornecido em `design/design_system_ativos/base.md`. Esse arquivo substitui as regras anteriores de paleta, tipografia e espaçamento. Os valores do canvas social são adaptados à web conforme a seção 7 do manual.

## Paleta e acento

`app/static/css/tokens.css` centraliza os valores; componentes usam os aliases semânticos `--web-*` e `--brand-*`.

| Papel | Token | Valor |
|---|---|---|
| Fundo | `--color-background` | `#0C0E12` |
| Superfície | `--color-surface` | `#1A1D24` |
| Borda de 1px | `--color-border` | `#1E2C3F` |
| Texto principal | `--color-text-primary` | `#FFFFFF` |
| Apoio, links e ícones | `--color-text-support` | `#A3ABB8` |
| Acento apenas em texto | `--color-accent` | `#C7FF3D` |
| Ação principal, Deep Cyan | `--color-action` | `#007FA8` |
| Contorno de controles, Clear Sky | `--color-action-support` | `#55A9DD` |

Os títulos podem destacar um trecho com `.text-accent`; a seção 03 mantém todos os títulos brancos. A numeração dos cards das seções 04 e 06 usa Acid Lime por solicitação do usuário. Não há fundos, halos, linhas, marcadores ou sombras de interface em verde-lima. A seleção usa fundo neutro e texto lima; os indicadores de foco são brancos. Os controles usam Deep Cyan e Clear Sky da identidade ATIVOS.

O botão principal usa Deep Cyan `#007FA8` com texto branco; hover `#006A8C` e pressão `#005B78`. Botões secundários, menu e controle de vídeo usam contorno Clear Sky `#55A9DD`, com estados de fundo azul discreto. O contato final usa a mesma superfície escura dos demais painéis. As transições entre seções usam uma linha neutra, sem gradiente ou halo.

Por solicitação do usuário, a seção 03 usa títulos e números brancos. A numeração dos cards das seções 04 (benefícios) e 06 (processo) usa Acid Lime `#C7FF3D` em todos os estados. O botão de WhatsApp da seção 07 (FAQ) usa o mesmo padrão preenchido Deep Cyan com texto branco da seção 08 (contato).

## Tipografia responsiva

Inter é a única família de comunicação, auto-hospedada em WOFF2 variável com pesos reais de 100 a 900 e subsets Latin e Latin Extended. A licença acompanha a fonte. O lettering da marca oficial permanece intacto. Não há código nem rótulo técnico que exija JetBrains Mono nesta página.

| Papel | Adaptação web | Peso / entrelinha / tracking |
|---|---|---|
| Hero | 40–56px, fluido | 900 / 0,98 / −0,04em |
| Títulos de seção | 32–48px, fluido | 900 / 1 / −0,04em |
| Soluções | 24–32px, fluido | 800 / 1,1 / −0,035em |
| Nomes de cards | 24px; pilha compacta a 18px | 800 / 1,1 / −0,035em |
| Índices de etapas | 32px, algarismos tabulares | 900 / 1 / −0,035em |
| Corpo e descrições | 16px | 500 / 1,5 / 0 |
| Apoio e controles | 14px | 500–600 / 1,4–1,5 / 0 |

Os valores são responsivos em `rem`; os máximos referem-se à configuração padrão de fonte. A adaptação preserva leitura a 360px sem reduzir textos essenciais aos tamanhos do canvas social escalado. Títulos usam quebra equilibrada; parágrafos usam `text-wrap: pretty` e medida de até 65ch. Cards verificam o espaço disponível após redimensionamento e carregamento das fontes. Com texto ampliado, pilha e benefícios passam à leitura estática quando necessário e recuperam a interação quando o texto volta a caber.

## Espaçamento e componentes

A escala é `8 · 16 · 24 · 32 · 48 · 64 · 96px`, representada por `--space-1` a `--space-7`. A largura máxima do conteúdo é 1200px; no hero desktop, a composição ocupa a largura disponível entre as margens da página. Margens laterais: 16px no celular, 32px a partir de 640px, 48px a partir de 1024px e 64px a partir de 1440px.

- Título → descrição: 24px.
- Nome → frase dentro do card: 8px.
- Grupo do título → conteúdo: 32px no celular e 48px a partir de 640px.
- Entre cards de benefícios, etapas e FAQ: 24px.
- Padding de cards: até 24px; 16px nos controles compactos do FAQ mobile.
- Intervalos entre seções: 64px no celular e 96px nas demais telas, somando as bordas vizinhas.
- Raios: 8px nos controles, 12px nos cards e 16px nos painéis. Alvos de interação: mínimo de 44px; ações principais de 48px.

O CSS carrega tokens, base, layout, componentes compartilhados, componentes específicos e composição em `pages/home.css`. Cada componente mantém suas media queries em `app/static/css/components/`.

## Mídias e marca

A assinatura metálica e as logos oficiais de Google, Instagram e WhatsApp preservam as cores originais. O símbolo mantém proporção e não é redesenhado com Inter. Os ícones do navegador e de toque usam fundo grafite `#0C0E12`, exportado do token canônico por `scripts/media/prepare-brand-logo.mjs`.

Por solicitação do usuário, imagens, posters e vídeos mantêm suas cores originais, sem filtro de escala de cinza. Os arquivos originais e as exportações são preservados. As ilustrações continuam conceituais, sem representar provas de resultados comerciais.

No desktop, vídeo e poster do hero preenchem toda a seção: posição absoluta com `inset: 0`, largura e altura de 100% e `object-fit: cover`, com enquadramento à direita. Não há recuo lateral, proporção fixa no elemento ou máscaras nas bordas. A copy ocupa os 46% à esquerda, no campo vazio da própria mídia, sem camada escura sobre a arte. A altura de referência segue 16:9, limitada entre 560px e 760px, e pode crescer com o conteúdo. O enquadramento mobile e os arquivos de vídeo permanecem preservados. Os registros de origem e prompts continuam em [fontes e mídias](../references/third-party.md), [marca](metallic-logo.md), [soluções](services-imagen-square.md), [benefícios](benefits-responsive-imagen.md) e [painéis expandidos](benefits-expanded-imagen.md).

## Interações e acessibilidade

A composição, os textos, as âncoras e os contatos são preservados. A página mantém oito seções: hero, introdução, soluções, benefícios, jornada, processo, FAQ e contato.

- Pilha de canais: Google, Redes Sociais e WhatsApp compartilham o mesmo fundo e a mesma borda branca de 1px. Clique, toque ou teclado abrem um card; Escape, nova ativação ou pressão externa recolhem. `aria-pressed` acompanha a seleção.
- Soluções: imagem fixa com moldura giratória e contrarrotação; marcadores e trilho neutros. Sem JavaScript ou com movimento reduzido, cada solução tem imagem e texto em leitura estática.
- Benefícios: quatro cards expansíveis a partir de 1200px, lista estática até 1199px. Setas, Home/End, foco, toque e mouse selecionam. A expansão preserva a largura do texto.
- Jornada: destaque neutro e conexões discretas; reprodução em ciclo, pausa e navegação manual preservadas. No celular, a sequência é vertical; no tablet, há rolagem horizontal contida.
- FAQ: seis perguntas, duas colunas acima de 1020px e uma abaixo. Apenas uma resposta aberta; botões nativos, `aria-expanded`, Enter/Espaço e navegação por setas/Home/End. O conteúdo aprovado permanece em `docs/content/faq.md`.
- Navegação: menu com Escape e retorno de foco; links fechados saem da ordem de Tab. Âncoras transferem o foco ao destino.
- Vídeo: pausa fora da tela e em aba oculta; pausa manual preservada; erro mantém o poster. Movimento reduzido impede autoplay, permitindo reprodução manual.

Os tempos permanecem em 100ms para pressão, 160ms para estados e 220ms para entradas. Teclado e `prefers-reduced-motion` removem transições dispensáveis. Sem JavaScript, o conteúdo permanece legível.

## Verificação

Os comandos estão no [README](../../README.md). A migração v0.5 registra inspeção em 1440, 768 e 390px e as nove suítes de navegador em `reports/qa/design-system-v05/`. As suítes também cobrem 320px, texto a 200%, ausência de JavaScript, movimento reduzido, teclado, toque, contato e carregamento de mídia. Testes HTTP e de build verificam assets, licenças, exportação estática e limites de publicação.
