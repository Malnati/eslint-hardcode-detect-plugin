# Imagem de Social Preview (GitHub)

O GitHub usa uma imagem raster (PNG ou JPEG) na secção **Social preview** do repositório. O SVG não é aceite como card de partilha; a fonte editável fica em [`docs/assets/social-preview.svg`](assets/social-preview.svg) e o ficheiro para upload é [`docs/assets/social-preview.png`](assets/social-preview.png).

## Dimensões

| Critério | Valor |
|----------|--------|
| Proporção | 2:1 (largura : altura) |
| Mínimo aceite pelo GitHub | 640×320 px |
| **Recomendado (melhor exibição)** | **1280×640 px** |

Este repositório fixa o PNG em **1280×640** para alinhar ao desenho nativo do SVG (`viewBox="0 0 1280 640"`).

## Regenerar o PNG a partir do SVG

### Opção A — `rsvg-convert` (librsvg)

Reprodutível e alinhado ao tamanho do `viewBox`:

```bash
rsvg-convert -w 1280 -h 640 docs/assets/social-preview.svg -o docs/assets/social-preview.png
```

### Opção B — Inkscape (linha de comando)

```bash
inkscape docs/assets/social-preview.svg --export-type=png --export-filename=docs/assets/social-preview.png -w 1280 -h 640
```

### Opção C — ImageMagick (quando A/B não estiverem instalados)

Força o canvas exato (fundo sólido igual ao rect do SVG):

```bash
magick -background '#1e1e1e' docs/assets/social-preview.svg -resize 1280x640! docs/assets/social-preview.png
```

## Verificar dimensões

**macOS:**

```bash
sips -g pixelWidth -g pixelHeight docs/assets/social-preview.png
```

**ImageMagick:**

```bash
magick identify -format '%wx%h\n' docs/assets/social-preview.png
```

Critério de aceite: **1280** e **640** pixels.

## Carregar no GitHub

1. Abrir **Settings → General → Social preview** do repositório.
2. Fazer upload de `docs/assets/social-preview.png` (ou arrastar o ficheiro local equivalente).

## Referência de política

Imagens versionadas: [`documentation-policy.md`](documentation-policy.md) (princípio 9 — `docs/assets/`).
