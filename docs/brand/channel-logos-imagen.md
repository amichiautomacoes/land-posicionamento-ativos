# Logos dos canais nos cartões — ImageGen

Em 05/11/2026, as logos enviadas pelo usuário foram incluídas nos cartões Google, Redes Sociais e WhatsApp da seção “Quantos clientes sua empresa perde sem perceber?”. A ferramenta integrada ImageGen removeu os fundos externos. O desenho branco da câmera do Instagram e o contorno e telefone brancos do WhatsApp continuam opacos.

| Cartão | Arquivo fornecido em `app/static/images/services/` | Exportações em `app/static/images/channels/` |
|---|---|---|
| Google | `google_logo.png` | `google-logo-{64,128,192}.webp` |
| Redes Sociais | `instagram_logo.jpg` | `instagram-logo-{64,128,192}.webp` |
| WhatsApp | `whatsapp_logo.jpg` | `whatsapp-logo-{64,128,192}.webp` |

As matrizes PNG com transparência ficam em `design/originals/channels/{google,instagram,whatsapp}-logo-transparent.png`. Os arquivos recebidos foram preservados. As três versões por logo usam a mesma proporção e atendem à exibição em desktop, tablet e celular, incluindo a ampliação de 1,32× do cartão aberto e telas de alta densidade.

```powershell
node scripts/media/prepare-channel-logos.mjs
```

O preparo usa Canvas somente para ajustar o enquadramento pelo canal alfa, reduzir e codificar em WebP com qualidade 0,96. O script verifica transparência real da matriz e os quatro cantos de cada WebP após decodificação. Dimensões, tamanhos e medidas de transparência ficam em `reports/qa/channel-logos/exports.json`.

As logos são decorativas (`alt=""`), pois os nomes dos canais já fazem parte do botão. Não capturam cliques nem alteram a navegação por teclado. Os cartões mantêm seus títulos, descrições, controles de abrir e fechar, foco e adaptação para texto ampliado. Google e WhatsApp mostram a logo acima do título; Redes Sociais a mostra abaixo do texto na pilha fechada e acima do título quando aberto.

## Prompts finais

### google

Imagem de entrada: `google_logo.png`. Ferramenta: ImageGen integrada, com `transparent_background: true`.

```text
Use case: background-extraction. Asset type: transparent channel logo cutout for small interactive website cards. Input image google_logo.png is the edit target. Extract this exact supplied logo on a genuinely transparent alpha background. Keep the exact multicolor G shape, its four original colors and flat edges. Remove all white background, including the empty opening in the center of the G. The open center is transparent, not white. Do not add an outline. Preserve identity, proportions, colors, orientation and original logo design. Center the intact symbol on a square canvas with minimal equal transparent safety margins, crisp clean antialiased edges suitable for 24 to 64 CSS pixel display, at least 512x512 pixels. No redesign, recoloring, new artwork, embellishments, lighting, shadows, text or mockup. Return only a PNG with true transparency. Never simulate transparency with a checkerboard, white, gray or black background.
```

### instagram

Imagem de entrada: `instagram_logo.jpg`. Ferramenta: ImageGen integrada, com `transparent_background: true`.

```text
Use case: background-extraction. Asset type: transparent channel logo cutout for small interactive website cards. Input image instagram_logo.jpg is the edit target. Extract this exact supplied logo on a genuinely transparent alpha background. Keep the exact rounded-square Instagram mark with its original purple-pink-orange-yellow gradient and white camera glyph. Remove only the pale gray external square background. Preserve the white camera outline, white lens ring and white small dot as opaque parts of the logo. The color gradient inside the rounded square remains opaque. Preserve identity, proportions, colors, orientation and original logo design. Center the intact symbol on a square canvas with minimal equal transparent safety margins, crisp clean antialiased edges suitable for 24 to 64 CSS pixel display, at least 512x512 pixels. No redesign, recoloring, new artwork, embellishments, lighting, shadows, text or mockup. Return only a PNG with true transparency. Never simulate transparency with a checkerboard, white, gray or black background.
```

### whatsapp

Imagem de entrada: `whatsapp_logo.jpg`. Ferramenta: ImageGen integrada, com `transparent_background: true`.

```text
Use case: background-extraction. Asset type: transparent channel logo cutout for small interactive website cards. Input image whatsapp_logo.jpg is the edit target. Extract this exact supplied logo on a genuinely transparent alpha background. Keep the exact green chat bubble with its white outline and white telephone handset. Remove the external white square background and cast shadow outside the logo. Preserve the white chat-bubble outline and white telephone handset as opaque parts of the logo; do not punch transparency through these white features. The outside corners and the area around the bubble are transparent. Preserve identity, proportions, colors, orientation and original logo design. Center the intact symbol on a square canvas with minimal equal transparent safety margins, crisp clean antialiased edges suitable for 24 to 64 CSS pixel display, at least 512x512 pixels. No redesign, recoloring, new artwork, embellishments, lighting, shadows, text or mockup. Return only a PNG with true transparency. Never simulate transparency with a checkerboard, white, gray or black background.
```
