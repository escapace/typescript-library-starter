import { hello } from './index'

// tslint:disable-next-line no-import-side-effect
import { assert } from 'chai'

describe('./src/index.spec.ts', () => {
  it('hello', (done) => {
    hello('World')
      .then((result) => {
        assert.equal(result, 'Hello World')
        done()
      })
      .catch(done)
  })
})
