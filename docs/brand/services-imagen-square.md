# Imagens quadradas da seção de soluções

Atualização de 04/11/2026 solicitada pelo usuário: manter o quadrado visível girando, com a orientação da ilustração fixa. As três imagens foram editadas com a ferramenta integrada ImageGen para substituir a base circular por fundo azul contínuo até as quatro bordas. A moldura continua com proporção 1:1 e cantos retos. A rotação e a contrarrotação existentes não foram alteradas.

As matrizes ativas ficam em `design/originals/services/{google-presence,digital-marketing,sales-automation}-imagen-square.png`. As nove versões publicadas ficam em `app/static/images/services/{google-presence,digital-marketing,sales-automation}-imagen-square-{384,768,1254}.webp`. Os arquivos circulares anteriores foram preservados como versões sem uso nessa seção.

A seleção responsiva continua considerando a densidade de pixels, a ampliação de 1,5× da moldura e os layouts estáticos. `node scripts/dev/prepare-service-images.mjs` exporta as matrizes quadradas ativas.

## Prompt final compartilhado

Cada chamada recebeu como alvo a respectiva matriz anterior `design/originals/services/*-imagen.png`. O prompt foi aplicado separadamente às três imagens:

```text
Use case: precise-object-edit / background replacement. The supplied image is the EDIT TARGET. Change ONLY its background treatment. Preserve the entire central foreground illustration exactly: every object, logo, position, size, colors, lighting and arrangement. Remove the circular/oval blue stage, every ring or circular border, and the outer midnight-navy empty surround. Replace ALL of the background with one continuous opaque deep-cyan blue studio backdrop, base color #0b4f6b, extending seamlessly to all four straight edges and every corner of the square image. The result must be a FULL-BLEED SQUARE illustration, not a circular badge and not a square drawn inside an image. The blue background must be clearly distinguishable from the website's darker #101b33 outside it, so a square clipping window is visible at every rotation angle. Do not make a vignette or fade the edges back to navy. Keep only gentle local contact shadows beneath the existing foreground objects; do not add any new objects or props. Do not enlarge or reposition the foreground, since it must remain safely centered inside the site's rotating square crop. No rounding, no circles or ovals behind the objects, no badge silhouette, no lime border, no outline or frame, no watermark, no added text. Keep the exact square canvas dimensions of the input, with high detail.
```
