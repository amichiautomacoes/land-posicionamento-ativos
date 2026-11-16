---
name: ATIVOS Tecnologia
description: Identidade Tech Premium de intensidade discreta, adaptada à web a partir de base.md v0.5.
colors:
  background: "#0c0e12"
  surface: "#1a1d24"
  border: "#1e2c3f"
  text-primary: "#ffffff"
  text-support: "#a3abb8"
  accent: "#c7ff3d"
  action: "#007fa8"
  action-support: "#55a9dd"
typography:
  display:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "clamp(2.5rem, 4vw, 3.5rem)"
    fontWeight: 900
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "clamp(2rem, 3.35vw, 3rem)"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0"
  label:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0"
rounded:
  small: "4px"
  control: "8px"
  card: "12px"
  feature: "16px"
  pill: "999px"
spacing:
  space-1: "8px"
  space-2: "16px"
  space-3: "24px"
  space-4: "32px"
  space-5: "48px"
  space-6: "64px"
  space-7: "96px"
components:
  button-primary:
    backgroundColor: "{colors.action}"
    textColor: "{colors.text-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "16px 24px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.action-support}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "16px 24px"
  process-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.card}"
    padding: "24px"
  faq-trigger:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.card}"
    padding: "24px"
---

# Design System: ATIVOS Tecnologia

## Overview

**Creative North Star: "Tech Premium, intensidade discreta"**

A identidade fornecida pelo usuário em `design/design_system_ativos/base.md` (v0.5, 16/11/2026) orienta a interface: precisão geométrica, confiança corporativa e espaço negativo generoso. Esta captura descreve a adaptação implementada; os tokens acima são normativos e correspondem a `app/static/css/tokens.css`.

Preservar a composição, os textos aprovados, os contatos e as interações existentes. A documentação detalhada permanece em `docs/brand/design-system.md`.

**Key Characteristics:**
- Fundo grafite com superfícies discretas e contornos finos.
- Inter com títulos densos e texto de leitura confortável.
- Destaques textuais e números dos cards das seções 04 e 06 em Acid Lime; títulos da seção 03 brancos.
- Imagens, vídeos e marcas oficiais com suas cores originais, conforme solicitação do usuário.

## Colors

### Primary

- **Verde-lima textual** (`accent`): palavra ou trecho destacado do título; sem preenchimentos, halos ou sombras coloridas.

### Neutral

- **Deep Cyan** (`action`, `#007FA8`): preenchimento dos botões principais, retomado da paleta ATIVOS por solicitação do usuário.
- **Numeração e soluções:** a seção 03 usa títulos e números brancos. Os números dos cards das seções 04 e 06 usam Acid Lime em todos os estados, conforme solicitação do usuário.
- **Clear Sky** (`action-support`, `#55A9DD`): texto e contorno dos controles secundários.
- **Grafite profundo** (`background`): fundo da página.
- **Grafite de superfície** (`surface`): cards, FAQ, contato e rodapé.
- **Contorno azul-grafite** (`border`): limites e conexões discretas de um pixel.
- **Branco principal** (`text-primary`): títulos, texto principal, botão e foco.
- **Cinza de apoio** (`text-support`): descrições secundárias, rótulos, links e ícones.

**The Acento Textual Rule.** Lima é reservado ao texto: destaques de títulos e números dos cards das seções 04 e 06. A seção 03 usa títulos e números brancos. Rótulos e links de leitura permanecem neutros; controles de ação usam os azuis aprovados pelo usuário. A seleção combina texto lima com fundo neutro.

## Typography

Inter é auto-hospedada como WOFF2 variável, com fallback Arial e sans-serif. Os papéis display e headline usam os tokens acima; nomes de cards usam title e o corpo usa body. Os títulos das soluções têm escala própria fluida (`--text-solution-title`); índices usam algarismos tabulares. A pilha compacta reduz os nomes a 1,125rem quando necessário.

Títulos têm quebra equilibrada; parágrafos usam quebra cuidadosa e medida de até 65ch. Controles usam label; apoio usa o mesmo tamanho com peso de corpo. O lettering do logotipo oficial permanece no arquivo de marca. A página não contém uso que exija JetBrains Mono.

## Layout

Conteúdo centralizado até 1200px; o contêiner estreito chega a 896px. O hero desktop usa a largura disponível entre as margens, com 46% para a copy. Margens laterais de 16px passam a 32px em 640px, 48px em 1024px e 64px em 1440px. A escala spacing organiza a proximidade: título–descrição usa space-3, nome–frase usa space-1 e cards irmãos usam space-3.

O intervalo entre seções soma 64px no celular e 96px a partir de 640px. O grupo de título se distancia do conteúdo em space-4 no celular e space-5 nas demais telas. Navegação e FAQ mudam em 1020px; pilha e processo têm ajustes em 1100px. Benefícios mantêm composição estática até 1199px e expansão a partir de 1200px. O trilho de soluções possui ajustes próprios em 640, 768 e 992px. Preservar essas regras locais; não unificar breakpoints sem verificar os componentes.

## Elevation & Depth

Não há sombras de interface. A profundidade vem de superfícies tonais, contornos, sobreposição dos cards e movimento. Ações usam variações de azul no hover e na pressão; cards preservam estados neutros. No desktop, vídeo e poster do hero cobrem a seção inteira com `object-fit: cover`, sem recuo ou máscaras nas bordas. A copy usa o campo vazio à esquerda da mídia, sem scrim sobre a arte. A altura de referência segue 16:9 entre 560px e 760px, crescendo se o conteúdo exigir.

## Shapes

Controles têm raio control; cards têm raio card e painéis amplos usam feature. Bordas têm um pixel. Alvos interativos têm no mínimo 44px e ações principais no mínimo 48px; o padding pode aumentar a altura natural. Ícones circulares da pilha usam pill.

## Components

- **Botões:** primário Deep Cyan com texto branco; secundário transparente com contorno e texto Clear Sky. Padding space-2 × space-3. Hover e pressão usam variações de azul; pressão aplica escala 0,97 somente com ponteiro. Foco branco de 2px, deslocado 4px.
- **WhatsApp:** os CTAs das seções 07 e 08 compartilham o botão principal preenchido Deep Cyan com texto branco.
- **Navegação:** links de apoio com peso de controle, branco no hover e alvo mínimo de 44px. Menu compacto abaixo de 1021px; Escape fecha e devolve o foco. Sem JavaScript, os links continuam disponíveis.
- **Cards:** superfícies neutras, raio card e padding até space-3. A pilha de canais preserva logos oficiais, seleção por clique/toque/teclado e recolhimento por Escape ou clique externo.
- **FAQ:** contorno fino, superfície escura e pergunta com peso de nome. Duas colunas no desktop, uma em 1020px; padding space-2 no celular. Uma resposta aberta, botões nativos e estados ARIA. Sem JavaScript, respostas legíveis.
- **Componentes de narrativa:** manter trilho de soluções, benefícios expansíveis a partir de 1200px e jornada com suas alternativas estáticas e navegação existentes. Benefícios usam lista estática até 1199px. Vídeo pausa fora da tela, em aba oculta e por comando manual.

Estados usam `--motion-press`, `--motion-fast`, `--motion-enter` e `--ease-out`; seus valores e amostras estão na sidecar. Foco e ativação por teclado são imediatos. `prefers-reduced-motion` remove transições e animações; o vídeo não inicia automaticamente nesse modo.

## Do's and Don'ts

### Do:

- **Do** usar os tokens atuais e os aliases semânticos do CSS.
- **Do** preservar os textos aprovados, a composição e as interações acessíveis existentes.
- **Do** manter imagens, vídeos e logos com suas cores originais.
- **Do** verificar leitura em 360px, reflow e texto ampliado.

### Don't:

- **Don't** aplicar lima em fundos, bordas, halos, sombras, links ou rótulos.
- **Don't** redesenhar o lettering ou recolorir arbitrariamente logos oficiais.
- **Don't** usar imagens conceituais como prova de resultados comerciais.
- **Don't** copiar tamanhos absolutos do canvas social para texto essencial da web.
