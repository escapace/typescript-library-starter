import { hello } from './index.js'
import { assert } from 'chai'

describe('./src/index.spec.ts', () => {
  it('hello', async () => {
    assert.equal(await hello('World'), 'Hello World')
  })
})
