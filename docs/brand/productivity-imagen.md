# Imagem de produtividade — ImageGen

**Versão atual:** o quarto cartão usa o [Painel CRM Neon Isométrico](productivity-crm-imagen.md), fornecido pelo usuário e adaptado com ImageGen em quatro composições. O documento atual registra as matrizes, as exportações e os quatro prompts finais.

## Histórico: relógio, checklist e automação

O restante deste documento registra a versão anterior, cujas matrizes foram preservadas. O script `prepare-productivity-image.mjs` passou a usar `productivity-crm-preview.png`.

Imagem exclusiva de “Mais produtividade”, criada em 05/11/2026 com a ferramenta integrada ImageGen. Mantém o estilo 3D tecnológico, fundo Navy, iluminação Cyan e pequenos detalhes Lime das imagens existentes. Relógio, tarefas concluídas e fluxo automático distinguem o assunto do atendimento por WhatsApp.

A imagem atual foi fornecida pelo usuário em `app/static/images/services/productivity-imagen-1254.png`. Em 05/11/2026, a ferramenta integrada ImageGen produziu uma adaptação fiel, salva em `design/originals/services/productivity-imagen-responsive.png`. A matriz anterior foi preservada em `design/originals/services/productivity-imagen.png`.

As exportações públicas `app/static/images/services/productivity-imagen-{384,768,1254}.webp` são reproduzidas por `node scripts/media/prepare-productivity-image.mjs`, usando Canvas apenas para redução e codificação. Esses três arquivos compartilham a arte quadrada da miniatura do cartão fechado. O painel aberto usa [novas composições independentes para desktop, tablet e celular](benefits-expanded-imagen.md), selecionadas por `<picture>` e exibidas com `object-fit: cover` para preencher toda a área.

## Prompt da adaptação responsiva

Ferramenta: ImageGen integrada, com o PNG do usuário como imagem de edição.

```text
Use case: precise-object-edit. Asset type: responsive website benefit illustration for the existing 'Mais produtividade' card. The referenced local PNG is the edit target and approved artwork. Create a faithful production-ready square adaptation of this exact artwork for use across desktop, tablet and mobile. Preserve the full original composition, the clock on the left, checklist on the right, gear at bottom left, connected task tiles, their exact number and arrangement, midnight navy backdrop, cyan blue and lime lighting, metallic materials and square aspect ratio. Keep all important objects fully inside the canvas with the same modest margins so they remain legible at small display sizes. Do not introduce a new scene, crop objects, add objects, change icons, add text, logos, frames or watermarks. Return only one square artwork at 1536x1536 or larger; three optimized delivery resolutions will be encoded separately from this master.
```

A saída efetiva da ferramenta foi de 1254 × 1254 px; as exportações mantêm essa resolução máxima, sem ampliação.

## Prompt da imagem anterior

```text
Use case: stylized-concept.
Asset type: a finished square raster illustration for the "Mais produtividade" benefit card of Ativos Negócios Locais, used as a small landscape thumbnail and as a taller card illustration.
Primary request: show business productivity through automation of repetitive tasks and saved time. Create a NEW DISTINCT artwork, visually consistent with the existing series: cinematic dimensional 3D technology illustration, midnight navy background, electric blue and cyan luminous edges, glossy dark glass panels, metallic material highlights, a few vivid green/lime completion ticks. High detail with clear large silhouettes, like a premium technology advertising render.
Subject: one substantial three-dimensional analog clock with polished metallic rim and cyan face next to a floating dark glass task board with three broad checklist rows and bright green completed checkmarks. A compact dimensional cyan gear and a short linked sequence of three task tiles convey automatic workflow. Compose everything as one coherent compact group, not scattered unrelated icons. Blue illuminated connections and restrained blue floor reflections match the current technological image series.
Composition: square 1024x1024, opaque dark navy #101B33 to deep blue background. Center the clock and checklist prominently, put all key objects in the central 75% width and central 65% height so they remain recognizable in a 190x144 thumbnail; keep modest dark navy margins. Bright distinct focal objects readable at thumbnail size. No exterior border or frame.
Constraints: this should complement an existing WhatsApp-and-CRM smartphone artwork but must have a completely different silhouette and subject. Do NOT include smartphones, WhatsApp logos, chat screens, people, laptops, text labels, letters, numbers, growth charts, promotional claims, or watermarks. Clock has simple tick marks and hands, no numerals. Task board uses abstract horizontal lines and checkmarks, no readable words. Do not render website UI, headings or a card mockup; return only the artwork.
```
