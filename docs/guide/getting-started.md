# Getting started

`vite-plugin-image-optimize` integrates into any Vite project in two steps: install the package, add the plugin to your config.

---

## Requirements

| Dependency | Minimum version |
|---|---|
| Node.js | 18.17.0 |
| Vite | 4+ |

---

## Installation

```bash
npm install vite-plugin-image-optimize --save-dev
```

---

## Configuration

Add the plugin to your `vite.config.ts` (or `vite.config.js`):

```js
import { defineConfig } from 'vite'
import imageOptimize from 'vite-plugin-image-optimize'

export default defineConfig({
  plugins: [
    imageOptimize()
  ]
})
```

That's it. The plugin runs automatically on every `vite build` with default settings.

---

## Configuration with options

All options are optional. Override only what you need:

```js
import { defineConfig } from 'vite'
import imageOptimize from 'vite-plugin-image-optimize'

export default defineConfig({
  plugins: [
    imageOptimize({
      jpegQuality: 80,
      pngQuality: 80,
      webpQuality: 75,
      avifQuality: 50,
      webpEnable: true,
      avifEnable: true,
      exclude: ['**/og-*.png'],
      logListings: true
    })
  ]
})
```

For the full list of options, see the [Options reference](../reference/options.md).

---

## Expected directory structure

The plugin scans two directories:

| Phase | Directory | Description |
|---|---|---|
| Pre-build | `<publicDir>/img/` | Source images - JPEG/PNG are converted to WebP/AVIF here |
| Post-build | `<outDir>/img/` | Build output - all images are compressed in-place here |

These paths are resolved from Vite's `config.publicDir` and `config.build.outDir`, not hardcoded. They adapt automatically if you configure custom values in your Vite config.

> If `/public/img/` does not exist, the pre-build phase is silently skipped. If `/dist/img/` does not exist after the build, the post-build phase is also skipped.

---

## Verifying the output

During `vite build`, the plugin prints two sections in the terminal:

```bash
----------------------------------------
🖼️  Image Optimize (Pre-build)
----------------------------------------
✅ Modern formats generated (4):
  logo.png → logo.webp
  logo.png → logo.avif
  banner.jpg → banner.webp
  banner.jpg → banner.avif

----------------------------------------
🖼️  Image Optimize (Post-build)
----------------------------------------
✅ Images optimized (6):
  logo.png - 98.2 KB → 41.5 KB (57.7% saved)
  logo.webp - 62.1 KB → 28.3 KB (54.4% saved)
  logo.avif - 44.8 KB → 20.1 KB (55.1% saved)
  banner.jpg - 1.1 MB → 620.8 KB (43.5% saved)
  banner.webp - 890.2 KB → 410.3 KB (53.9% saved)
  banner.avif - 650.1 KB → 280.5 KB (56.8% saved)
📦 Total: 2.8 MB → 1.4 MB (50.2% saved)
```

To reduce terminal noise, set `logListings: false` to show only the summary line.
