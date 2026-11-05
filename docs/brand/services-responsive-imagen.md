# Imagens responsivas dos serviços — ImageGen

Atualização de 05/11/2026 da seção “Mais visibilidade. Mais contatos. Mais oportunidades.”. As três artes enviadas pelo usuário foram adaptadas com a ferramenta integrada ImageGen para a moldura quadrada com ampliação de 1,5× e contrarrotação. A edição preserva os assuntos e as cores, reduz o conjunto de objetos e estende o fundo Navy para criar margens. Os PNGs enviados e as matrizes anteriores foram preservados.

| Serviço | PNG fornecido em `app/static/images/services/` | Nome-base das exportações WebP |
|---|---|---|
| Seja encontrado no Google | `Diorama neon de busca e crescimento.png` | `google-presence-imagen-square` |
| Atraia mais clientes nas redes sociais | `Marketing Neon Futurista.png` | `digital-marketing-imagen-square` |
| Transforme contatos em oportunidades | `CRM Neon_ Conexões em Ação.png` | `sales-automation-imagen-square` |

As novas matrizes quadradas ficam em `design/originals/services/{google-presence,digital-marketing,sales-automation}-imagen-square-responsive.png`. Cada uma foi retornada com 1254 × 1254px. As nove exportações ficam em `app/static/images/services/{nome-base}-{384,768,1254}.webp`.

```powershell
node scripts/media/prepare-service-images.mjs
```

O comando usa Canvas somente para redução e codificação WebP, com qualidade 0,86 e sem ampliação. As referências existentes em `app/templates/sections/services.html` carregam as novas exportações. `srcset`, `sizes` e `data-rail-sizes` selecionam a resolução conforme o espaço e a densidade de pixels em desktop, tablet e celular, incluindo os modos estáticos sem JavaScript e com movimento reduzido.

## Prompts finais

### google-presence

Imagem de entrada: `Diorama neon de busca e crescimento.png`, editada com ImageGen integrada.

```text
Use case: precise-object-edit. Asset type: square responsive website service illustration. Input image: Diorama neon de busca e crescimento.png is the approved EDIT TARGET, not loose inspiration. Create a faithful adaptation of this exact supplied artwork for the 'google-presence' service of Ativos Negócios Locais. Keep the multicolor Google G, storefront with blue-white awning, search bar, magnifying glass, map pin on map tile and upward chart, neon blue and lime light, polished metal platform. Keep their relative positions and the original visual identity. The site reveals this illustration through a rotating square mask and enlarges its contents 1.5x. Change only the framing by uniformly scaling the entire coherent foreground group down and seamlessly extending its original dark navy technological background. Keep every important foreground object inside the central approximately 60 percent of the canvas width and height, with generous continuous background margins on all sides, so the Google/social/WhatsApp symbols and main objects remain recognizable when zoomed and masked. Preserve the full artwork's composition, subject, colors, lighting and material detail. Square canvas at least 1254x1254 pixels, preferably 1536x1536. Background fills all four straight edges and corners; no outer frame, circular badge, transparent area, border, added text, new objects or watermark. Return only the finished artwork. Web delivery variants at 384, 768 and 1254px will be encoded separately.
```

### digital-marketing

Imagem de entrada: `Marketing Neon Futurista.png`, editada com ImageGen integrada.

```text
Use case: precise-object-edit. Asset type: square responsive website service illustration. Input image: Marketing Neon Futurista.png is the approved EDIT TARGET, not loose inspiration. Create a faithful adaptation of this exact supplied artwork for the 'digital-marketing' service of Ativos Negócios Locais. Keep the Instagram and Facebook marks above the social post showing a coffee cup, the large blue megaphone, engagement controls, follower counter and rising chart. Preserve all existing symbols and the original blue, lime and magenta neon material treatment. Do not add new text or numerical claims. The site reveals this illustration through a rotating square mask and enlarges its contents 1.5x. Change only the framing by uniformly scaling the entire coherent foreground group down and seamlessly extending its original dark navy technological background. Keep every important foreground object inside the central approximately 60 percent of the canvas width and height, with generous continuous background margins on all sides, so the Google/social/WhatsApp symbols and main objects remain recognizable when zoomed and masked. Preserve the full artwork's composition, subject, colors, lighting and material detail. Square canvas at least 1254x1254 pixels, preferably 1536x1536. Background fills all four straight edges and corners; no outer frame, circular badge, transparent area, border, added text, new objects or watermark. Return only the finished artwork. Web delivery variants at 384, 768 and 1254px will be encoded separately.
```

### sales-automation

Imagem de entrada: `CRM Neon_ Conexões em Ação.png`, editada com ImageGen integrada.

```text
Use case: precise-object-edit. Asset type: square responsive website service illustration. Input image: CRM Neon_ Conexões em Ação.png is the approved EDIT TARGET, not loose inspiration. Create a faithful adaptation of this exact supplied artwork for the 'sales-automation' service of Ativos Negócios Locais. Keep the WhatsApp smartphone on the left, the six contact tiles arranged in two rows of three on the CRM panel at the right, chat bubbles and small checked calendar in front, connected cyan/lime light path and polished platform. Keep all relative positions, logos, object counts, and proportions. The site reveals this illustration through a rotating square mask and enlarges its contents 1.5x. Change only the framing by uniformly scaling the entire coherent foreground group down and seamlessly extending its original dark navy technological background. Keep every important foreground object inside the central approximately 60 percent of the canvas width and height, with generous continuous background margins on all sides, so the Google/social/WhatsApp symbols and main objects remain recognizable when zoomed and masked. Preserve the full artwork's composition, subject, colors, lighting and material detail. Square canvas at least 1254x1254 pixels, preferably 1536x1536. Background fills all four straight edges and corners; no outer frame, circular badge, transparent area, border, added text, new objects or watermark. Return only the finished artwork. Web delivery variants at 384, 768 and 1254px will be encoded separately.
```
