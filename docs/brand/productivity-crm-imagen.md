# CRM de “Mais produtividade” — ImageGen

Atualização de 05/11/2026 do quarto cartão de “Mais tempo para vender. Menos oportunidades perdidas.”. Imagem fornecida pelo usuário: `app/static/images/services/Painel CRM Neon Isométrico.png`. Ferramenta: **ImageGen integrada**, usando o PNG como alvo de edição e fundo opaco.

Foram criadas quatro composições: miniatura do cartão fechado e painéis abertos próprios para desktop, tablet e celular. A arte mantém o CRM isométrico, a rede de contatos, o fundo Navy e a iluminação Cyan/Lime da referência. As imagens são ilustrações conceituais; os dados representados no painel não são resultados comprovados do serviço.

## Matrizes e exportações

Todas as matrizes ficam em `design/originals/services/`; as nove exportações WebP ficam em `app/static/images/services/`. Os nomes públicos anteriores foram mantidos para conservar o `picture/srcset` da landing.

| Uso | Matriz PNG | Exportações WebP | Formato |
|---|---|---|---|
| Cartão fechado | `productivity-crm-preview.png` | `productivity-imagen-{384,768,1254}.webp` | Quadrado |
| Aberto no desktop | `productivity-crm-expanded-desktop.png` | `productivity-imagen-expanded-desktop-{320,640}.webp` | Vertical 3:7 |
| Aberto no tablet | `productivity-crm-expanded-tablet.png` | `productivity-imagen-expanded-tablet-{384,768}.webp` | Quadrado |
| Aberto no celular | `productivity-crm-expanded-mobile.png` | `productivity-imagen-expanded-mobile-{384,768}.webp` | Horizontal 3:2 |

A redução e a codificação não ampliam as matrizes. O retrato recebe recorte central para 3:7. Os metadados das seis exportações abertas estão em `reports/qa/benefits-expanded-images/productivity-imagen/exports.json`. O preenchimento e a seleção responsiva seguem o [comportamento dos benefícios](benefits-expanded-imagen.md). As matrizes anteriores com relógio e checklist foram preservadas.

```powershell
node scripts/media/prepare-productivity-image.mjs
node scripts/media/prepare-benefit-expanded-images.mjs --artwork productivity-imagen
```

## Prompts finais

### preview

```text
Use case: precise-object-edit / composition adaptation. Asset type: preview image for the 'Mais produtividade' benefit card of Ativos Negócios Locais. Input 'Painel CRM Neon Isométrico.png' is the approved edit target. Adapt this exact isometric CRM scene, preserving its identity: dark navy dashboard labelled CRM, contacts/lead/tasks sidebar, rising customer overview chart, connected floating contact-profile cards, small workflow icons, cyan and lime neon edges, polished dimensional platform and blue reflected lighting. Preserve existing lettering where visible and do not invent new numbers, financial metrics, customer names or claims. Required output geometry: square 1:1, at least 1254x1254 pixels. This is the CLOSED-card thumbnail. Preserve the overall isometric arrangement, keep the main CRM lettering and chart prominent and the connected contact tiles recognizable at small size, with modest margins. Keep the whole central diorama inside the square. Maintain the original rendering style, materials, colors and object identity. Background and lighting continue all the way to all four edges. No clock or old productivity-checklist artwork; use only the CRM scene provided. No new people, brands, watermarks, website headings, outer card frame or mockup. Return only the artwork.
```

### desktop

```text
Use case: precise-object-edit / composition adaptation. Asset type: desktop image for the 'Mais produtividade' benefit card of Ativos Negócios Locais. Input 'Painel CRM Neon Isométrico.png' is the approved edit target. Adapt this exact isometric CRM scene, preserving its identity: dark navy dashboard labelled CRM, contacts/lead/tasks sidebar, rising customer overview chart, connected floating contact-profile cards, small workflow icons, cyan and lime neon edges, polished dimensional platform and blue reflected lighting. Preserve existing lettering where visible and do not invent new numbers, financial metrics, customer names or claims. Required output geometry: tall portrait, preferably 768x1792 pixels (3:7); a portrait of at least 948x1659 pixels is also suitable. This is the OPENED desktop panel, a very tall narrow image. Create a distinct vertical composition, with the CRM dashboard filling the upper and middle part, connected customer tiles staggered vertically along it, and the automation/task icons and illuminated platform toward the bottom. Keep the main CRM lettering, dashboard and key objects in the central 65 percent width to tolerate the narrow side crop. Fill the full image height with the scene; do not place a square miniature in a tall empty canvas. Maintain the original rendering style, materials, colors and object identity. Background and lighting continue all the way to all four edges. No clock or old productivity-checklist artwork; use only the CRM scene provided. No new people, brands, watermarks, website headings, outer card frame or mockup. Return only the artwork.
```

### tablet

```text
Use case: precise-object-edit / composition adaptation. Asset type: tablet image for the 'Mais produtividade' benefit card of Ativos Negócios Locais. Input 'Painel CRM Neon Isométrico.png' is the approved edit target. Adapt this exact isometric CRM scene, preserving its identity: dark navy dashboard labelled CRM, contacts/lead/tasks sidebar, rising customer overview chart, connected floating contact-profile cards, small workflow icons, cyan and lime neon edges, polished dimensional platform and blue reflected lighting. Preserve existing lettering where visible and do not invent new numbers, financial metrics, customer names or claims. Required output geometry: square 1:1, at least 1024x1024 pixels. This is the OPENED tablet panel. Create a distinct close, immersive square composition of the same CRM dashboard and contact network, with the dashboard larger and scene details filling the whole image. It must be a different opened-state framing from the closed thumbnail, without large empty margins. Maintain the original rendering style, materials, colors and object identity. Background and lighting continue all the way to all four edges. No clock or old productivity-checklist artwork; use only the CRM scene provided. No new people, brands, watermarks, website headings, outer card frame or mockup. Return only the artwork.
```

### mobile

```text
Use case: precise-object-edit / composition adaptation. Asset type: mobile image for the 'Mais produtividade' benefit card of Ativos Negócios Locais. Input 'Painel CRM Neon Isométrico.png' is the approved edit target. Adapt this exact isometric CRM scene, preserving its identity: dark navy dashboard labelled CRM, contacts/lead/tasks sidebar, rising customer overview chart, connected floating contact-profile cards, small workflow icons, cyan and lime neon edges, polished dimensional platform and blue reflected lighting. Preserve existing lettering where visible and do not invent new numbers, financial metrics, customer names or claims. Required output geometry: horizontal landscape 3:2, preferably 1536x1024 pixels. This is the OPENED phone panel. Create a distinct wide composition with the CRM dashboard prominent across the center and the connected contact tiles balanced alongside it. Keep the main CRM letters and chart visible and the platform and workflow icons along the lower part. Fill the full width and height without blank bands or clipping the main dashboard. Maintain the original rendering style, materials, colors and object identity. Background and lighting continue all the way to all four edges. No clock or old productivity-checklist artwork; use only the CRM scene provided. No new people, brands, watermarks, website headings, outer card frame or mockup. Return only the artwork.
```
