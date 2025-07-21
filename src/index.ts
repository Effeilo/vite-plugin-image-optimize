import path from 'path'
import fs from 'fs/promises'
import { Plugin } from 'vite'
import imagemin from 'imagemin'
import imageminMozjpeg from 'imagemin-mozjpeg'
import imageminPngquant from 'imagemin-pngquant'
import imageminSvgo from 'imagemin-svgo'
import imageminWebp from 'imagemin-webp'
import { getAllImages, formatSize } from './utils'
import { ImageOptimizeOptions } from './types'

/**
 * Vite plugin to optimize image assets during build.
 * 
 * - In the `buildStart` hook, generates `.webp` images from JPEG/PNG files in `/public/img`
 * - In the `closeBundle` hook, compresses images in `/dist/img` in-place
 * - Supports configurable quality settings, exclusions, and logging
 * 
 * @param {ImageOptimizeOptions} options - Configuration options for image processing
 * @returns {Plugin} Vite-compatible plugin object
 */

export default function imageOptimizePlugin(options: ImageOptimizeOptions = {}): Plugin {
  const {
    jpegQuality = 80,
    pngQuality = [0.6, 0.8],
    webpQuality = 75,
    webpEnable = true,
    webpFormats = ['.jpg', 'jpeg', 'png', 'svg'],
    webpExclude = [],
    logListings = true,
  } = options

  // Supported extensions for WebP conversion, normalized to lowercase
  const supportedWebp = webpFormats.map(f => f.toLowerCase())

  return {
    name: 'vite:image-optimize-ts',

    /**
     * Hook that runs before the build starts.
     * Converts qualifying images in `public/img` to `.webp`.
     */

    async buildStart() {

      // If WebP generation is disabled via options, skip this step entire
      if (!webpEnable) return

      // Resolve the absolute path to the /public/img directory
      const publicImgDir = path.resolve('public/img')

      // List of original image files to convert to WebP
      const files = await getAllImages(publicImgDir, ['.jpg', '.jpeg', '.png'], webpExclude)

      // Loop through each image file to convert it to WebP
      for (const file of files) {
        // Extract the file extension in lowercase (without the dot)
        const ext = path.extname(file).toLowerCase().slice(1)

        // Skip file if its extension is not among supported WebP formats
        if (!supportedWebp.includes(ext)) continue

        // Read the image file into a buffer
        const buffer = await fs.readFile(file)

        // Compress the buffer using imagemin with WebP plugin
        const webpBuffer = await imagemin.buffer(buffer, {
          plugins: [imageminWebp({ quality: webpQuality })],
        })

        // Create the path for the new .webp file (same name, new extension)
        const webpPath = file.replace(/\.(jpe?g|png)$/i, '.webp')

        // Write the optimized WebP buffer to the new file
        await fs.writeFile(webpPath, webpBuffer)
      }

      console.log(`\n----------------------------------------
🖼️  BrowserUX Image Optimize (Pre-build)           
----------------------------------------`)

      // If verbose listing is enabled, display individual WebP files created
      if (logListings) {
        // Print header with total count of WebP images generated
          console.log(`✅ WebP generated (${files.length}):`)

        // Loop through the original files and log their corresponding .webp paths
        for (const f of files) {
          // Replace the original extension with .webp to get the new file name
          const webpPath = f.replace(/\.(jpe?g|png)$/i, '.webp')

          // Compute the relative path from the /public/img directory
          const relative = path.relative(publicImgDir, webpPath).replace(/\\/g, '/')

          // Print the relative path in a readable format
          console.log(`- ${relative}`)
        }
      } else {
        // If detailed logging is disabled, just show a one-line summary
        console.log(`✅ ${files.length} WebP generated in /public/img (${supportedWebp.join(', ')})`)
      }

      // Print an extra newline to visually separate from next log section
      console.log(`\n`)
    },

    /**
     * Hook that runs after the bundle is written.
     * Optimizes images in `dist/img` by compressing them in-place.
     */

    async closeBundle() {
              console.log(`\n----------------------------------------
🖼️  BrowserUX Image Optimize (Post-build)           
----------------------------------------`)

      // Resolve the absolute path to the /dist/img output directory
      const distImgDir = path.resolve('dist/img')

      // Retrieve a list of image files to optimize in the /dist/img directory
      const files = await getAllImages(distImgDir, ['.jpg', '.jpeg', '.png', '.svg', '.webp'], webpExclude)

      // Initialize accumulators to track total size before and after optimization
      let totalBefore = 0
      let totalAfter = 0

      // Print a header with the number of images to be optimized
      console.log(`✅ Images optimized (${files.length}):`)

      // Loop through each image file in the list
      for (const file of files) {
        // Get the lowercase file extension (e.g., .jpg, .png)
        const ext = path.extname(file).toLowerCase()

        // Read the image into a buffer
        const buffer = await fs.readFile(file)
        const sizeBefore = buffer.length

        // Determine the appropriate optimization plugins based on file type
        const plugins = []
        if (ext === '.jpg' || ext === '.jpeg') plugins.push(imageminMozjpeg({ quality: jpegQuality }))
        if (ext === '.png') plugins.push(imageminPngquant({ quality: pngQuality }))
        if (ext === '.svg') plugins.push(imageminSvgo())
        if (ext === '.webp') plugins.push(imageminWebp({ quality: webpQuality }))

        // Optimize the image buffer using imagemin and selected plugins
        const optimized = await imagemin.buffer(buffer, { plugins })
        const sizeAfter = optimized.length

        // Overwrite the original file with the optimized buffer
        await fs.writeFile(file, optimized)

        // Accumulate total sizes for final stats
        totalBefore += sizeBefore
        totalAfter += sizeAfter
        
        // If detailed logging is enabled, log per-file compression stats
        if (logListings) {
          const saved = sizeBefore - sizeAfter
          const percent = ((saved / sizeBefore) * 100).toFixed(1)
          console.log(`- ${path.relative(distImgDir, file)} - ${formatSize(sizeBefore)} → ${formatSize(sizeAfter)} (${percent}% saved)`)
        }
      }

      // If listing is enabled, print total size savings across all images
      if (logListings) {
        console.log(`📦 Total: ${formatSize(totalBefore)} → ${formatSize(totalAfter)} (${((1 - totalAfter / totalBefore) * 100).toFixed(1)}% saved)`)
      } else {
        // Otherwise, print a simple summary message
        console.log('✅ Images optimized in /dist/img\n')
      }
    },
  }
}
