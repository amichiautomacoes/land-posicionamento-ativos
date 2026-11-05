// Run inside the browser through page.eval; keep this function self-contained.
export async function encodeSquareWebpVariants(data) {
  const image = new Image();
  image.src = `data:image/png;base64,${data}`;
  await image.decode();
  if (image.naturalWidth !== image.naturalHeight) throw new Error('Expected a square master');
  return [384, 768, 1254].map(size => {
    if (size > image.naturalWidth) throw new Error('Do not upscale the master');
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const context = canvas.getContext('2d');
    context.imageSmoothingQuality = 'high';
    context.drawImage(image, 0, 0, size, size);
    const encoded = canvas.toDataURL('image/webp', .86);
    if (!encoded.startsWith('data:image/webp;')) throw new Error('WebP encoder unavailable');
    return { size, data: encoded.split(',')[1] };
  });
}
