import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs/promises'
import path from 'path'
import os from 'os'
import sharp from 'sharp'
import type { ResolvedConfig } from 'vite'
import imageOptimizePlugin from '../src/index.js'

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Creates a minimal 10×10 JPEG test image. */
async function createJpeg(dest: string): Promise<void> {
  await sharp({
    create: { width: 10, height: 10, channels: 3, background: { r: 200, g: 100, b: 50 } },
  })
    .jpeg({ quality: 90 })
    .toFile(dest)
}

/** Creates a minimal 10×10 PNG test image. */
async function createPng(dest: string): Promise<void> {
  await sharp({
    create: { width: 10, height: 10, channels: 4, background: { r: 0, g: 128, b: 255, alpha: 1 } },
  })
    .png()
    .toFile(dest)
}

/** Returns a minimal mock ResolvedConfig for the given tmpDir. */
function mockConfig(tmpDir: string): ResolvedConfig {
  return {
    publicDir: path.join(tmpDir, 'public'),
    root: tmpDir,
    build: { outDir: 'dist' },
  } as unknown as ResolvedConfig
}

/** Calls the plugin's configResolved hook with the given config. */
function resolveConfig(plugin: ReturnType<typeof imageOptimizePlugin>, config: ResolvedConfig): void {
  ;(plugin.configResolved as (c: ResolvedConfig) => void)(config)
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('imageOptimizePlugin', () => {
  let tmpDir: string
  let publicImgDir: string
  let distImgDir: string

  beforeEach(async () => {
    tmpDir = path.join(os.tmpdir(), `vite-plugin-test-${Date.now()}`)
    publicImgDir = path.join(tmpDir, 'public', 'img')
    distImgDir = path.join(tmpDir, 'dist', 'img')
    await fs.mkdir(publicImgDir, { recursive: true })
    await fs.mkdir(distImgDir, { recursive: true })
  })

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true })
  })

  // ── Plugin metadata ────────────────────────────────────────────────────────

  it('has the correct name', () => {
    expect(imageOptimizePlugin().name).toBe('image-optimize')
  })

  it('is restricted to build mode', () => {
    expect(imageOptimizePlugin().apply).toBe('build')
  })

  // ── buildStart ─────────────────────────────────────────────────────────────

  describe('buildStart', () => {
    it('generates webp and avif from a jpeg', async () => {
      const plugin = imageOptimizePlugin()
      resolveConfig(plugin, mockConfig(tmpDir))

      await createJpeg(path.join(publicImgDir, 'photo.jpg'))
      await (plugin.buildStart as () => Promise<void>)()

      await expect(fs.access(path.join(publicImgDir, 'photo.webp'))).resolves.toBeUndefined()
      await expect(fs.access(path.join(publicImgDir, 'photo.avif'))).resolves.toBeUndefined()
    })

    it('generates webp and avif from a png', async () => {
      const plugin = imageOptimizePlugin()
      resolveConfig(plugin, mockConfig(tmpDir))

      await createPng(path.join(publicImgDir, 'icon.png'))
      await (plugin.buildStart as () => Promise<void>)()

      await expect(fs.access(path.join(publicImgDir, 'icon.webp'))).resolves.toBeUndefined()
      await expect(fs.access(path.join(publicImgDir, 'icon.avif'))).resolves.toBeUndefined()
    })

    it('only generates webp when avifEnable is false', async () => {
      const plugin = imageOptimizePlugin({ avifEnable: false })
      resolveConfig(plugin, mockConfig(tmpDir))

      await createJpeg(path.join(publicImgDir, 'photo.jpg'))
      await (plugin.buildStart as () => Promise<void>)()

      await expect(fs.access(path.join(publicImgDir, 'photo.webp'))).resolves.toBeUndefined()
      await expect(fs.access(path.join(publicImgDir, 'photo.avif'))).rejects.toThrow()
    })

    it('only generates avif when webpEnable is false', async () => {
      const plugin = imageOptimizePlugin({ webpEnable: false })
      resolveConfig(plugin, mockConfig(tmpDir))

      await createJpeg(path.join(publicImgDir, 'photo.jpg'))
      await (plugin.buildStart as () => Promise<void>)()

      await expect(fs.access(path.join(publicImgDir, 'photo.avif'))).resolves.toBeUndefined()
      await expect(fs.access(path.join(publicImgDir, 'photo.webp'))).rejects.toThrow()
    })

    it('does nothing when both webpEnable and avifEnable are false', async () => {
      const plugin = imageOptimizePlugin({ webpEnable: false, avifEnable: false })
      resolveConfig(plugin, mockConfig(tmpDir))

      await createJpeg(path.join(publicImgDir, 'photo.jpg'))
      await (plugin.buildStart as () => Promise<void>)()

      await expect(fs.access(path.join(publicImgDir, 'photo.webp'))).rejects.toThrow()
      await expect(fs.access(path.join(publicImgDir, 'photo.avif'))).rejects.toThrow()
    })

    it('skips output files that are already up to date', async () => {
      const plugin = imageOptimizePlugin()
      resolveConfig(plugin, mockConfig(tmpDir))

      const src = path.join(publicImgDir, 'photo.jpg')
      const webp = path.join(publicImgDir, 'photo.webp')
      const avif = path.join(publicImgDir, 'photo.avif')

      await createJpeg(src)
      // Write placeholder outputs, then backdate the source so outputs appear newer
      await fs.writeFile(webp, 'placeholder-webp')
      await fs.writeFile(avif, 'placeholder-avif')
      const past = new Date(Date.now() - 10_000)
      await fs.utimes(src, past, past)

      await (plugin.buildStart as () => Promise<void>)()

      expect(await fs.readFile(webp, 'utf-8')).toBe('placeholder-webp')
      expect(await fs.readFile(avif, 'utf-8')).toBe('placeholder-avif')
    })

    it('regenerates output when source is newer', async () => {
      const plugin = imageOptimizePlugin({ avifEnable: false })
      resolveConfig(plugin, mockConfig(tmpDir))

      const src = path.join(publicImgDir, 'photo.jpg')
      const webp = path.join(publicImgDir, 'photo.webp')

      // Create an old placeholder webp, then update the source to be newer
      await fs.writeFile(webp, 'stale-placeholder')
      const past = new Date(Date.now() - 10_000)
      await fs.utimes(webp, past, past)
      await createJpeg(src)

      await (plugin.buildStart as () => Promise<void>)()

      // Placeholder must have been replaced with a real webp
      const content = await fs.readFile(webp)
      expect(content.toString('utf-8')).not.toBe('stale-placeholder')
    })

    it('does nothing when public/img does not exist', async () => {
      const plugin = imageOptimizePlugin()
      resolveConfig(plugin, {
        publicDir: path.join(tmpDir, 'nonexistent'),
        root: tmpDir,
        build: { outDir: 'dist' },
      } as unknown as ResolvedConfig)

      await expect((plugin.buildStart as () => Promise<void>)()).resolves.toBeUndefined()
    })

    it('respects the exclude option', async () => {
      const plugin = imageOptimizePlugin({ exclude: ['**/skip.jpg'] })
      resolveConfig(plugin, mockConfig(tmpDir))

      await createJpeg(path.join(publicImgDir, 'skip.jpg'))
      await createJpeg(path.join(publicImgDir, 'keep.jpg'))
      await (plugin.buildStart as () => Promise<void>)()

      await expect(fs.access(path.join(publicImgDir, 'skip.webp'))).rejects.toThrow()
      await expect(fs.access(path.join(publicImgDir, 'keep.webp'))).resolves.toBeUndefined()
    })
  })

  // ── closeBundle ────────────────────────────────────────────────────────────

  describe('closeBundle', () => {
    it('compresses a jpeg in-place and keeps it valid', async () => {
      const plugin = imageOptimizePlugin()
      resolveConfig(plugin, mockConfig(tmpDir))

      const file = path.join(distImgDir, 'photo.jpg')
      await createJpeg(file)

      await (plugin.closeBundle as () => Promise<void>)()

      const meta = await sharp(file).metadata()
      expect(meta.format).toBe('jpeg')
    })

    it('compresses a png in-place and keeps it valid', async () => {
      const plugin = imageOptimizePlugin()
      resolveConfig(plugin, mockConfig(tmpDir))

      const file = path.join(distImgDir, 'icon.png')
      await createPng(file)

      await (plugin.closeBundle as () => Promise<void>)()

      const meta = await sharp(file).metadata()
      expect(meta.format).toBe('png')
    })

    it('optimizes an SVG and reduces its size', async () => {
      const plugin = imageOptimizePlugin()
      resolveConfig(plugin, mockConfig(tmpDir))

      const file = path.join(distImgDir, 'icon.svg')
      const verboseSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
        <!-- redundant comment -->
        <rect   x="0"   y="0"   width="100"   height="100"   fill="red"   />
      </svg>`
      await fs.writeFile(file, verboseSvg)
      const sizeBefore = (await fs.stat(file)).size

      await (plugin.closeBundle as () => Promise<void>)()

      const content = await fs.readFile(file, 'utf-8')
      expect(content.length).toBeLessThan(sizeBefore)
      expect(content).toContain('<svg')
    })

    it('produces a valid webp file after compression', async () => {
      const plugin = imageOptimizePlugin({ avifEnable: false })
      resolveConfig(plugin, mockConfig(tmpDir))

      const src = path.join(publicImgDir, 'photo.jpg')
      const webpInDist = path.join(distImgDir, 'photo.webp')
      await createJpeg(src)
      await sharp(src).webp({ quality: 90 }).toFile(webpInDist)

      await (plugin.closeBundle as () => Promise<void>)()

      const meta = await sharp(webpInDist).metadata()
      expect(meta.format).toBe('webp')
    })

    it('does nothing when dist/img does not exist', async () => {
      const plugin = imageOptimizePlugin()
      resolveConfig(plugin, {
        publicDir: path.join(tmpDir, 'public'),
        root: tmpDir,
        build: { outDir: 'nonexistent-dist' },
      } as unknown as ResolvedConfig)

      await expect((plugin.closeBundle as () => Promise<void>)()).resolves.toBeUndefined()
    })

    it('respects the exclude option', async () => {
      const plugin = imageOptimizePlugin({ exclude: ['**/skip.jpg'] })
      resolveConfig(plugin, mockConfig(tmpDir))

      const skip = path.join(distImgDir, 'skip.jpg')
      const keep = path.join(distImgDir, 'keep.jpg')
      await createJpeg(skip)
      await createJpeg(keep)

      const skipContentBefore = await fs.readFile(skip)

      await (plugin.closeBundle as () => Promise<void>)()

      // skip.jpg must be untouched
      const skipContentAfter = await fs.readFile(skip)
      expect(skipContentAfter).toEqual(skipContentBefore)

      // keep.jpg must still be a valid jpeg
      const meta = await sharp(keep).metadata()
      expect(meta.format).toBe('jpeg')
    })
  })
})
