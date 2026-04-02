# How it works

`vite-plugin-image-optimize` hooks into Vite's build lifecycle at two points. Understanding how each phase works helps you configure the plugin correctly and anticipate its behavior.

---

## Build lifecycle overview

```
vite build
│
├── configResolved     → resolve public/img and dist/img paths
├── buildStart         → Phase 1: generate WebP/AVIF in public/img
│
│   [Vite processes modules, emits assets, copies public/ to dist/]
│
└── closeBundle        → Phase 2: compress all images in dist/img
```

---

## Phase 1 - Pre-build format generation

**Hook:** `buildStart`

The plugin scans `<publicDir>/img/` for `.jpg`, `.jpeg`, and `.png` files. For each source file, it generates `.webp` and/or `.avif` versions in the same directory using [sharp](https://sharp.pixelplumbing.com/).

### Incremental generation

A file is only regenerated if the source is newer than the existing output. This check uses `fs.stat` to compare modification timestamps:

- If the `.webp` or `.avif` file already exists and is up to date → skipped
- If the output does not exist, or is older than the source → regenerated

This means repeated builds are fast: no re-encoding on unchanged images.

### Parallelization

All conversions run simultaneously using `Promise.all`. On a project with many images, this significantly reduces pre-build time compared to sequential processing.

---

## Phase 2 - Post-build compression

**Hook:** `closeBundle`

After Vite has copied all assets to `<outDir>/img/`, the plugin reads every image in that directory (`.jpg`, `.jpeg`, `.png`, `.svg`, `.webp`, `.avif`) and compresses it in-place.

### Per-format strategy

| Format | Library | Settings |
|---|---|---|
| JPEG | sharp | `mozjpeg: true`, configurable quality |
| PNG | sharp | `compressionLevel: 9`, configurable quality |
| WebP | sharp | configurable quality |
| AVIF | sharp | configurable quality |
| SVG | svgo | `multipass: true` |

### Buffer-based processing

To avoid file locking issues on Windows, images are loaded into memory with `fs.readFile` first. The buffer is passed to `sharp(buffer)` instead of `sharp(filePath)`, so sharp never holds a file handle open when `fs.writeFile` writes the result back.

### Parallelization

All compressions also run with `Promise.all`. The plugin logs a per-file report and a total savings summary when `logListings` is enabled.

---

## Exclusions

The `exclude` option accepts glob patterns applied to both phases. Files matching any pattern are skipped entirely:

```js
imageOptimize({
  exclude: ['**/og-*.png', '**/icons/**']
})
```

Patterns are passed to [globby](https://github.com/sindresorhus/globby) as `ignore` rules.

---

## Build-only behavior

The plugin declares `apply: 'build'`. Its hooks are never registered during `vite dev` or `vite preview`. Running the dev server does not generate or compress any images.

---

## Path resolution

Directory paths are resolved in the `configResolved` hook from Vite's resolved configuration:

```
publicImgDir = path.join(config.publicDir, 'img')
distImgDir   = path.resolve(config.root, config.build.outDir, 'img')
```

This means the plugin respects any custom `publicDir` or `build.outDir` values defined in your Vite config, without requiring any additional configuration.
