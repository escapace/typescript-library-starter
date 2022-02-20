import fse from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

export const cwd = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../'
)

export const packageJSON = await fse.readJSON(path.join(cwd, 'package.json'))
export const external = Object.keys(packageJSON.dependencies ?? {})

export const target = ['node16']
