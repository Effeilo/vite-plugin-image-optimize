# Introduction

## What is `vite-plugin-image-optimize`?

`vite-plugin-image-optimize` is a Vite plugin that handles image optimization automatically during production builds. It generates modern format alternatives (`.avif`, `.webp`) from your source JPEG and PNG files, then compresses all images in the build output to reduce file sizes.

It integrates directly into Vite's build pipeline via two hooks, requires no manual commands, and produces a measurable performance improvement on every build.

---

## Why this plugin?

Images are the largest assets on most web pages. Serving unoptimized images has a direct impact on:

- **Performance** : large images slow down initial page load, especially on mobile networks.
- **Core Web Vitals** : Largest Contentful Paint (LCP) is directly influenced by image weight.
- **Bandwidth** : users on metered connections pay for every byte transferred.

Modern image formats address this problem significantly:

| Format | Typical savings over JPEG |
|---|---|
| WebP | 25–35% smaller |
| AVIF | 40–60% smaller |

`vite-plugin-image-optimize` automates the generation and compression of these formats so you don't have to manage them manually.

---

## The two-phase approach

The plugin runs in two distinct phases during `vite build`:

### Phase 1 - Pre-build (format generation)

Before Vite processes your files, the plugin scans `/public/img` for JPEG and PNG images and generates `.webp` and/or `.avif` versions alongside each source file. Already up-to-date files are skipped.

### Phase 2 - Post-build (compression)

After Vite copies all assets to the output directory, the plugin compresses every image in `/dist/img` in-place using [sharp](https://sharp.pixelplumbing.com/) for raster formats and [svgo](https://svgo.dev/) for SVG. Processing is fully parallelized.

---

## Positioning

`vite-plugin-image-optimize` is focused and deliberate:

- It does not process images outside of `/public/img` and `/dist/img`
- It does not rename or relocate files
- It does not require a separate CLI step or manual command
- It only runs during production builds (`apply: 'build'`)

It does one thing: make your images smaller and available in modern formats, automatically, on every `vite build`.

---

## What `vite-plugin-image-optimize` does not do

- No responsive image resizing (multiple sizes, `srcset` generation)
- No lazy loading attributes
- No image CDN integration
- No CSS background image handling
- No processing of images imported directly in JavaScript/TypeScript
