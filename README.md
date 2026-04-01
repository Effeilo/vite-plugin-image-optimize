**EN** | [FR](./fr/README.md)

<div>
  <img src="https://browserux.com/img/logos/logo-browserux-image-optimize-300.png" alt="logo vite-plugin-image-optimize"/>
</div>

# BrowserUX Image Optimize

`vite-plugin-image-optimize` is a Vite plugin that automatically generates `.avif` and `.webp` versions of your images and optimizes all your JPG, PNG, SVG, WebP, and AVIF files to improve your site's performance.

[![npm version](https://img.shields.io/npm/v/vite-plugin-image-optimize.svg)](https://www.npmjs.com/package/vite-plugin-image-optimize)
![vite compatibility](https://img.shields.io/badge/Vite-4%2B%20%7C%205%2B%20%7C%206%2B%20%7C%207%2B-646CFF.svg?logo=vite&logoColor=white)

## Why this plugin?

This Vite plugin was created for BrowserUX Starter, a frontend starter using Vite, PWA, and Workbox. It automatically generates `.avif` and `.webp` files and compresses all images (JPG, PNG, SVG, WebP, AVIF) during production builds using [sharp](https://sharp.pixelplumbing.com/) — a fast, actively maintained image processing library.

The plugin runs in two phases:

- **Before build:** converts JPEG/PNG images to AVIF and/or WebP inside `/public/img`. Already up-to-date files are skipped.
- **After build:** compresses all images inside `/dist/img` in parallel to reduce output size.

## Features

- 🖼️ Generates `.avif` and `.webp` from `.jpg`/`.png` in `/public/img`
- 🚀 Optimizes images in `/dist/img` (JPG, PNG, SVG, WebP, AVIF)
- ⚡ Parallel processing with `Promise.all` for fast builds
- 🔁 Skips pre-build generation when output is already up to date
- 🔍 Supports glob-based file exclusion
- 🔧 Configurable: AVIF/WebP/PNG/JPEG quality settings
- 📦 Optionally logs detailed per-file compression stats
- 🛠️ Powered by [sharp](https://sharp.pixelplumbing.com/) and [svgo](https://svgo.dev/)

## Installation

```bash
npm install vite-plugin-image-optimize --save-dev
```

## Usage

In your `vite.config.ts`:

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

## Recommended HTML usage

Serve AVIF with WebP and JPEG as fallbacks using `<picture>`:

```html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="...">
</picture>
```

The browser picks the first format it supports. AVIF gives the best compression; JPEG is the universal fallback.

## Example output

In your terminal during `vite build`:

```bash
----------------------------------------
🖼️  Image Optimize (Pre-build)
----------------------------------------
✅ Modern formats generated (6):
  banner.jpg → banner.webp
  banner.jpg → banner.avif
  logo.png → logo.webp
  logo.png → logo.avif

----------------------------------------
🖼️  Image Optimize (Post-build)
----------------------------------------
✅ Images optimized (8):
  logo.png — 120.4 KB → 52.1 KB (56.7% saved)
  banner.jpg — 1.1 MB → 620.8 KB (43.5% saved)
  banner.webp — 890.2 KB → 410.3 KB (53.9% saved)
  banner.avif — 650.1 KB → 280.5 KB (56.8% saved)
📦 Total: 2.8 MB → 1.4 MB (50.2% saved)
```

## Options

| Option         | Type       | Default | Description                                                             |
| -------------- | ---------- | ------- | ----------------------------------------------------------------------- |
| `jpegQuality`  | `number`   | `80`    | JPEG compression quality (0–100)                                        |
| `pngQuality`   | `number`   | `80`    | PNG compression quality (0–100)                                         |
| `webpQuality`  | `number`   | `75`    | WebP conversion/compression quality (0–100)                             |
| `avifQuality`  | `number`   | `50`    | AVIF conversion/compression quality (0–100, lower = smaller file)       |
| `webpEnable`   | `boolean`  | `true`  | Enable WebP generation during pre-build                                 |
| `avifEnable`   | `boolean`  | `true`  | Enable AVIF generation during pre-build                                 |
| `exclude`      | `string[]` | `[]`    | Glob patterns to exclude from all processing (e.g. `['**/ignore/**']`)  |
| `logListings`  | `boolean`  | `true`  | Enable detailed per-file logging in the terminal                        |

## Migrating from v1

| v1 option      | v2 equivalent  | Notes                                     |
| -------------- | -------------- | ----------------------------------------- |
| `pngQuality`   | `pngQuality`   | Type changed: `[number, number]` → `number` (0–100) |
| `webpFormats`  | *(removed)*    | Plugin always targets `.jpg`/`.jpeg`/`.png` |
| `webpExclude`  | `exclude`      | Now applies to all processing phases      |

## Repository structure

```bash
├── dist/
├── src/
│   ├── index.ts
│   ├── types.ts
│   ├── utils.ts
│   └── types/
│       └── shims.d.ts
├── tsconfig.json
├── package.json
├── README.md
```

## How it works (in short)

- Before the build: converts PNG/JPEG to AVIF and WebP in `public/img` (skips up-to-date files)
- After the build: optimizes all images in `dist/img` in parallel
- Optionally prints a summary of saved file sizes

## License

MIT © 2025 [Effeilo](https://github.com/Effeilo)
