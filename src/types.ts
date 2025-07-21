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
   * Compression quality range for PNG images.
   * Each value is between 0 (worst) and 1 (best).
   * Default: [0.6, 0.8]
   */

  pngQuality?: [number, number]

  /**
   * Compression quality for WebP output (0–100).
   * Default: 75
   */

  webpQuality?: number

  /**
   * Whether to enable WebP generation during pre-build.
   * Default: true
   */

  webpEnable?: boolean

  /**
   * File extensions to include in WebP generation.
   * Default: ['jpeg', 'png']
   */

  webpFormats?: ('jpeg' | 'png')[]

  /**
   * Glob patterns of files or directories to exclude from processing.
   * Default: []
   */

  webpExclude?: string[]

  /**
   * Whether to log detailed per-file processing output.
   * If false, only summary messages are shown.
   * Default: true
   */
  
  logListings?: boolean
}