import { defineConfig, mergeConfig } from 'vitest/config'
import { version } from './package.json'
import { builds } from './scripts/constants.json'
import configShared from './vitest.config'

export default mergeConfig(
  configShared,
  defineConfig({
    define: {
      ...builds.browser.define,
      __VERSION__: JSON.stringify(version),
    },
    esbuild: {
      platform: 'browser',
      target: builds.browser.target,
    },
    test: {
      environment: 'jsdom',
      include: ['{src,tests}/**/+([a-zA-Z0-9-])?(.browser).{test,spec}.?(c|m)[jt]s?(x)'],
      name: 'browser',
      sequence: {
        hooks: 'list',
      },
    },
  }),
)
