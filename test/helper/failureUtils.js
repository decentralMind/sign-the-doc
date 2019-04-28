const { should } = require('./setup')
const shouldFail = require('./shouldFail');

async function customThrow(msg) {
	throw new Error(msg)
}

async function assertFailure (promise) {
  try {
	 	await promise;
  } catch (error) {
    return;
  }
  should.fail();
}

async function internalFailWithMsg(promise, message) {
  try {
    await promise;
  } catch (error) {
    if (message) {
      error.message.should.include(message, `Wrong failure type, expected '${message}'`);
    }
    return;
  }
  should.fail('Expected failure not received');
}

module.exports = {
  customThrow:customThrow,
  assertFailure:assertFailure,
	internalFailWithMsg: internalFailWithMsg,
};
