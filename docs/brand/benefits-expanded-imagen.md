# Artes dos benefícios: cartão fechado e aberto

Atualização de 05/11/2026 da seção “Mais tempo para vender. Menos oportunidades perdidas.”. O estado aberto passou a usar uma composição própria por dispositivo, criada com ImageGen integrada. A miniatura continua separada. O painel de imagem é preenchido até as bordas com `object-fit: cover`, sem as faixas vazias produzidas pelo enquadramento anterior.

## Arquivos

| Benefício | Nome-base |
|---|---|
| Mais visibilidade | `benefit-visibility` |
| Mais oportunidades | `benefit-opportunities` |
| Atendimento ágil | `sales-automation-benefit` |
| Mais produtividade | `productivity-imagen` |

Os arquivos públicos ficam em `app/static/images/services/`:

| Uso | Nome a partir do nome-base | Formato |
|---|---|---|
| Miniatura do cartão fechado | `{nome-base}-{384,768,1254}.webp` | Arte quadrada anterior |
| Painel aberto no desktop | `{nome-base}-expanded-desktop-{320,640}.webp` | Vertical 3:7, aproximadamente 320×747 e 640×1493px |
| Painel no tablet | `{nome-base}-expanded-tablet-{384,768}.webp` | Quadrado 1:1 |
| Painel no celular | `{nome-base}-expanded-mobile-{384,768}.webp` | Horizontal 3:2, 384×256 e 768×512px |

As matrizes ficam em `design/originals/services/{nome-base}-expanded-{desktop,tablet,mobile}.png`, exceto a produtividade atual, que usa `productivity-crm-expanded-{desktop,tablet,mobile}.png`. Os originais anteriores foram preservados. A ferramenta retornou retratos em aproximadamente 4:7, quadrados e paisagens 3:2. O preparo aplica recorte central para o formato final, redução e codificação WebP a 0,88, sem ampliação. Dimensões, recorte e tamanho das exportações iniciais constam de `reports/qa/benefits-expanded-images/exports.json`; a substituição de produtividade tem relatório próprio em `reports/qa/benefits-expanded-images/productivity-imagen/exports.json`.

O quarto cartão foi atualizado com o [Painel CRM Neon Isométrico](productivity-crm-imagen.md), incluindo nova miniatura e três novas composições abertas. Os prompts de produtividade abaixo registram a versão anterior de relógio e checklist; os quatro prompts atuais estão no documento do CRM.

```powershell
node scripts/media/prepare-benefit-expanded-images.mjs
```

## Seleção e comportamento

`app/templates/sections/benefits.html` usa uma imagem independente para a prévia e um `<picture>` para o painel aberto. Cada formato possui `srcset` próprio. Acima de 1020px, a apresentação interativa seleciona a arte vertical. Entre 640 e 1020px, usa a arte quadrada. Abaixo de 640px, usa a arte horizontal. O tablet e o celular mantêm a apresentação empilhada e as imagens visíveis.

O JavaScript ativa a fonte vertical somente enquanto o layout expandido do desktop está ativo. Quando texto ampliado exige a apresentação estática, a fonte volta ao formato quadrado ou horizontal. Sem JavaScript, o HTML também usa esses formatos estáticos. A preferência de movimento reduzido mantém a seleção dos cartões sem animação.

As fontes, os textos, a navegação por teclado, a largura constante da coluna de texto e a animação de recorte foram mantidos. O modo de mesclagem anterior foi removido da imagem principal para conservar as cores e o fundo da nova composição.

## Prompts finais

### benefit-visibility — desktop

Imagem de entrada: `design/originals/services/benefit-visibility-responsive.png`. Ferramenta: ImageGen integrada, fundo opaco.

```text
Use case: precise-object-edit / composition adaptation. Asset type: dedicated OPENED-state desktop image for the 'benefit-visibility' benefit card on Ativos Negócios Locais. Input is the approved source artwork, used as the edit target and identity/style reference. Create a new composition of the same subject: the Google G, Google search listing, smartphone showing a local storefront, magnifying glass, map pin, ratings and rising chart, in the original cyan-blue and golden neon style. Required output geometry: a tall portrait image, width 768 and height 1792, aspect ratio 3:7. The opened desktop panel is very tall and narrow. Fill its entire height with the main scene. Keep crucial symbols and faces inside the central 65% of the width to tolerate small side crops at narrower desktop widths. Arrange the search listing and upward chart toward the top, the large Google G and smartphone in the middle, and map/location and magnifying glass toward the lower portion. The objects should form one coherent tall, immersive scene rather than a square group floating halfway down a portrait canvas. Make the artwork full bleed, with scene detail and lighting reaching every edge, no small centered square, no miniature scene surrounded by empty flat space, no letterboxing, no mattes or container background bands. Maintain the original rendering style, lighting and color palette. Do not add new people, brands, claims, watermarks, exterior borders, website UI or headings. Return only the artwork, not a screenshot of a card.
```

### benefit-visibility — tablet

Imagem de entrada: `design/originals/services/benefit-visibility-responsive.png`. Ferramenta: ImageGen integrada, fundo opaco.

```text
Use case: precise-object-edit / composition adaptation. Asset type: dedicated OPENED-state tablet image for the 'benefit-visibility' benefit card on Ativos Negócios Locais. Input is the approved source artwork, used as the edit target and identity/style reference. Create a new composition of the same subject: the Google G, Google search listing, smartphone showing a local storefront, magnifying glass, map pin, ratings and rising chart, in the original cyan-blue and golden neon style. Required output geometry: a square image, at least 1024 by 1024 pixels, aspect ratio 1:1. Make a fresh close, immersive square composition for the opened tablet panel. Rearrange the same objects tastefully to use the whole square. This is a distinct opened-state artwork, different framing from the provided closed-card thumbnail. Preserve the same subject, characters and logo identities while adapting their placement to this new aspect ratio. Make the artwork full bleed, with scene detail and lighting reaching every edge, no small centered square, no miniature scene surrounded by empty flat space, no letterboxing, no mattes or container background bands. Maintain the original rendering style, lighting and color palette. Do not add new people, brands, claims, watermarks, exterior borders, website UI or headings. Return only the artwork, not a screenshot of a card.
```

### benefit-visibility — mobile

Imagem de entrada: `design/originals/services/benefit-visibility-responsive.png`. Ferramenta: ImageGen integrada, fundo opaco.

```text
Use case: precise-object-edit / composition adaptation. Asset type: dedicated OPENED-state mobile image for the 'benefit-visibility' benefit card on Ativos Negócios Locais. Input is the approved source artwork, used as the edit target and identity/style reference. Create a new composition of the same subject: the Google G, Google search listing, smartphone showing a local storefront, magnifying glass, map pin, ratings and rising chart, in the original cyan-blue and golden neon style. Required output geometry: a horizontal landscape image, width 1536 and height 1024, aspect ratio 3:2. Recompose the same subject horizontally for the opened phone panel. Put key objects across the width in a coherent wide scene and keep faces, logos and main devices entirely inside the frame. Fill the full landscape canvas without blank bands. Preserve the same subject, characters and logo identities while adapting their placement to this new aspect ratio. Make the artwork full bleed, with scene detail and lighting reaching every edge, no small centered square, no miniature scene surrounded by empty flat space, no letterboxing, no mattes or container background bands. Maintain the original rendering style, lighting and color palette. Do not add new people, brands, claims, watermarks, exterior borders, website UI or headings. Return only the artwork, not a screenshot of a card.
```

### benefit-opportunities — desktop

Imagem de entrada: `design/originals/services/benefit-opportunities-responsive.png`. Ferramenta: ImageGen integrada, fundo opaco.

```text
Use case: precise-object-edit / composition adaptation. Asset type: dedicated OPENED-state desktop image for the 'benefit-opportunities' benefit card on Ativos Negócios Locais. Input is the approved source artwork, used as the edit target and identity/style reference. Create a new composition of the same subject: the same woman with the same identity, hair, glasses, white shirt and laptop, surrounded by Instagram, Facebook, content editing and analytics panels in the original cinematic office with cyan-blue and magenta neon. Required output geometry: a tall portrait image, width 768 and height 1792, aspect ratio 3:7. The opened desktop panel is very tall and narrow. Fill its entire height with the main scene. Keep crucial symbols and faces inside the central 65% of the width to tolerate small side crops at narrower desktop widths. Place the same woman and laptop prominently through the middle and lower part of the tall composition, with social panels staggered above and alongside her. Preserve face and body proportions. Bring the viewer into the scene so it fills the entire tall frame, rather than shrinking a square photo into its center. Make the artwork full bleed, with scene detail and lighting reaching every edge, no small centered square, no miniature scene surrounded by empty flat space, no letterboxing, no mattes or container background bands. Maintain the original rendering style, lighting and color palette. Do not add new people, brands, claims, watermarks, exterior borders, website UI or headings. Return only the artwork, not a screenshot of a card.
```

### benefit-opportunities — tablet

Imagem de entrada: `design/originals/services/benefit-opportunities-responsive.png`. Ferramenta: ImageGen integrada, fundo opaco.

```text
Use case: precise-object-edit / composition adaptation. Asset type: dedicated OPENED-state tablet image for the 'benefit-opportunities' benefit card on Ativos Negócios Locais. Input is the approved source artwork, used as the edit target and identity/style reference. Create a new composition of the same subject: the same woman with the same identity, hair, glasses, white shirt and laptop, surrounded by Instagram, Facebook, content editing and analytics panels in the original cinematic office with cyan-blue and magenta neon. Required output geometry: a square image, at least 1024 by 1024 pixels, aspect ratio 1:1. Make a fresh close, immersive square composition for the opened tablet panel. Rearrange the same objects tastefully to use the whole square. This is a distinct opened-state artwork, different framing from the provided closed-card thumbnail. Preserve the same subject, characters and logo identities while adapting their placement to this new aspect ratio. Make the artwork full bleed, with scene detail and lighting reaching every edge, no small centered square, no miniature scene surrounded by empty flat space, no letterboxing, no mattes or container background bands. Maintain the original rendering style, lighting and color palette. Do not add new people, brands, claims, watermarks, exterior borders, website UI or headings. Return only the artwork, not a screenshot of a card.
```

### benefit-opportunities — mobile

Imagem de entrada: `design/originals/services/benefit-opportunities-responsive.png`. Ferramenta: ImageGen integrada, fundo opaco.

```text
Use case: precise-object-edit / composition adaptation. Asset type: dedicated OPENED-state mobile image for the 'benefit-opportunities' benefit card on Ativos Negócios Locais. Input is the approved source artwork, used as the edit target and identity/style reference. Create a new composition of the same subject: the same woman with the same identity, hair, glasses, white shirt and laptop, surrounded by Instagram, Facebook, content editing and analytics panels in the original cinematic office with cyan-blue and magenta neon. Required output geometry: a horizontal landscape image, width 1536 and height 1024, aspect ratio 3:2. Recompose the same subject horizontally for the opened phone panel. Put key objects across the width in a coherent wide scene and keep faces, logos and main devices entirely inside the frame. Fill the full landscape canvas without blank bands. Preserve the same subject, characters and logo identities while adapting their placement to this new aspect ratio. Make the artwork full bleed, with scene detail and lighting reaching every edge, no small centered square, no miniature scene surrounded by empty flat space, no letterboxing, no mattes or container background bands. Maintain the original rendering style, lighting and color palette. Do not add new people, brands, claims, watermarks, exterior borders, website UI or headings. Return only the artwork, not a screenshot of a card.
```

### sales-automation-benefit — desktop

Imagem de entrada: `design/originals/services/sales-automation-responsive.png`. Ferramenta: ImageGen integrada, fundo opaco.

```text
Use case: precise-object-edit / composition adaptation. Asset type: dedicated OPENED-state desktop image for the 'sales-automation-benefit' benefit card on Ativos Negócios Locais. Input is the approved source artwork, used as the edit target and identity/style reference. Create a new composition of the same subject: the WhatsApp smartphone, CRM smartphone, automation connections and the four status panels, keeping their existing Portuguese wording, logos, cyan-blue and green neon style and polished materials. Required output geometry: a tall portrait image, width 768 and height 1792, aspect ratio 3:7. The opened desktop panel is very tall and narrow. Fill its entire height with the main scene. Keep crucial symbols and faces inside the central 65% of the width to tolerate small side crops at narrower desktop widths. Stagger the two smartphones vertically through the tall composition, with the WhatsApp logo and handset interface recognizable, the CRM contacts on the other device, and status panels distributed from top to bottom. Do not shrink both phones into a small square area in the center. Keep all existing Portuguese lettering accurate, adding no new words. Make the artwork full bleed, with scene detail and lighting reaching every edge, no small centered square, no miniature scene surrounded by empty flat space, no letterboxing, no mattes or container background bands. Maintain the original rendering style, lighting and color palette. Do not add new people, brands, claims, watermarks, exterior borders, website UI or headings. Return only the artwork, not a screenshot of a card.
```

### sales-automation-benefit — tablet

Imagem de entrada: `design/originals/services/sales-automation-responsive.png`. Ferramenta: ImageGen integrada, fundo opaco.

```text
Use case: precise-object-edit / composition adaptation. Asset type: dedicated OPENED-state tablet image for the 'sales-automation-benefit' benefit card on Ativos Negócios Locais. Input is the approved source artwork, used as the edit target and identity/style reference. Create a new composition of the same subject: the WhatsApp smartphone, CRM smartphone, automation connections and the four status panels, keeping their existing Portuguese wording, logos, cyan-blue and green neon style and polished materials. Required output geometry: a square image, at least 1024 by 1024 pixels, aspect ratio 1:1. Make a fresh close, immersive square composition for the opened tablet panel. Rearrange the same objects tastefully to use the whole square. This is a distinct opened-state artwork, different framing from the provided closed-card thumbnail. Preserve the same subject, characters and logo identities while adapting their placement to this new aspect ratio. Make the artwork full bleed, with scene detail and lighting reaching every edge, no small centered square, no miniature scene surrounded by empty flat space, no letterboxing, no mattes or container background bands. Maintain the original rendering style, lighting and color palette. Do not add new people, brands, claims, watermarks, exterior borders, website UI or headings. Return only the artwork, not a screenshot of a card.
```

### sales-automation-benefit — mobile

Imagem de entrada: `design/originals/services/sales-automation-responsive.png`. Ferramenta: ImageGen integrada, fundo opaco.

```text
Use case: precise-object-edit / composition adaptation. Asset type: dedicated OPENED-state mobile image for the 'sales-automation-benefit' benefit card on Ativos Negócios Locais. Input is the approved source artwork, used as the edit target and identity/style reference. Create a new composition of the same subject: the WhatsApp smartphone, CRM smartphone, automation connections and the four status panels, keeping their existing Portuguese wording, logos, cyan-blue and green neon style and polished materials. Required output geometry: a horizontal landscape image, width 1536 and height 1024, aspect ratio 3:2. Recompose the same subject horizontally for the opened phone panel. Put key objects across the width in a coherent wide scene and keep faces, logos and main devices entirely inside the frame. Fill the full landscape canvas without blank bands. Preserve the same subject, characters and logo identities while adapting their placement to this new aspect ratio. Make the artwork full bleed, with scene detail and lighting reaching every edge, no small centered square, no miniature scene surrounded by empty flat space, no letterboxing, no mattes or container background bands. Maintain the original rendering style, lighting and color palette. Do not add new people, brands, claims, watermarks, exterior borders, website UI or headings. Return only the artwork, not a screenshot of a card.
```

### productivity-imagen — desktop (versão anterior)

Imagem de entrada: `design/originals/services/productivity-imagen-responsive.png`. Ferramenta: ImageGen integrada, fundo opaco.

```text
Use case: precise-object-edit / composition adaptation. Asset type: dedicated OPENED-state desktop image for the 'productivity-imagen' benefit card on Ativos Negócios Locais. Input is the approved source artwork, used as the edit target and identity/style reference. Create a new composition of the same subject: the large metallic clock, completed checklist, gear and connected automation task tiles, keeping the original dark navy, luminous cyan-blue and lime colors and dimensional polished materials. Required output geometry: a tall portrait image, width 768 and height 1792, aspect ratio 3:7. The opened desktop panel is very tall and narrow. Fill its entire height with the main scene. Keep crucial symbols and faces inside the central 65% of the width to tolerate small side crops at narrower desktop widths. Stack the large clock in the upper half, completed checklist through the middle and automatic task tiles with gear toward the lower part. Fill the tall composition with this coherent workflow scene rather than placing the existing square group in its center. Keep the clock tick marks without numerals and the abstract task lines without added words. Make the artwork full bleed, with scene detail and lighting reaching every edge, no small centered square, no miniature scene surrounded by empty flat space, no letterboxing, no mattes or container background bands. Maintain the original rendering style, lighting and color palette. Do not add new people, brands, claims, watermarks, exterior borders, website UI or headings. Return only the artwork, not a screenshot of a card.
```

### productivity-imagen — tablet (versão anterior)

Imagem de entrada: `design/originals/services/productivity-imagen-responsive.png`. Ferramenta: ImageGen integrada, fundo opaco.

```text
Use case: precise-object-edit / composition adaptation. Asset type: dedicated OPENED-state tablet image for the 'productivity-imagen' benefit card on Ativos Negócios Locais. Input is the approved source artwork, used as the edit target and identity/style reference. Create a new composition of the same subject: the large metallic clock, completed checklist, gear and connected automation task tiles, keeping the original dark navy, luminous cyan-blue and lime colors and dimensional polished materials. Required output geometry: a square image, at least 1024 by 1024 pixels, aspect ratio 1:1. Make a fresh close, immersive square composition for the opened tablet panel. Rearrange the same objects tastefully to use the whole square. This is a distinct opened-state artwork, different framing from the provided closed-card thumbnail. Preserve the same subject, characters and logo identities while adapting their placement to this new aspect ratio. Make the artwork full bleed, with scene detail and lighting reaching every edge, no small centered square, no miniature scene surrounded by empty flat space, no letterboxing, no mattes or container background bands. Maintain the original rendering style, lighting and color palette. Do not add new people, brands, claims, watermarks, exterior borders, website UI or headings. Return only the artwork, not a screenshot of a card.
```

### productivity-imagen — mobile (versão anterior)

Imagem de entrada: `design/originals/services/productivity-imagen-responsive.png`. Ferramenta: ImageGen integrada, fundo opaco.

```text
Use case: precise-object-edit / composition adaptation. Asset type: dedicated OPENED-state mobile image for the 'productivity-imagen' benefit card on Ativos Negócios Locais. Input is the approved source artwork, used as the edit target and identity/style reference. Create a new composition of the same subject: the large metallic clock, completed checklist, gear and connected automation task tiles, keeping the original dark navy, luminous cyan-blue and lime colors and dimensional polished materials. Required output geometry: a horizontal landscape image, width 1536 and height 1024, aspect ratio 3:2. Recompose the same subject horizontally for the opened phone panel. Put key objects across the width in a coherent wide scene and keep faces, logos and main devices entirely inside the frame. Fill the full landscape canvas without blank bands. Preserve the same subject, characters and logo identities while adapting their placement to this new aspect ratio. Make the artwork full bleed, with scene detail and lighting reaching every edge, no small centered square, no miniature scene surrounded by empty flat space, no letterboxing, no mattes or container background bands. Maintain the original rendering style, lighting and color palette. Do not add new people, brands, claims, watermarks, exterior borders, website UI or headings. Return only the artwork, not a screenshot of a card.
```
