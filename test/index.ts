import { hello } from '../src/index'

// tslint:disable-next-line no-import-side-effect
import 'mocha'
import { assert } from 'chai'

describe('./test/index.ts', () => {
  it('hello', done => {
    hello('World')
      .then(result => {
        assert.equal(result, 'Hello World')
        done()
      })
      .catch(done)
  })
})
