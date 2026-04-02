# Utilities

`vite-plugin-image-optimize` exposes three internal utility functions in `src/utils.ts`. They are used by the plugin hooks but are not part of the public API.

---

## `getAllImages`

```ts
function getAllImages(
  root: string,
  exts: string[],
  exclude: string[] = []
): Promise<string[]>
```

Recursively collects all image files matching the provided extensions in a given directory, while respecting exclusion patterns.

### Parameters

| Parameter | Type | Description |
|---|---|---|
| `root` | `string` | Root directory to scan |
| `exts` | `string[]` | File extensions to include (e.g. `['.jpg', '.png']`) |
| `exclude` | `string[]` | Optional glob patterns to exclude (default: `[]`) |

### Returns

A promise resolving to an array of absolute file paths.

### How it works

Internally uses [globby](https://github.com/sindresorhus/globby) with `absolute: true` and the `ignore` option set to the `exclude` array. Extensions are normalized by stripping the leading dot before building the glob pattern:

```ts
const patterns = [`**/*.{${exts.map(e => e.replace('.', '')).join(',')}}`]
```

### Example

```ts
const images = await getAllImages('/public/img', ['.jpg', '.png'], ['**/og-*.png'])
// → ['/public/img/logo.png', '/public/img/banner.jpg']
```

---

## `fileIsNewer`

```ts
function fileIsNewer(src: string, dest: string): Promise<boolean>
```

Returns `true` if the source file is newer than the destination file, or if the destination file does not exist. Used to skip regenerating up-to-date WebP and AVIF files.

### Parameters

| Parameter | Type | Description |
|---|---|---|
| `src` | `string` | Path to the source file |
| `dest` | `string` | Path to the output file |

### Returns

A promise resolving to a boolean.

### How it works

Compares `mtimeMs` (last modified timestamp in milliseconds) of both files using `fs.stat`. If the destination does not exist, `fs.stat` throws and the function returns `true` (the file needs to be generated).

```ts
const [srcStat, destStat] = await Promise.all([fs.stat(src), fs.stat(dest)])
return srcStat.mtimeMs > destStat.mtimeMs
```

### Example

```ts
const needsUpdate = await fileIsNewer('/public/img/logo.png', '/public/img/logo.webp')
// → true if logo.png was modified after logo.webp was created
// → true if logo.webp does not exist yet
// → false if logo.webp is already up to date
```

---

## `formatSize`

```ts
function formatSize(bytes: number): string
```

Converts a file size in bytes to a human-readable string in kilobytes.

### Parameters

| Parameter | Type | Description |
|---|---|---|
| `bytes` | `number` | Size in bytes |

### Returns

A string formatted as `"X.X KB"` (one decimal place).

### Example

```ts
formatSize(45056)  // → "44.0 KB"
formatSize(1150976) // → "1124.0 KB"
```

> This function is used in the terminal output to display file sizes before and after compression.
