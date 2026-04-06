import path from 'path'
import fs from 'fs/promises'
import sharp from 'sharp'
import { optimize as svgoOptimize } from 'svgo'
import type { Plugin, ResolvedConfig } from 'vite'
import { getAllImages, fileIsNewer, formatSize } from './utils.js'
import type { ImageOptimizeOptions } from './types.js'

/**
 * Vite plugin to optimize image assets during build.
 *
 * - In the `buildStart` hook, generates `.avif` and/or `.webp` versions of
 *   JPEG/PNG images found in the configured public img directory.
 *   Files are skipped if the output already exists and is newer than the source.
 * - In the `closeBundle` hook, compresses all images in the output img directory
 *   in-place using sharp (JPEG, PNG, WebP, AVIF) and svgo (SVG).
 * - Processing is parallelized with Promise.all for faster builds.
 *
 * @param {ImageOptimizeOptions} options - Configuration options for image processing
 * @returns {Plugin} Vite-compatible plugin object
 */
export default function imageOptimizePlugin(options: ImageOptimizeOptions = {}): Plugin {
  const {
    jpegQuality = 80,
    pngQuality = 80,
    webpQuality = 75,
    avifQuality = 50,
    webpEnable = true,
    avifEnable = true,
    exclude = [],
    logListings = true,
  } = options

  let publicImgDir = ''
  let distImgDir = ''

  return {
    name: 'image-optimize',
    apply: 'build',

    configResolved(config: ResolvedConfig) {
      publicImgDir = path.join(config.publicDir, 'img')
      distImgDir = path.resolve(config.root, config.build.outDir, 'img')
    },

    /**
     * Pre-build: generate AVIF and/or WebP from JPEG/PNG sources in public/img.
     * Skips files whose output already exists and is up to date.
     */
    async buildStart() {
      if (!webpEnable && !avifEnable) return

      try {
        await fs.access(publicImgDir)
      } catch {
        return
      }

      const sources = await getAllImages(publicImgDir, ['.jpg', '.jpeg', '.png'], exclude)
      if (sources.length === 0) return

      const results = await Promise.all(
        sources.map(async (src) => {
          const base = src.replace(/\.(jpe?g|png)$/i, '')
          const generated: string[] = []

          if (webpEnable) {
            const dest = `${base}.webp`
            if (await fileIsNewer(src, dest)) {
              await sharp(src).webp({ quality: webpQuality }).toFile(dest)
            }
            generated.push(path.basename(dest))
          }

          if (avifEnable) {
            const dest = `${base}.avif`
            if (await fileIsNewer(src, dest)) {
              await sharp(src).avif({ quality: avifQuality }).toFile(dest)
            }
            generated.push(path.basename(dest))
          }

          return { src, generated }
        })
      )

      console.log(`\n----------------------------------------`)
      console.log(`🖼️  Image Optimize (Pre-build)`)
      console.log(`----------------------------------------`)

      if (logListings) {
        const entries = results.flatMap(({ src, generated }) =>
          generated.map(
            (name) => `  ${path.relative(publicImgDir, src).replace(/\\/g, '/')} → ${name}`
          )
        )
        console.log(`✅ Modern formats generated (${entries.length}):`)
        for (const entry of entries) console.log(entry)
      } else {
        const count = results.reduce((n, r) => n + r.generated.length, 0)
        console.log(`✅ ${count} modern format files generated in /${path.relative(process.cwd(), publicImgDir).replace(/\\/g, '/')}`)
      }

      console.log('')
    },

    /**
     * Post-build: compress all images in dist/img in-place.
     * JPEG/PNG/WebP/AVIF via sharp, SVG via svgo.
     */
    async closeBundle() {
      try {
        await fs.access(distImgDir)
      } catch {
        return
      }

      const files = await getAllImages(
        distImgDir,
        ['.jpg', '.jpeg', '.png', '.svg', '.webp', '.avif'],
        exclude
      )
      if (files.length === 0) return

      console.log(`\n----------------------------------------`)
      console.log(`🖼️  Image Optimize (Post-build)`)
      console.log(`----------------------------------------`)

      const results = await Promise.all(
        files.map(async (file) => {
          const ext = path.extname(file).toLowerCase()
          const original = await fs.readFile(file)
          const sizeBefore = original.length
          let optimized: Buffer

          if (ext === '.jpg' || ext === '.jpeg') {
            optimized = await sharp(original).jpeg({ quality: jpegQuality, mozjpeg: true }).toBuffer()
          } else if (ext === '.png') {
            optimized = await sharp(original).png({ quality: pngQuality, compressionLevel: 9 }).toBuffer()
          } else if (ext === '.webp') {
            optimized = await sharp(original).webp({ quality: webpQuality }).toBuffer()
          } else if (ext === '.avif') {
            optimized = await sharp(original).avif({ quality: avifQuality }).toBuffer()
          } else if (ext === '.svg') {
            const svgContent = await fs.readFile(file, 'utf-8')
            const result = svgoOptimize(svgContent, { multipass: true })
            optimized = Buffer.from(result.data)
          } else {
            return { file, sizeBefore, sizeAfter: sizeBefore }
          }

          await fs.writeFile(file, optimized)
          return { file, sizeBefore, sizeAfter: optimized.length }
        })
      )

      let totalBefore = 0
      let totalAfter = 0
      for (const { sizeBefore, sizeAfter } of results) {
        totalBefore += sizeBefore
        totalAfter += sizeAfter
      }

      if (logListings) {
        console.log(`✅ Images optimized (${results.length}):`)
        for (const { file, sizeBefore, sizeAfter } of results) {
          const percent = sizeBefore > 0
            ? ((1 - sizeAfter / sizeBefore) * 100).toFixed(1)
            : '0.0'
          console.log(
            `  ${path.relative(distImgDir, file).replace(/\\/g, '/')}, ${formatSize(sizeBefore)} → ${formatSize(sizeAfter)} (${percent}% saved)`
          )
        }
        if (totalBefore > 0) {
          const totalPercent = ((1 - totalAfter / totalBefore) * 100).toFixed(1)
          console.log(`📦 Total: ${formatSize(totalBefore)} → ${formatSize(totalAfter)} (${totalPercent}% saved)`)
        }
      } else {
        console.log(`✅ ${results.length} images optimized in /${path.relative(process.cwd(), distImgDir).replace(/\\/g, '/')}\n`)
      }
    },
  }
}
