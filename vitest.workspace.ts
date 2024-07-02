import { defineWorkspace } from 'vitest/config'
import configBrowser from './vitest.config.browser'
import configNode from './vitest.config.node'

export default defineWorkspace([configBrowser, configNode])
