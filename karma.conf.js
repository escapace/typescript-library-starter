const puppeteer = require('puppeteer')
const { camelCase } = require('lodash')
const { name } = require('./package.json')

process.env.CHROME_BIN = puppeteer.executablePath()

module.exports = config => {
  config.set({
    mime: {
      'text/x-typescript': ['ts']
    },
    client: {
      captureConsole: false
    },
    plugins: ['karma-chrome-launcher', 'karma-mocha', 'karma-typescript'],
    frameworks: ['mocha', 'karma-typescript'],
    files: [
      'node_modules/@babel/polyfill/dist/polyfill.js',
      'src/**/*.ts',
      'test/**/*.ts'
    ],
    preprocessors: {
      'src/**/*.ts': 'karma-typescript',
      'test/**/*.ts': 'karma-typescript'
    },
    exclude: ['src/types/**/*.d.ts'],
    reporters: ['dots', 'karma-typescript'],
    browsers: ['puppeteer'],
    customLaunchers: {
      puppeteer: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    },
    karmaTypescriptConfig: {
      reports: {},
      compilerOptions: {
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        module: 'commonjs',
        sourceMap: true,
        target: 'ES5'
      },
      tsconfig: './tsconfig.json'
    }
  })
}
