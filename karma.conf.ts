/* tslint:disable no-var-requires */
import puppeteer from 'puppeteer'

import { camelCase } from 'lodash'

process.env.CHROME_BIN = puppeteer.executablePath()

const pkg = require('./package.json')

export default config => {
  config.set({
    mime: {
      'text/x-typescript': ['ts']
    },
    client: {
      captureConsole: false
    },
    plugins: ['karma-chrome-launcher', 'karma-mocha', 'karma-sauce-launcher', 'karma-typescript'],
    frameworks: ['mocha', 'karma-typescript'],
    files: ['src/**/*.ts'],
    preprocessors: {
      'src/**/*.ts': 'karma-typescript'
    },
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
        browserName: 'Firefox',
        version: '55'
      },
      sl_chrome: {
        base: 'SauceLabs',
        browserName: 'Chrome',
        version: '61'
      },
      sl_safari: {
        base: 'SauceLabs',
        browserName: 'Safari',
        version: '10'
      },
      sl_edge: {
        base: 'SauceLabs',
        browserName: 'MicrosoftEdge',
        version: '15'
      },
      // sl_ios: {
      //   base: 'SauceLabs',
      //   deviceName: "iPad (5th generation) Simulator",
      //   deviceOrientation: "portrait",
      //   platformVersion: "11.0",
      //   platformName: "iOS",
      //   browserName: "Safari"
      // },
      sl_android: {
        base: 'SauceLabs',
        deviceName: 'Android Emulator',
        deviceOrientation: 'portrait',
        browserName: 'Chrome',
        platformVersion: '6.0',
        platformName: 'Android'
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
        testName: `${pkg.name} karma test`,
        tunnelIdentifier: process.env.TRAVIS ? process.env.TRAVIS_JOB_NUMBER : camelCase(pkg.name)
      },
      customLaunchers: customLaunchers,
      browsers: Object.keys(customLaunchers),
      reporters: ['dots', 'karma-typescript', 'saucelabs'],
      singleRun: true
    })
  }
}
