**EN** | [FR](./fr/README.md)

<div>
  <img src="https://browserux.com/img/logos/logo-browserux-image-optimize-300.png" alt="logo vite-plugin-image-optimize"/>
</div>

# BrowserUX Image Optimize

`vite-plugin-image-optimize` is a Vite plugin that automatically generates `.webp` versions of your images and optimizes all your JPG, PNG, SVG, and WebP files to improve your site's performance.

[![npm version](https://img.shields.io/npm/v/vite-plugin-image-optimize.svg)](https://www.npmjs.com/package/vite-plugin-image-optimize)
![vite compatibility](https://img.shields.io/badge/Vite-4%2B%20%7C%205%2B%20%7C%206%2B%20%7C%207%2B-646CFF.svg?logo=vite&logoColor=white)

## Why this plugin?

This Vite plugin was created for BrowserUX Starter, a frontend starter using Vite, PWA, and Workbox. It automatically generates `.webp` files and optimizes all images (JPG, PNG, SVG, WebP) to improve performance in production.

The plugin runs in two phases:

- Before build: converts JPEG and PNG images to WebP inside `/public/img`
- After build: compresses all images inside `/dist/img` to reduce output size

## Features

- 🖼️ Automatically generates `.webp` versions from `.jpg`/`.png` images in `/public/img`
- 🚀 Optimizes images in `/dist/img` (JPG, PNG, SVG, WebP)
- 🔍 Supports glob-based file exclusion
- 🔧 Configurable: WebP/PNG/JPEG quality, file formats, and more
- 📦 Optionally logs detailed compression stats

## Installation

```bash
npm install vite-plugin-image-optimize --save-dev
```

## Usage

In the `vite.config.ts` file:

```js
import { defineConfig } from 'vite'
import imageOptimize from 'vite-plugin-image-optimize'

export default defineConfig({
  plugins: [
    imageOptimize({
      jpegQuality: 80,
      pngQuality: [0.6, 0.8],
      webpQuality: 75,
      webpEnable: true,
      webpFormats: ['jpeg', 'png'],
      webpExclude: ['**/logo.svg'],
      logListings: true
    })
  ]
})
```

## Example output

In your terminal during `build`:

```bash
----------------------------------------
🖼️  BrowserUX Image Optimize (Pre-build)           
----------------------------------------
✅ WebP generated (3):
- logo.png → logo.webp
- banner.jpg → banner.webp
- icons/menu.png → icons/menu.webp

----------------------------------------
🖼️  BrowserUX Image Optimize (Post-build)           
----------------------------------------
✅ Images optimized (6):
- logo.png - 120.4 KB → 52.1 KB (56.7% saved)
- banner.jpg - 1.1 MB → 620.8 KB (43.5% saved)
📦 Total: 1.4 MB → 690.2 KB (50.4% saved)
```
## Options

| Option        | Type                  | Default           | Description                                                        |
| ------------- | --------------------- | ----------------- | ------------------------------------------------------------------ |
| `jpegQuality` | `number`              | `80`              | JPEG compression quality (0–100)                                   |
| `pngQuality`  | `[number, number]`    | `[0.6, 0.8]`      | PNG compression quality range (between 0 and 1)                    |
| `webpQuality` | `number`              | `75`              | WebP conversion quality (0–100)                                    |
| `webpEnable`  | `boolean`             | `true`            | Enables or disables WebP file generation before build              |
| `webpFormats` | `('jpeg' \| 'png')[]` | `['jpeg', 'png']` | File extensions to convert to WebP                                 |
| `webpExclude` | `string[]`            | `[]`              | Glob patterns to exclude (e.g. `['**/ignore/**']`)                 |
| `logListings` | `boolean`             | `true`            | Enables detailed per-file logging in the terminal                  |

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

- Before the build: converts PNG/JPEG images to WebP inside `public/img`
- After the build: optimizes all images in `dist/img`
- Optionally prints a summary of saved file sizes

## License

MIT © 2025 [Effeilo](https://github.com/Effeilo)