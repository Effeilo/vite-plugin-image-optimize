# Documentation `vite-plugin-image-optimize`

## The project

Every production build ships images. But raw images are heavy: unoptimized PNGs, JPEGs with no compression, no modern format alternatives. The result is slower page loads, wasted bandwidth, and a poor user experience - especially on mobile.

`vite-plugin-image-optimize` solves this automatically. It generates `.avif` and `.webp` versions of your source images before the build, then compresses every image in your output directory after the build - in parallel, with no manual intervention required.

One plugin. Two phases. No configuration required to get started.

---

## Table of contents

### Guide

- [Introduction](guide/introduction.md) : what it is, why it exists, the two-phase approach
- [Getting started](guide/getting-started.md) : installation and configuration in `vite.config`
- [How it works](guide/how-it-works.md) : pre-build generation, post-build compression, incremental builds
- [HTML usage](guide/html-usage.md) : serving AVIF/WebP with fallback using `<picture>`

### Reference

- [Options](reference/options.md) : complete options table with details and defaults
- [Hooks](reference/hooks.md) : `configResolved`, `buildStart`, `closeBundle`
- [Utilities](reference/utils.md) : `getAllImages`, `fileIsNewer`, `formatSize`

### Additional reference

- [Compatibility](compatibility.md) : Node.js, Vite versions, image format browser support
- [Contributing](contributing.md) : report a bug, suggest an improvement, submit a PR
