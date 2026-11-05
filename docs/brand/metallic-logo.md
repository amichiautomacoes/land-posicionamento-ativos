# Logo metálica do cabeçalho e do rodapé

Aplicada em 04/11/2026 a pedido do usuário.

- Origem fornecida: `design/design_system_ativos/Logo metálico ATIVOS Negócios Locais.png` (2172 × 724px), preservada intacta.
- Edição: ferramenta integrada ImageGen, modo `background-extraction`, com transparência real solicitada pelo usuário.
- Matriz selecionada: `design/originals/brand/ativos-negocios-locais-metalico-transparent.png`.
- Arquivo publicado: `app/static/images/brand/ativos-negocios-locais-metalico.webp` (960 × 255px, 81.000 bytes).
- Preparação: recorte de margens quase transparentes, com margem de segurança, e redução proporcional por Canvas. O alpha é preservado na codificação WebP.
- Uso: cabeçalho e rodapé, com os tamanhos de apresentação existentes e sem mistura de luminosidade.
- Ícones do navegador: `ativos-negocios-locais-metalico-favicon-16.png` e `ativos-negocios-locais-metalico-favicon-32.png`, em `app/static/images/brand/`. Usam apenas o símbolo metálico sobre Midnight Navy para manter contraste nas abas claras e escuras.
- Ícone de toque: `app/static/images/brand/ativos-negocios-locais-metalico-touch-180.png`, derivado do mesmo símbolo em 180 × 180px. Os três ícones usam nomes novos e a versão de arquivo já aplicada por `static_url`, para atualizar o cache.

Para repetir a exportação com a matriz disponível:

```powershell
node scripts/media/prepare-brand-logo.mjs
```

Prompt final usado na edição:

```text
Use case: background-extraction. Edit the provided ORIGINAL metallic ATIVOS Negócios Locais logo. Return an extremely clean alpha cutout of the existing logo, keeping the original silver/cyan artwork and original thin lettering exactly intact. Preserve ATIVOS and NEGÓCIOS LOCAIS verbatim including the accent. Remove the navy background completely from around the logo and through every open space and letter counter. The boundary must be precise and anti-aliased: NO white halo, NO white matte, NO white speckles, NO ragged white pixels, NO added white outline. Do not brighten, emboss further, thicken the letters, add outlines or re-render the typography. Remove the original diffuse outer glow as needed to get a crisp silhouette, but keep cyan outlines that are part of the original metal artwork. Do not remove dark metallic faces belonging to the mark. Maintain the horizontal proportions and small transparent margins. Deliver a single logo with real transparent alpha, ready to composite on Midnight Navy. There must be no background of any color and no checkered pattern.
```
