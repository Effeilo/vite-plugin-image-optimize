# HTML usage

Once the plugin has generated `.avif` and `.webp` versions of your images, you need to reference them correctly in HTML so that each browser receives the most efficient format it supports.

---

## The `<picture>` element

The standard way to serve multiple image formats with a fallback is the `<picture>` element:

```html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description of the image">
</picture>
```

The browser evaluates `<source>` elements in order and picks the first format it supports. The `<img>` element serves as the universal fallback.

> Always include the `alt` attribute on the `<img>` element. It is required for accessibility.

---

## Format priority

| Priority | Format | Reason |
|---|---|---|
| 1st | AVIF | Best compression, modern browsers |
| 2nd | WebP | Good compression, wide support |
| 3rd | JPEG/PNG | Universal fallback |

AVIF typically produces files 40–60% smaller than JPEG at equivalent quality. WebP produces files 25–35% smaller. Serving AVIF first maximizes performance for users on modern browsers, while older browsers fall back gracefully.

---

## With responsive images

Combine `<picture>` with `srcset` and `sizes` for responsive layouts:

```html
<picture>
  <source
    srcset="image-400.avif 400w, image-800.avif 800w"
    sizes="(max-width: 600px) 400px, 800px"
    type="image/avif"
  >
  <source
    srcset="image-400.webp 400w, image-800.webp 800w"
    sizes="(max-width: 600px) 400px, 800px"
    type="image/webp"
  >
  <img
    src="image-800.jpg"
    srcset="image-400.jpg 400w, image-800.jpg 800w"
    sizes="(max-width: 600px) 400px, 800px"
    alt="Description of the image"
    width="800"
    height="600"
  >
</picture>
```

> `vite-plugin-image-optimize` does not generate multiple sizes of the same image. Responsive `srcset` variants must be created separately if needed.

---

## With lazy loading

Add `loading="lazy"` to defer off-screen images:

```html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="..." loading="lazy" width="800" height="600">
</picture>
```

> Always specify `width` and `height` attributes on `<img>` to prevent layout shifts (CLS).

---

## Above-the-fold images

For images visible on initial load (hero images, logos), use `loading="eager"` and consider adding a `fetchpriority="high"` hint:

```html
<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img
    src="hero.jpg"
    alt="..."
    loading="eager"
    fetchpriority="high"
    width="1200"
    height="600"
  >
</picture>
```

---

## Browser support for image formats

| Format | Chrome | Firefox | Safari | Edge |
|---|---|---|---|---|
| WebP | 32+ | 65+ | 14+ | 18+ |
| AVIF | 85+ | 93+ | 16.1+ | 121+ |
| JPEG | All | All | All | All |
| PNG | All | All | All | All |
| SVG | All | All | All | All |

AVIF has good coverage in 2024+ browsers. For maximum compatibility, always include a JPEG or PNG fallback in your `<picture>` element.
