import { globby } from 'globby'
import fs from 'fs/promises'

/**
 * Recursively collects all image files matching the provided extensions
 * in a given directory, while excluding paths that match ignore patterns.
 *
 * @param {string} root - Root directory to start scanning from
 * @param {string[]} exts - Array of file extensions to include (e.g. ['.jpg', '.png'])
 * @param {string[]} [exclude=[]] - Optional glob patterns to exclude from results
 * @returns {Promise<string[]>} - List of absolute file paths to matching image files
 */
export async function getAllImages(
  root: string,
  exts: string[],
  exclude: string[] = []
): Promise<string[]> {
  const patterns = [`**/*.{${exts.map(e => e.replace('.', '')).join(',')}}`]
  return globby(patterns, {
    cwd: root,
    absolute: true,
    ignore: exclude,
  })
}

/**
 * Returns true if `src` is newer than `dest`, or if `dest` does not exist.
 * Used to skip re-generating modern format files that are already up to date.
 *
 * @param {string} src - Path to the source file
 * @param {string} dest - Path to the output file
 * @returns {Promise<boolean>}
 */
export async function fileIsNewer(src: string, dest: string): Promise<boolean> {
  try {
    const [srcStat, destStat] = await Promise.all([fs.stat(src), fs.stat(dest)])
    return srcStat.mtimeMs > destStat.mtimeMs
  } catch {
    return true
  }
}

/**
 * Converts a file size in bytes to a human-readable string in kilobytes (KB).
 *
 * @param {number} bytes - Size in bytes
 * @returns {string} - Size formatted in kilobytes with one decimal place
 */
export function formatSize(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)} KB`
}
