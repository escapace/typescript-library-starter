import { build } from 'esbuild'
import fastGlob from 'fast-glob'
import { remove } from 'fs-extra'
import { mkdir } from 'fs/promises'
import path from 'path'

import { fileURLToPath } from 'url'

const directoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../')
const directoryTests = path.join(directoryRoot, 'lib/tests')
const directorySrc = path.join(directoryRoot, 'src')

process.umask(0o022)
process.chdir(directoryRoot)

await remove(directoryTests)
await mkdir(directoryTests, { recursive: true })

const entryPoints = await fastGlob(['**/*.spec.?(m)(j|t)s?(x)'], {
  absolute: true,
  cwd: directorySrc,
  dot: true
})

await build({
  entryPoints,
  sourcemap: true,
  bundle: true,
  platform: 'node',
  target: [`node${process.version.slice(1)}`],
  format: 'esm',
  outbase: directorySrc,
  outdir: directoryTests,
  logLevel: 'info'
})
