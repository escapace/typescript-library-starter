import { build } from 'esbuild'
import execa from 'execa'
import fse from 'fs-extra'
import { mkdir } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const cwd = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../')

const external = Object.keys(
  (await fse.readJSON(path.join(cwd, 'package.json')))['dependencies'] ?? {}
)

const options = {
  cjs: {
    outdir: path.join(cwd, 'lib/cjs')
  },
  esm: {
    outdir: path.join(cwd, 'lib/esm')
  }
}

process.umask(0o022)
process.chdir(cwd)

await Promise.all(
  Object.keys(options).map(async (format) => {
    const { outdir } = options[format]

    await fse.remove(outdir)
    await mkdir(outdir, { recursive: true })

    await build({
      entryPoints: ['src/index.ts'],
      sourcemap: true,
      bundle: true,
      platform: 'node',
      target: 'node14.17.0',
      format,
      tsconfig: path.join(cwd, 'tsconfig-build.json'),
      external: ['esbuild', ...external],
      outbase: path.join(cwd, 'src'),
      outdir,
      outExtension: { '.js': `.${format === 'esm' ? 'mjs' : 'cjs'}` },
      logLevel: 'info'
    })
  })
)

await fse.remove(path.join(cwd, 'lib/types'))

await execa(
  path.join(cwd, 'node_modules', '.bin', 'tsc'),
  [
    '-p',
    './tsconfig-build.json',
    '--emitDeclarationOnly',
    '--declarationDir',
    'lib/types'
  ],
  { all: true, cwd }
).catch((reason) => {
  console.error(reason.all)
  process.exit(reason.exitCode)
})
