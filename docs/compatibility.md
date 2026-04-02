# Compatibility

---

## Runtime requirements

| Dependency | Minimum version | Reason |
|---|---|---|
| Node.js | 18.17.0 | Required by [sharp](https://sharp.pixelplumbing.com/install#nodejs-versions) |
| Vite | 4+ | Plugin API compatibility (`configResolved`, `buildStart`, `closeBundle`) |

---

## Vite version compatibility

| Vite version | Status |
|---|---|
| Vite 4 | Supported |
| Vite 5 | Supported |
| Vite 6 | Supported |
| Vite 7 | Supported |

The plugin uses standard Rollup hook APIs (`buildStart`, `closeBundle`, `configResolved`) that are stable across all listed Vite versions.

---

## Operating system notes

### Windows

On Windows, `sharp(filePath)` can keep a native file handle open after processing, causing an `UNKNOWN` error when Node.js tries to write to the same file. This plugin uses `sharp(buffer)` in the post-build phase to avoid this issue entirely.

### macOS and Linux

No known compatibility issues. The plugin is tested on both platforms.

---

## Image format browser support

The plugin generates `.avif` and `.webp` files. These formats require browser support to be used. Always include a JPEG or PNG fallback in your HTML using the `<picture>` element.

See [HTML usage](guide/html-usage.md) for implementation details.

| Format | Chrome | Firefox | Safari | Edge |
|---|---|---|---|---|
| WebP | 32+ | 65+ | 14+ | 18+ |
| AVIF | 85+ | 93+ | 16.1+ | 121+ |

---

## Dependencies

| Package | Role | Version |
|---|---|---|
| [sharp](https://sharp.pixelplumbing.com/) | JPEG, PNG, WebP, AVIF processing | ^0.34 |
| [svgo](https://svgo.dev/) | SVG optimization | ^3 |
| [globby](https://github.com/sindresorhus/globby) | File system scanning with glob patterns | ^13 |

---

## Notes

### `sharp` on Windows

`sharp` bundles a prebuilt native binary for each platform. On Windows, the binary is downloaded automatically during `npm install`. If the installation fails, refer to the [sharp installation guide](https://sharp.pixelplumbing.com/install).

### `sharp` and Node.js versions

`sharp` requires Node.js 18.17.0 or higher starting from version 0.33. Using an older Node.js version will cause the installation to fail with a native module error.
