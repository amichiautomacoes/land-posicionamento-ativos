# Imagem de produtividade — ImageGen

Imagem exclusiva de “Mais produtividade”, criada em 05/11/2026 com a ferramenta integrada ImageGen. Mantém o estilo 3D tecnológico, fundo Navy, iluminação Cyan e pequenos detalhes Lime das imagens existentes. Relógio, tarefas concluídas e fluxo automático distinguem o assunto do atendimento por WhatsApp.

A matriz foi copiada para `design/originals/services/productivity-imagen.png`. As exportações públicas `app/static/images/services/productivity-imagen-{384,768,1254}.webp` são reproduzidas por `node scripts/dev/prepare-productivity-image.mjs`, usando Canvas apenas para redução e codificação, sem redesenhar a imagem. A prévia usa 384px; a imagem principal usa `srcset` e preserva toda a composição com `object-fit: contain`. As imagens anteriores permanecem nos demais cards.

## Prompt final

```text
Use case: stylized-concept.
Asset type: a finished square raster illustration for the "Mais produtividade" benefit card of Ativos Negócios Locais, used as a small landscape thumbnail and as a taller card illustration.
Primary request: show business productivity through automation of repetitive tasks and saved time. Create a NEW DISTINCT artwork, visually consistent with the existing series: cinematic dimensional 3D technology illustration, midnight navy background, electric blue and cyan luminous edges, glossy dark glass panels, metallic material highlights, a few vivid green/lime completion ticks. High detail with clear large silhouettes, like a premium technology advertising render.
Subject: one substantial three-dimensional analog clock with polished metallic rim and cyan face next to a floating dark glass task board with three broad checklist rows and bright green completed checkmarks. A compact dimensional cyan gear and a short linked sequence of three task tiles convey automatic workflow. Compose everything as one coherent compact group, not scattered unrelated icons. Blue illuminated connections and restrained blue floor reflections match the current technological image series.
Composition: square 1024x1024, opaque dark navy #101B33 to deep blue background. Center the clock and checklist prominently, put all key objects in the central 75% width and central 65% height so they remain recognizable in a 190x144 thumbnail; keep modest dark navy margins. Bright distinct focal objects readable at thumbnail size. No exterior border or frame.
Constraints: this should complement an existing WhatsApp-and-CRM smartphone artwork but must have a completely different silhouette and subject. Do NOT include smartphones, WhatsApp logos, chat screens, people, laptops, text labels, letters, numbers, growth charts, promotional claims, or watermarks. Clock has simple tick marks and hands, no numerals. Task board uses abstract horizontal lines and checkmarks, no readable words. Do not render website UI, headings or a card mockup; return only the artwork.
```
