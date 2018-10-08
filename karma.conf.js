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
    plugins: [
      'karma-chrome-launcher',
      'karma-mocha',
      'karma-sauce-launcher',
      'karma-typescript'
    ],
    frameworks: ['mocha', 'karma-typescript'],
    files: ['node_modules/@babel/polyfill/dist/polyfill.js', 'src/**/*.ts', 'test/**/*.ts'],
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

  if (process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY) {
    const customLaunchers = {
      sl_firefox: {
        base: 'SauceLabs',
        browserName: 'Firefox'
      },
      sl_chrome: {
        base: 'SauceLabs',
        browserName: 'Chrome',
        version: 'beta'
      },
      sl_safari: {
        base: 'SauceLabs',
        browserName: 'Safari'
      },
      sl_edge: {
        base: 'SauceLabs',
        browserName: 'MicrosoftEdge'
      }
    }

    config.set({
      retryLimit: 3,
      concurrency: 2,
      captureTimeout: 85 * 1000,
      browserNoActivityTimeout: 120 * 1000,
      browserDisconnectTimeout: 15 * 1000,
      browserDisconnectTolerance: 3,
      sauceLabs: {
        testName: `${name} karma test`,
        tunnelIdentifier: process.env.TRAVIS
          ? process.env.TRAVIS_JOB_NUMBER
          : camelCase(name)
      },
      customLaunchers: customLaunchers,
      browsers: Object.keys(customLaunchers),
      reporters: ['dots', 'karma-typescript', 'saucelabs'],
      singleRun: true
    })
  }
}
