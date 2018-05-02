import { hello } from './index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { assert } from 'chai'

describe('...', () => {
  it('hello', done => {
    hello('World')
      .then(result => {
        assert.equal(result, 'Hello World')
        done()
      })
      .catch(done)
  })
})
