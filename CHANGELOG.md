**EN** | [FR](./fr/CHANGELOG.md)

<div>
  <img src="https://browserux.com/img/logos/logo-browserux-image-optimize-300.png" alt="logo vite-plugin-image-optimize"/>
</div>

# 📦 Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com)  
and this project adheres to [Semantic Versioning](https://semver.org).

---

<br>

## [2.0.1] – 2026-04-02

### 🐛 Fixed

- **Windows file locking error in post-build phase:** `sharp(file)` kept a native file handle open on Windows, causing an `UNKNOWN` error when `fs.writeFile` tried to open the same file for writing. Fixed by passing the already-loaded buffer (`sharp(original)`) instead of the file path, so sharp never holds a lock on the output file.

<br>

---

<br>

## [2.0.0] – 2026-03-29

### ⚠️ Breaking Changes

- **Engine replaced:** `imagemin` and all its plugins (`imagemin-mozjpeg`, `imagemin-pngquant`, `imagemin-svgo`, `imagemin-webp`) have been removed in favor of [`sharp`](https://sharp.pixelplumbing.com/) and [`svgo`](https://svgo.dev/). Requires Node.js ≥ 18.17.0.
- **`pngQuality` type changed:** was `[number, number]` (pngquant min/max), now a single `number` (0–100), consistent with sharp's API.
- **`webpFormats` option removed:** the plugin always targets `.jpg`, `.jpeg`, and `.png` for modern format generation.
- **`webpExclude` renamed to `exclude`:** now applies uniformly to both the pre-build and post-build phases.

### ✨ Added

- **AVIF generation:** new `avifEnable` (default: `true`) and `avifQuality` (default: `50`) options. The plugin now generates both `.avif` and `.webp` from each source JPEG/PNG.
- **Incremental pre-build:** output files (`.avif`, `.webp`) are skipped if they already exist and are newer than their source image — no more redundant re-encoding on repeated builds.
- **Parallel processing:** pre-build generation and post-build compression are now both fully parallelized with `Promise.all` for faster builds on large image sets.
- **Accurate path resolution:** a `configResolved` hook now reads `config.publicDir` and `config.build.outDir` from Vite, instead of relying on hardcoded `public/img` and `dist/img` paths relative to `process.cwd()`.
- **Build-only:** `apply: 'build'` ensures the plugin hooks never register in Vite's dev server.
- **AVIF/WebP compression in post-build:** the `closeBundle` phase now also compresses `.avif` files in `dist/img`.
- **Test suite:** integration and unit tests powered by [Vitest](https://vitest.dev/). Run with `npm test`.
- **NodeNext module resolution:** `tsconfig.json` now uses `moduleResolution: "NodeNext"`, removing the need for the post-build `fix-extensions.js` script.

### 🐛 Fixed

- `.jpg` files were never converted to WebP due to an extension mismatch (`.jpg` vs `jpg`) in the default `webpFormats` config.
- Generated `.webp` files written into `public/img/` were re-compressed on every build, causing cumulative lossy degradation.
- `closeBundle` could run in dev/watch mode if `dist/img` existed, potentially corrupting source assets.
- Division by zero when computing total savings with no images found.
- Plugin name used the `vite:` prefix, which is reserved for Vite's internal plugins. Now named `image-optimize`.

### 🔄 Changed

- `build` script simplified to `"tsc"` — `scripts/fix-extensions.js` is no longer needed.
- Minimum Node.js version bumped to `18.17.0` (required by sharp).

<br>

---

<br>

## [1.0.0] – 2025-07-21

### ✨ Added

- Initial release of `vite-plugin-image-optimize`
- Automatic `.webp` generation from `.jpg` and `.png` files inside `public/img`
- Post-build optimization of all image files in `dist/img` (`.jpg`, `.png`, `.svg`, `.webp`)
- Configurable options:
  - JPEG / PNG / WebP compression quality
  - Enable or disable WebP generation
  - Limit WebP to specific extensions (`.png`, `.jpg`, etc.)
  - Exclude files using glob patterns
  - Verbose logging for processed files and size savings

<br>

---