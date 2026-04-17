import { execFile } from 'node:child_process'
import { constants } from 'node:fs'
import { access } from 'node:fs/promises'
import { promisify } from 'node:util'
import { version, devDependencies } from './package.json'
import { defineConfig, mergeConfig } from 'vitest/config'
import type { BrowserProviderOption } from 'vitest/node'
import { builds } from './scripts/constants.json'
import configShared from './vitest.config'

interface PlaywrightPackage {
  chromium: {
    executablePath: () => string
  }
}

interface VitestBrowserPlaywrightPackage {
  playwright: (options?: {
    launchOptions?: {
      executablePath?: string
    }
  }) => BrowserProviderOption
}

const JSDOM_PACKAGE_NAME = 'jsdom'
const PLAYWRIGHT_PACKAGE_NAME = 'playwright'
const VITEST_BROWSER_PLAYWRIGHT_PACKAGE_NAME = '@vitest/browser-playwright'

const CHROMIUM_PATHS = [
  '/usr/lib64/chromium-browser/headless_shell',
  '/opt/google/chrome/chrome',
  '/usr/bin/chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/snap/bin/chromium',
]

const CHROMIUM_BINARIES = [
  'chrome',
  'google-chrome',
  'google-chrome-stable',
  'chromium',
  'chromium-browser',
  'headless_shell',
]

const VERSION_PREFIXES = ['Chromium ', 'Google Chrome for Testing ', 'Google Chrome ']

async function exec(command: string, arguments_: string[]) {
  try {
    const { stdout } = await promisify(execFile)(command, arguments_, {
      encoding: 'utf8',
    })

    const output = stdout.trim()

    return output.length > 0 ? output : undefined
  } catch {
    return
  }
}

async function isUsableBrowserBinary(browserPath: string | undefined) {
  if (browserPath === undefined) {
    return false
  }

  try {
    await access(browserPath, constants.X_OK)
  } catch {
    return false
  }

  const version = await exec(browserPath, ['--version'])

  return version !== undefined && VERSION_PREFIXES.some((prefix) => version.startsWith(prefix))
}

async function resolveChromiumPath() {
  for (const command of CHROMIUM_BINARIES) {
    const executablePath = await exec('sh', ['-lc', `command -v ${command}`])

    if (await isUsableBrowserBinary(executablePath)) {
      return executablePath
    }
  }

  for (const candidate of CHROMIUM_PATHS) {
    if (await isUsableBrowserBinary(candidate)) {
      return candidate
    }
  }

  return
}

async function resolveVitestBrowserProvider(): Promise<
  | {
      executablePath: string
      playwright: VitestBrowserPlaywrightPackage['playwright']
      type: 'playwright'
    }
  | {
      type: 'jsdom'
    }
  | undefined
> {
  const hasJSDOM = devDependencies !== undefined && Reflect.has(devDependencies, JSDOM_PACKAGE_NAME)
  const hasPlaywright =
    devDependencies !== undefined &&
    Reflect.has(devDependencies, VITEST_BROWSER_PLAYWRIGHT_PACKAGE_NAME) &&
    Reflect.has(devDependencies, PLAYWRIGHT_PACKAGE_NAME)

  if (hasPlaywright) {
    let playwrightPackage: PlaywrightPackage | undefined

    try {
      playwrightPackage = (await import(PLAYWRIGHT_PACKAGE_NAME)) as PlaywrightPackage
    } catch {
      playwrightPackage = undefined
    }

    let vitestBrowserPlaywright: VitestBrowserPlaywrightPackage | undefined

    try {
      vitestBrowserPlaywright = (await import(
        VITEST_BROWSER_PLAYWRIGHT_PACKAGE_NAME
      )) as VitestBrowserPlaywrightPackage
    } catch {
      vitestBrowserPlaywright = undefined
    }

    if (playwrightPackage !== undefined && vitestBrowserPlaywright !== undefined) {
      const chromiumPath = await resolveChromiumPath()

      if (chromiumPath !== undefined) {
        return {
          executablePath: chromiumPath,
          playwright: vitestBrowserPlaywright.playwright,
          type: 'playwright',
        }
      }

      const playwrightChromiumPath = playwrightPackage.chromium.executablePath()

      if (await isUsableBrowserBinary(playwrightChromiumPath)) {
        return {
          executablePath: playwrightChromiumPath,
          playwright: vitestBrowserPlaywright.playwright,
          type: 'playwright',
        }
      }
    }
  }

  return hasJSDOM ? { type: 'jsdom' } : undefined
}

const browserProvider = await resolveVitestBrowserProvider()

export default mergeConfig(
  configShared,
  defineConfig({
    define: {
      ...['browser', 'neutral', 'node']
        .map(
          (target) =>
            (Reflect.get(builds, target) as { define?: Record<string, string> } | undefined)
              ?.define,
        )
        .find((value) => value !== undefined),
      __ENVIRONMENT__: JSON.stringify('development'),
      __VERSION__: JSON.stringify(version),
      __VITEST_PROJECT__: JSON.stringify('browser'),
    },
    test: {
      include:
        browserProvider === undefined
          ? []
          : ['{src,test}/**/+([a-zA-Z0-9-])?(.browser).{test,spec}.?(c|m)[jt]s?(x)'],
      name: 'browser',
      sequence: {
        hooks: 'list',
      },
      ...(browserProvider === undefined
        ? {}
        : browserProvider.type === 'jsdom'
          ? {
              environment: 'jsdom',
            }
          : {
              browser: {
                enabled: true,
                headless: true,
                instances: [{ browser: 'chromium' }],
                provider: browserProvider.playwright({
                  launchOptions: {
                    executablePath: browserProvider.executablePath,
                  },
                }),
              },
            }),
    },
  }),
)
