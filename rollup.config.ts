import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import { camelCase, defaults, keys, merge, values } from 'lodash'
import typescript from 'rollup-plugin-typescript2'
import json from 'rollup-plugin-json'

// tslint:disable-next-line no-var-requires
const pkg = require('./package.json')

const defaultPlugins = (compilerOptions = {}) => ({
  json: json(),
  typescript: typescript({
    cacheRoot: './node_modules/.cache/rts2_cache',
    useTsconfigDeclarationDir: true,
    tsconfigOverride: {
      compilerOptions: defaults({}, compilerOptions, {
        module: 'es2015',
        target: 'es5',
        declaration: false,
        declarationDir: undefined
      })
    }
  }),
  commonjs: commonjs(),
  resolve: resolve(),
  sourceMaps: sourceMaps()
})

const defaultConfiguration = {
  input: `src/index.ts`,
  watch: {
    include: 'src/**'
  },
  treeshake: {
    pureExternalModules: true
  },
  output: {
    sourcemap: true
  },
  external: [],
  plugins: []
}

export default [
  merge({}, defaultConfiguration, {
    output: { file: pkg.main, name: camelCase(pkg.name), format: 'umd' },
    plugins: values(defaultPlugins())
  }),
  merge({}, defaultConfiguration, {
    external: keys(pkg.dependencies),
    output: { file: pkg.module, format: 'es' },
    plugins: values(defaultPlugins())
  })
]
