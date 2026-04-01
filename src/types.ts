/**
 * Options for configuring image optimization behavior.
 */

export interface ImageOptimizeOptions {
  /**
   * Compression quality for JPEG images (0–100).
   * Default: 80
   */
  jpegQuality?: number

  /**
   * Compression quality for PNG images (0–100).
   * Default: 80
   */
  pngQuality?: number

  /**
   * Compression quality for WebP output (0–100).
   * Default: 75
   */
  webpQuality?: number

  /**
   * Compression quality for AVIF output (0–100).
   * Lower values produce smaller files. 50 is a good starting point.
   * Default: 50
   */
  avifQuality?: number

  /**
   * Whether to generate WebP versions of JPEG/PNG images during pre-build.
   * Default: true
   */
  webpEnable?: boolean

  /**
   * Whether to generate AVIF versions of JPEG/PNG images during pre-build.
   * Default: true
   */
  avifEnable?: boolean

  /**
   * Glob patterns of files or directories to exclude from all processing.
   * Default: []
   */
  exclude?: string[]

  /**
   * Whether to log detailed per-file processing output.
   * If false, only summary messages are shown.
   * Default: true
   */
  logListings?: boolean
}
