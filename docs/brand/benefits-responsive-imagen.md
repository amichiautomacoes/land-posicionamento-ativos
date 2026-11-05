# Imagens responsivas dos benefícios — ImageGen

As três imagens fornecidas pelo usuário foram adaptadas com a ferramenta integrada ImageGen em 05/11/2026. As artes de visibilidade e oportunidades foram recompostas em formato quadrado, reduzindo o espaço vazio das matrizes verticais. A arte de atendimento mantém a composição quadrada com WhatsApp e CRM. Os PNGs enviados pelo usuário foram preservados.

| Quadro | PNG fornecido em `app/static/images/services/` | Exportações WebP na mesma pasta |
|---|---|---|
| Mais visibilidade | `benefit-visibility.png` | `benefit-visibility-{384,768,1254}.webp` |
| Mais oportunidades | `benefit-opportunities.png` | `benefit-opportunities-{384,768,1254}.webp` |
| Atendimento ágil | `sales-automation.png` | `sales-automation-benefit-{384,768,1254}.webp` |

As adaptações ficam em `design/originals/services/{benefit-visibility,benefit-opportunities,sales-automation}-responsive.png`. Para reproduzir as exportações:

```powershell
node scripts/media/prepare-benefit-images.mjs
```

Canvas é usado apenas para redução e codificação WebP com qualidade 0,86, sem ampliação. Essas exportações quadradas atendem às miniaturas dos cartões fechados, com `srcset` de 384, 768 e 1254px. Os painéis abertos usam [artes independentes por dispositivo](benefits-expanded-imagen.md), com enquadramento vertical, quadrado ou horizontal e preenchimento completo da área de imagem.

A saída efetiva da ferramenta foi de 1254 × 1254 px para cada imagem; as exportações mantêm essa resolução máxima.

## Prompts finais

### benefit-visibility

Imagem de entrada: o PNG de mesmo nome enviado pelo usuário. Ferramenta: ImageGen integrada.

```text
Use case: precise-object-edit. Asset type: finished square responsive web illustration for an existing Ativos Negócios Locais benefit card. Input image: the supplied benefit-visibility.png is the approved edit target. Primary request: create a faithful square adaptation for desktop, tablet and phone delivery. Preserve the Google G, local Google search listing, business smartphone, map pin and ratings, magnifying glass, upward chart, illuminated blue and gold platform. Recompose the tall original into a compact square, reducing only excess empty background above and below; keep the entire central object group visible and recognizable. Keep the original rendering style, colors and subject. Composition: square, preferably 1536x1536 pixels, with only a modest safe margin around the important objects, large readable silhouettes at thumbnail size, no clipped people, phones or primary panels. Constraints: no new people, new claims, watermarks, website headings, external frames or unrelated objects. Return only the artwork. Delivery files at 384, 768 and 1254 pixels will be encoded separately from this master.
```

### benefit-opportunities

Imagem de entrada: o PNG de mesmo nome enviado pelo usuário. Ferramenta: ImageGen integrada.

```text
Use case: precise-object-edit. Asset type: finished square responsive web illustration for an existing Ativos Negócios Locais benefit card. Input image: the supplied benefit-opportunities.png is the approved edit target. Primary request: create a faithful square adaptation for desktop, tablet and phone delivery. Preserve the same woman's identity, face, hair, glasses, clothing and laptop, the Instagram panel on the left, Facebook panel on the right, content editing and analytics panels, office setting and blue-magenta lighting. Recompose the tall original into a compact square, reducing empty ceiling and foreground tabletop. Keep the woman and laptop as the focus and all four main panels clearly inside the frame. Preserve natural human proportions and the original devices. Keep the original rendering style, colors and subject. Composition: square, preferably 1536x1536 pixels, with only a modest safe margin around the important objects, large readable silhouettes at thumbnail size, no clipped people, phones or primary panels. Constraints: no new people, new claims, watermarks, website headings, external frames or unrelated objects. Return only the artwork. Delivery files at 384, 768 and 1254 pixels will be encoded separately from this master.
```

### sales-automation

Imagem de entrada: o PNG de mesmo nome enviado pelo usuário. Ferramenta: ImageGen integrada.

```text
Use case: precise-object-edit. Asset type: finished square responsive web illustration for an existing Ativos Negócios Locais benefit card. Input image: the supplied sales-automation.png is the approved edit target. Primary request: create a faithful square adaptation for desktop, tablet and phone delivery. Preserve the exact square composition with the WhatsApp smartphone on the left, CRM smartphone on the right, and four status panels. Keep all existing Portuguese words and accents verbatim, including Novo lead recebido, Atendimento iniciado, Follow-up enviado, Agendamento confirmado and CRM Comercial. Preserve all chat wording, logos, phone geometry and blue-green lighting. Do not change wording or add interface elements. Keep the original rendering style, colors and subject. Composition: square, preferably 1536x1536 pixels, with only a modest safe margin around the important objects, large readable silhouettes at thumbnail size, no clipped people, phones or primary panels. Constraints: no new people, new claims, watermarks, website headings, external frames or unrelated objects. Return only the artwork. Delivery files at 384, 768 and 1254 pixels will be encoded separately from this master.
```
