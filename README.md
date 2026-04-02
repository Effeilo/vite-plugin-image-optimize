**EN** | [FR](./fr/README.md)

<div>
  <img src="https://browserux.com/img/logos/logo-browserux-image-optimize-300.png" alt="logo vite-plugin-image-optimize"/>
</div>

# BrowserUX Image Optimize

`vite-plugin-image-optimize` is a Vite plugin that automatically generates `.avif` and `.webp` versions of your images and optimizes all your JPG, PNG, SVG, WebP, and AVIF files during production builds.

[![npm version](https://img.shields.io/npm/v/vite-plugin-image-optimize.svg)](https://www.npmjs.com/package/vite-plugin-image-optimize)
![vite compatibility](https://img.shields.io/badge/Vite-4%2B%20%7C%205%2B%20%7C%206%2B%20%7C%207%2B-646CFF.svg?logo=vite&logoColor=white)

## Features

- 🖼️ Generates `.avif` and `.webp` from `.jpg`/`.png` in `/public/img`
- 🚀 Optimizes images in `/dist/img` (JPG, PNG, SVG, WebP, AVIF)
- ⚡ Parallel processing with `Promise.all` for fast builds
- 🔁 Skips pre-build generation when output is already up to date
- 🔍 Supports glob-based file exclusion
- 🔧 Configurable quality settings per format
- 📦 Optionally logs detailed per-file compression stats
- 🛠️ Powered by [sharp](https://sharp.pixelplumbing.com/) and [svgo](https://svgo.dev/)

## Installation

```bash
npm install vite-plugin-image-optimize --save-dev
```

## Usage

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
      exclude: [],
      logListings: true
    })
  ]
})
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `jpegQuality` | `number` | `80` | JPEG compression quality (0-100) |
| `pngQuality` | `number` | `80` | PNG compression quality (0-100) |
| `webpQuality` | `number` | `75` | WebP conversion/compression quality (0-100) |
| `avifQuality` | `number` | `50` | AVIF conversion/compression quality (0-100) |
| `webpEnable` | `boolean` | `true` | Enable WebP generation during pre-build |
| `avifEnable` | `boolean` | `true` | Enable AVIF generation during pre-build |
| `exclude` | `string[]` | `[]` | Glob patterns to exclude from all processing |
| `logListings` | `boolean` | `true` | Enable detailed per-file logging in the terminal |

## Migrating from v1

| v1 option | v2 equivalent | Notes |
| --- | --- | --- |
| `pngQuality` | `pngQuality` | Type changed: `[number, number]` → `number` (0-100) |
| `webpFormats` | *(removed)* | Plugin always targets `.jpg`/`.jpeg`/`.png` |
| `webpExclude` | `exclude` | Now applies to all processing phases |

## Documentation

For detailed documentation, see [docs/index.md](docs/index.md).

## License

MIT © 2025 [Effeilo](https://github.com/Effeilo)
