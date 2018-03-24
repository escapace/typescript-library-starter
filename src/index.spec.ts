import { hello } from './index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { assert } from 'chai'

describe('...', () => {
  it('hello', () => {
    assert.equal(hello('World'), 'Hello World')
  })
})
