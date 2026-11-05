# Imagens quadradas da seção de soluções

As três ilustrações dos serviços foram substituídas em 05/11/2026 por adaptações das artes neon fornecidas pelo usuário. O fundo Navy preenche as quatro bordas, com margens para a ampliação da máscara. A moldura tem proporção 1:1 e cantos retos; a contrarrotação mantém a orientação da ilustração durante a rolagem. Os [arquivos de origem e prompts atuais](services-responsive-imagen.md) documentam esta versão.

As matrizes atuais ficam em `design/originals/services/{google-presence,digital-marketing,sales-automation}-imagen-square-responsive.png`; as anteriores `*-imagen-square.png` foram preservadas. As nove versões publicadas ficam em `app/static/images/services/{google-presence,digital-marketing,sales-automation}-imagen-square-{384,768,1254}.webp`.

A seleção responsiva continua considerando a densidade de pixels, a ampliação de 1,5× da moldura e os layouts estáticos. `node scripts/media/prepare-service-images.mjs` exporta as matrizes quadradas ativas.

## Prompt da composição anterior (04/11/2026)

O prompt abaixo registra a versão anterior, com fundo azul contínuo, e não é usado na exportação atual:

```text
Use case: precise-object-edit / background replacement. The supplied image is the EDIT TARGET. Change ONLY its background treatment. Preserve the entire central foreground illustration exactly: every object, logo, position, size, colors, lighting and arrangement. Remove the circular/oval blue stage, every ring or circular border, and the outer midnight-navy empty surround. Replace ALL of the background with one continuous opaque deep-cyan blue studio backdrop, base color #0b4f6b, extending seamlessly to all four straight edges and every corner of the square image. The result must be a FULL-BLEED SQUARE illustration, not a circular badge and not a square drawn inside an image. The blue background must be clearly distinguishable from the website's darker #101b33 outside it, so a square clipping window is visible at every rotation angle. Do not make a vignette or fade the edges back to navy. Keep only gentle local contact shadows beneath the existing foreground objects; do not add any new objects or props. Do not enlarge or reposition the foreground, since it must remain safely centered inside the site's rotating square crop. No rounding, no circles or ovals behind the objects, no badge silhouette, no lime border, no outline or frame, no watermark, no added text. Keep the exact square canvas dimensions of the input, with high detail.
```
