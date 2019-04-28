const { should } = require('../setup')
const { customThrow, assertFailure, internalFailWithMsg } = require('../failureUtils')

describe('interFailWithMsg', async function() {
  beforeEach(function() {
    this.errorMsg = 'blockNumber is undefined';
    this.errorMsgTwo = 'BN or string type is expected';
  });

  it('throws an error with correct error message supplied', async function() {
    await internalFailWithMsg(
      customThrow('blockNumber is undefined'), this.errorMsg);
  });

  it(`if it's throwing an error`, async function() {
    await assertFailure(
      internalFailWithMsg(
        customThrow('BN or string type is expected'), this.errorMsg)
    );
  });

  it('throws an error if incorrect message type is provided', async function() {
    await assertFailure(
      internalFailWithMsg(
        customThrow(this.errorMsgTwo), this.errorMsg)
    );
  });
});
