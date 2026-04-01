import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs/promises'
import path from 'path'
import os from 'os'
import { getAllImages, fileIsNewer, formatSize } from '../src/utils.js'

// ─── formatSize ─────────────────────────────────────────────────────────────

describe('formatSize', () => {
  it('formats 0 bytes', () => {
    expect(formatSize(0)).toBe('0.0 KB')
  })

  it('formats 1024 bytes as 1.0 KB', () => {
    expect(formatSize(1024)).toBe('1.0 KB')
  })

  it('formats 1536 bytes as 1.5 KB', () => {
    expect(formatSize(1536)).toBe('1.5 KB')
  })
})

// ─── fileIsNewer ─────────────────────────────────────────────────────────────

describe('fileIsNewer', () => {
  let tmpDir: string

  beforeEach(async () => {
    tmpDir = path.join(os.tmpdir(), `vite-plugin-utils-${Date.now()}`)
    await fs.mkdir(tmpDir, { recursive: true })
  })

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true })
  })

  it('returns true when dest does not exist', async () => {
    const src = path.join(tmpDir, 'src.txt')
    const dest = path.join(tmpDir, 'dest.txt')
    await fs.writeFile(src, 'hello')
    expect(await fileIsNewer(src, dest)).toBe(true)
  })

  it('returns true when src is newer than dest', async () => {
    const dest = path.join(tmpDir, 'dest.txt')
    const src = path.join(tmpDir, 'src.txt')
    // Write dest first, then backdate it so src is definitely newer
    await fs.writeFile(dest, 'old')
    await fs.writeFile(src, 'new')
    const past = new Date(Date.now() - 10_000)
    await fs.utimes(dest, past, past)
    expect(await fileIsNewer(src, dest)).toBe(true)
  })

  it('returns false when dest is newer than src', async () => {
    const src = path.join(tmpDir, 'src.txt')
    const dest = path.join(tmpDir, 'dest.txt')
    await fs.writeFile(src, 'old')
    await fs.writeFile(dest, 'new')
    const past = new Date(Date.now() - 10_000)
    await fs.utimes(src, past, past)
    expect(await fileIsNewer(src, dest)).toBe(false)
  })
})

// ─── getAllImages ─────────────────────────────────────────────────────────────

describe('getAllImages', () => {
  let tmpDir: string

  beforeEach(async () => {
    tmpDir = path.join(os.tmpdir(), `vite-plugin-glob-${Date.now()}`)
    await fs.mkdir(path.join(tmpDir, 'sub'), { recursive: true })
    await fs.writeFile(path.join(tmpDir, 'a.jpg'), '')
    await fs.writeFile(path.join(tmpDir, 'b.png'), '')
    await fs.writeFile(path.join(tmpDir, 'c.svg'), '')
    await fs.writeFile(path.join(tmpDir, 'd.txt'), '')
    await fs.writeFile(path.join(tmpDir, 'sub', 'e.jpg'), '')
  })

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true })
  })

  it('returns only files matching the given extensions', async () => {
    const files = await getAllImages(tmpDir, ['.jpg', '.png'])
    const names = files.map(f => path.basename(f)).sort()
    expect(names).toEqual(['a.jpg', 'b.png', 'e.jpg'])
  })

  it('strips leading dot from extensions correctly', async () => {
    const files = await getAllImages(tmpDir, ['jpg'])
    const names = files.map(f => path.basename(f)).sort()
    expect(names).toEqual(['a.jpg', 'e.jpg'])
  })

  it('respects exclude glob patterns', async () => {
    const files = await getAllImages(tmpDir, ['.jpg', '.png'], ['**/*.png'])
    const names = files.map(f => path.basename(f)).sort()
    expect(names).toEqual(['a.jpg', 'e.jpg'])
  })

  it('scans subdirectories recursively', async () => {
    const files = await getAllImages(tmpDir, ['.jpg'])
    const names = files.map(f => path.basename(f)).sort()
    expect(names).toEqual(['a.jpg', 'e.jpg'])
  })

  it('returns absolute paths', async () => {
    const files = await getAllImages(tmpDir, ['.jpg'])
    for (const f of files) {
      expect(path.isAbsolute(f)).toBe(true)
    }
  })
})
