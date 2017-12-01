import chai from 'chai';
import app from 'app/app';

const assert = chai.assert;

describe('app', function() {
  it('exists', function() {
    assert.isDefined(app);
  });

  // uncomment for a sanity check
  //it('can fail', function() {
    //assert.fail();
  //});
});
