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

## Layout e componentes

O container tem limite de **1200px**, com margens de 16px em celulares, 24px a partir de 640px, 32px a partir de 1024px e 40px a partir de 1440px. A separação vertical é de 48px em mobile, 64px em tablet e 96px em desktop. Espaçamentos e raios usam a escala dos manuais.

- **Botão primário:** Deep Cyan com texto branco, raio de 8px e altura mínima de 48px. Exemplo: contato pelo WhatsApp quando configurado. Não usar transparência, glow ou blur.
- **Botão secundário:** transparente com contorno e texto visíveis. Exemplo: contato no cabeçalho, que leva à seção final.
- **Desabilitado:** fundo e texto próprios, sem hover de ação. Os contatos sem `WHATSAPP_NUMBER` mantêm `aria-disabled="true"` e não recebem destino fictício.
- **Foco:** contorno externo Lime de 2px com offset de 4px. No painel Ice Blue, usar Navy para manter contraste do indicador.
- **Cards:** Navy elevado com borda discreta, raio de 12px e sem sombra. Exemplos: jornada e processo. Não tratar cards informativos como links.
- **Painel claro:** Ice Blue com texto Navy e raio de 16px. Exemplo: contato final. Não usar Clear Sky como texto sobre Ice Blue.
- **Menu e controles:** alvos mínimos de 44px, estados de hover e foco, Escape e retorno de foco no menu. O breakpoint de 1020px permanece compartilhado com os módulos JS existentes.

O vídeo, as três ilustrações, as âncoras e os destinos configuráveis são mantidos. A seção de depoimentos foi removida a pedido do usuário; o processo é seguido pelo contato final. Um scrim Navy sobre o vídeo protege a leitura; a composição usa mistura de luminosidade para integrar mídias escuras ao canvas, sem editar os arquivos originais. Movimento de entrada dura 220ms e é removido com `prefers-reduced-motion`.

## Marca disponível

Em 03/11/2026, o usuário forneceu a assinatura **Ativos Negócios Locais** em `design/design_system_ativos/logo_negocios_locais.png`, que passa a ser a referência da marca nesta landing. A versão para fundo escuro foi preparada com ImageGen, preservando símbolo, lettering, cores e o descritor. A opção opaca foi escolhida por manter bordas e letras limpas; o original fornecido não foi alterado.

O cabeçalho e o rodapé usam `app/static/images/brand/ativos-negocios-locais.webp`, exportado em 940 × 274px e aproximadamente 41KB, com largura de apresentação de 240px no desktop, 208px no celular e 224px no rodapé desktop. A mistura de luminosidade integra a base Navy da imagem às superfícies da página. O símbolo isolado foi exportado em PNG de 32px para favicon e de 180px para ícone de toque, sem reduzir a assinatura inteira a um ícone ilegível.

O original adaptado fica em `design/originals/brand/ativos-negocios-locais-imagen.png`, e a exportação intermediária em `design/originals/brand/ativos-negocios-locais-web.png`; as exportações publicadas têm recorte e redução de tamanho para web. A assinatura anterior e `reference-mark.svg` continuam preservados como arquivos, sem uso na página. Os SVGs planos citados no manual não foram fornecidos e não foram simulados a partir do raster.

## Verificação

- Integração HTTP: `python -m unittest discover -s tests/integration -v`.
- Navegador em 1440, 768, 390 e 320px: `node tests/browser/landing.mjs`.
- Inspeção visual em 1440, 768 e 390px com o inspetor local da skill `design-taste-frontend`.
- Evidências da migração em `reports/qa/design-system-before/`, `reports/qa/design-system-after/` e `reports/qa/design-system-browser/` (arquivos locais, não versionados).

As regras de negócio, o conteúdo comercial e a configuração de contatos continuam sendo definidos pela aplicação. Esta migração não cria provas sociais, resultados, números ou condições comerciais.
