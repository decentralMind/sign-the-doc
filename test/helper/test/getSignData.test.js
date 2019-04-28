const Signature = artifacts.require('Signature');
const { BN, should } = require('../setup');
const getSignData = require('../getSignData')

contract('Signature', function([accOne, accTwo]) {
  beforeEach(async function() {
    this.sig = await Signature.new();
    this.msg = 'Bitconnnnnnnnnnneeeecttt, wasssup wassup wassup #$#@';
    this.signMsg = await web3.eth.sign(this.msg, accOne);
    this.signData = await getSignData(this.signMsg, accOne);
  });

  describe('Correct Format Check', function() {
    it('returns bytes and bytes32 data correctly with 0x prefix at front', function() {
      Object.entries(this.signData).forEach(([key, value]) => {
        if(key != 'v') {
          const getPrefix = value.slice(0,2);
          getPrefix.should.be.equal('0x', `${key}:${value} should have 0x prefix at front`);
        }
      });
    });

    it('returns signature length of 132 include 0x prefix', function() {
      (this.signData.signature.length).should.be.equal(132);
    });

    it('returns r length of 66 include 0x prefix', function() {
      (this.signData.r.length).should.be.equal(66);
    });

    it('returns s length of 66 include 0x prefix', function() {
      (this.signData.s.length).should.be.equal(66);
    });

    it('returns v with BN type and should be either 27 or 28', function() {
      (BN.isBN(this.signData.v)).should.be.equal(true);
    });

    it('returns v with BN type and should be either 27 or 28', function() {
      (this.signData.v.toNumber()).should.satisfy(function (num) {
          if ( num === 27 || num === 28) {
              return true;
          } else {
              return false;
          }
      });
    });
  });

  describe('it should get accurate signed Address', function() {
    it('returns true if provided signer address is correct', async function() {
      const bool = await (this.sig.verifySignature(
        this.signData.docHash,
        this.signData.r,
        this.signData.s,
        this.signData.v,
        accOne
      ));

      bool.should.be.equal(true);
    });

    it('returns false if provided signer address is incorrect', async function() {
      const bool = await (this.sig.verifySignature(
        this.signData.docHash,
        this.signData.r,
        this.signData.s,
        this.signData.v,
        accTwo
      ));

      bool.should.be.equal(false);
    });
  });
});
