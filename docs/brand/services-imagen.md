# Imagens de soluções — ImageGen

> Versão inicial preservada. A seção passou a usar as [imagens com fundo quadrado](services-imagen-square.md), conforme a correção solicitada em 04/11/2026. O script de exportação agora usa essas matrizes quadradas.

Em 04/11/2026, as três ilustrações foram adaptadas com a ferramenta integrada ImageGen, a partir dos PNGs fornecidos pelo usuário. Os originais anteriores permanecem disponíveis e continuam usados nas outras seções.

As novas matrizes estão em `design/originals/services/*-imagen.png`. As exportações públicas estão em `app/static/images/services/*-imagen-{384,768,1254}.webp`, todas quadradas. O navegador escolhe o arquivo com `srcset` e `sizes`, considerando a tela, a densidade de pixels e a ampliação de 1,5× dentro da moldura giratória. No modo estático, `sizes` volta a acompanhar as colunas de conteúdo. As dimensões informadas reservam o espaço antes do carregamento.

Para refazer apenas a redução e a codificação WebP das matrizes locais, execute `node scripts/dev/prepare-service-images.mjs`. A exportação usa Canvas do navegador, sem redesenhar as imagens.

## Prompts finais

### google-presence

Referência: `app/static/images/services/google-presence.png`.

```text
Edit the reference illustration into a finished responsive website service artwork for Ativos Negócios Locais. Preserve its service subject and recognizable visual meaning, but recompose for a rotating square/diamond image mask. Output one high-resolution SQUARE image, ideally 1536 x 1536. Art direction: polished restrained dimensional 3D illustration, midnight navy #101b33 background, deep cyan #007fa8, clear sky blue #55a9dd, ice blue highlights #ddf3ff and sparse acid lime #c7ff3d accents; crisp silhouettes, tactile matte materials, gentle studio illumination. Simplify the dense neon cyberpunk staging, remove scenery, circuit boards and excessive glowing outlines. CRITICAL COMPOSITION: keep ALL meaningful objects completely inside a CENTRAL CIRCLE of diameter 56% of the canvas, centered at x=50%, y=50%, with about 22% clean navy breathing room on all four sides; the website enlarges it 1.5x inside a rotating square and everything outside this circle can be clipped. The core should still read at 110px display size. No captions, no promotional copy, no readable small text, no invented rankings or performance claims, no watermark, no external frame; opaque navy background. This is an illustration, not an actual software screenshot. Subject: local Google visibility. Within the safe circle compose a substantial recognizable multicolor Google G, a compact local shop facade with cyan awning and a clear map location pin. Add only one compact ice-blue search shape behind the storefront, without words, stars, reviews or numbers. Make the pin and store readable, balance foreground G and storefront; no giant panels extending out of safe area.
```

### digital-marketing

Referência: `app/static/images/services/digital-marketing.png`.

```text
Edit the reference illustration into a finished responsive website service artwork for Ativos Negócios Locais. Preserve its service subject and recognizable visual meaning, but recompose for a rotating square/diamond image mask. Output one high-resolution SQUARE image, ideally 1536 x 1536. Art direction: polished restrained dimensional 3D illustration, midnight navy #101b33 background, deep cyan #007fa8, clear sky blue #55a9dd, ice blue highlights #ddf3ff and sparse acid lime #c7ff3d accents; crisp silhouettes, tactile matte materials, gentle studio illumination. Simplify the dense neon cyberpunk staging, remove scenery, circuit boards and excessive glowing outlines. CRITICAL COMPOSITION: keep ALL meaningful objects completely inside a CENTRAL CIRCLE of diameter 56% of the canvas, centered at x=50%, y=50%, with about 22% clean navy breathing room on all four sides; the website enlarges it 1.5x inside a rotating square and everything outside this circle can be clipped. The core should still read at 110px display size. No captions, no promotional copy, no readable small text, no invented rankings or performance claims, no watermark, no external frame; opaque navy background. This is an illustration, not an actual software screenshot. Subject: social advertising and creative campaigns. Replace the crowded person-at-laptop scene with one sculptural cyan megaphone as the dominant object, one compact image creative with a small photographed coffee cup, and recognizable small Instagram and Facebook badges beside the creative. Keep every piece together as one compact centered group entirely inside the safe circle, readable on a mobile thumbnail. No people, no laptop, no rising graphs, no metrics, no floating clutter.
```

### sales-automation

Referência: `app/static/images/services/sales-automation.png`.

```text
Edit the reference illustration into a finished responsive website service artwork for Ativos Negócios Locais. Preserve its service subject and recognizable visual meaning, but recompose for a rotating square/diamond image mask. Output one high-resolution SQUARE image, ideally 1536 x 1536. Art direction: polished restrained dimensional 3D illustration, midnight navy #101b33 background, deep cyan #007fa8, clear sky blue #55a9dd, ice blue highlights #ddf3ff and sparse acid lime #c7ff3d accents; crisp silhouettes, tactile matte materials, gentle studio illumination. Simplify the dense neon cyberpunk staging, remove scenery, circuit boards and excessive glowing outlines. CRITICAL COMPOSITION: keep ALL meaningful objects completely inside a CENTRAL CIRCLE of diameter 56% of the canvas, centered at x=50%, y=50%, with about 22% clean navy breathing room on all four sides; the website enlarges it 1.5x inside a rotating square and everything outside this circle can be clipped. The core should still read at 110px display size. No captions, no promotional copy, no readable small text, no invented rankings or performance claims, no watermark, no external frame; opaque navy background. This is an illustration, not an actual software screenshot. Subject: WhatsApp commercial service automation. A single upright smartphone with a recognizable WhatsApp chat emblem and two broad wordless conversation bubbles, connected by one short clear cyan link to a compact three-column contact organizer with simple contact silhouettes and one small appointment check badge. Keep the smartphone, organizer and badge together entirely inside the central safe circle, large simple silhouettes, no literal words, no tiny dashboards, no fake metrics, no decorative orbit lines.
```
