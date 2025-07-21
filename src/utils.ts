import { globby } from 'globby'

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
  // Build glob pattern like '**/*.{jpg,png,webp}'
  const patterns = [`**/*.{${exts.map(e => e.replace('.', '')).join(',')}}`]

  // Run globby with the pattern, targeting absolute paths and excluding specified patterns
  const files = await globby(patterns, {
    cwd: root,        // Base directory for glob matching
    absolute: true,   // Return absolute paths
    ignore: exclude,  // Exclude specified paths
  })
  // Return the list of matching image files
  return files
}

/**
 * Converts a file size in bytes to a human-readable string in kilobytes (KB).
 *
 * @param {number} bytes - Size in bytes
 * @returns {string} - Size formatted in kilobytes with one decimal place
 */

export function formatSize(bytes: number): string {
  // Convert bytes to kilobytes and format with 1 decimal place
  return `${(bytes / 1024).toFixed(1)} KB`
}
