import { assert, describe, it } from 'vitest'
import { hello } from './index.js'

describe('./src/index.spec.ts', () => {
  it('hello', async () => {
    assert.equal(await hello('World'), 'Hello World')
  })
})
