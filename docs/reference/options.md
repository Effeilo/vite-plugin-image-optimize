# Options

All options are passed as a single object to the `imageOptimize()` function. Every option is optional - the plugin works with zero configuration.

```js
imageOptimize({
  jpegQuality: 80,
  pngQuality: 80,
  webpQuality: 75,
  avifQuality: 50,
  webpEnable: true,
  avifEnable: true,
  exclude: [],
  logListings: true
})
```

---

## Quick reference

| Option | Type | Default | Description |
|---|---|---|---|
| `jpegQuality` | `number` | `80` | JPEG compression quality (0–100) |
| `pngQuality` | `number` | `80` | PNG compression quality (0–100) |
| `webpQuality` | `number` | `75` | WebP quality (0–100) |
| `avifQuality` | `number` | `50` | AVIF quality (0–100) |
| `webpEnable` | `boolean` | `true` | Enable WebP generation in pre-build |
| `avifEnable` | `boolean` | `true` | Enable AVIF generation in pre-build |
| `exclude` | `string[]` | `[]` | Glob patterns to exclude from all processing |
| `logListings` | `boolean` | `true` | Enable detailed per-file terminal output |

---

## Quality options

### `jpegQuality`

**Type:** `number` - **Default:** `80`

Controls the compression quality applied to `.jpg` and `.jpeg` files during the post-build phase. Uses [sharp's JPEG encoder](https://sharp.pixelplumbing.com/api-output#jpeg) with `mozjpeg: true` for improved compression at the same visual quality.

- `100` : near-lossless, largest file size
- `80` : good balance between quality and size (recommended)
- `60` and below : visible artifacts on most images

```js
imageOptimize({ jpegQuality: 75 })
```

---

### `pngQuality`

**Type:** `number` - **Default:** `80`

Controls the compression quality applied to `.png` files during the post-build phase. Uses sharp's PNG encoder with `compressionLevel: 9` (maximum zlib compression) in addition to quality-based quantization.

```js
imageOptimize({ pngQuality: 85 })
```

---

### `webpQuality`

**Type:** `number` - **Default:** `75`

Controls the quality used when:
- Generating `.webp` versions of JPEG/PNG files during pre-build
- Recompressing existing `.webp` files during post-build

WebP at 75 is visually comparable to JPEG at 85–90 for most images.

```js
imageOptimize({ webpQuality: 80 })
```

---

### `avifQuality`

**Type:** `number` - **Default:** `50`

Controls the quality used when:
- Generating `.avif` versions of JPEG/PNG files during pre-build
- Recompressing existing `.avif` files during post-build

AVIF uses a different quality scale than JPEG or WebP. Lower values produce smaller files with greater compression. `50` is a good starting point; values in the range of `40–60` are common in production.

```js
imageOptimize({ avifQuality: 45 })
```

---

## Format generation options

### `webpEnable`

**Type:** `boolean` - **Default:** `true`

When `true`, the pre-build phase generates a `.webp` version for every `.jpg`, `.jpeg`, and `.png` file found in `<publicDir>/img/`.

Set to `false` to skip WebP generation entirely:

```js
imageOptimize({ webpEnable: false })
```

> Setting both `webpEnable` and `avifEnable` to `false` disables the pre-build phase entirely.

---

### `avifEnable`

**Type:** `boolean` - **Default:** `true`

When `true`, the pre-build phase generates an `.avif` version for every `.jpg`, `.jpeg`, and `.png` file found in `<publicDir>/img/`.

Set to `false` to skip AVIF generation:

```js
imageOptimize({ avifEnable: false })
```

---

## Filtering options

### `exclude`

**Type:** `string[]` - **Default:** `[]`

An array of glob patterns. Any file matching one of these patterns is excluded from **both** the pre-build and post-build phases.

Patterns are passed to [globby](https://github.com/sindresorhus/globby) as `ignore` rules and are matched relative to the scanned directory.

```js
imageOptimize({
  exclude: [
    '**/og-*.png',        // exclude Open Graph images
    '**/icons/**',        // exclude an entire subdirectory
    '**/*-raw.*'          // exclude files with a specific suffix
  ]
})
```

---

## Logging options

### `logListings`

**Type:** `boolean` - **Default:** `true`

When `true`, the plugin prints a detailed per-file report for both build phases:

```bash
✅ Images optimized (4):
  logo.png - 98.2 KB → 41.5 KB (57.7% saved)
  banner.jpg - 1.1 MB → 620.8 KB (43.5% saved)
  banner.webp - 890.2 KB → 410.3 KB (53.9% saved)
  banner.avif - 650.1 KB → 280.5 KB (56.8% saved)
📦 Total: 2.8 MB → 1.4 MB (50.2% saved)
```

When `false`, only a summary line is printed:

```bash
✅ 4 images optimized in /dist/img
```

```js
imageOptimize({ logListings: false })
```
