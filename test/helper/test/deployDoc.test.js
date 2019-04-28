const { BN, should } = require('../setup');
const deployDoc = require('../deployDoc');
const getSignData = require('../getSignData')
const { latest, duration } = require('../time');

describe('deployDoc', function() {
  beforeEach(async function() {
    this.latestTime = await latest();
    this.expiryDate = this.latestTime.add(duration.days(1));
    this.accounts = await web3.eth.getAccounts();
    this.msg = 'Vitalik knows who is Satoshi Nakamoto';
    this.docHash = web3.utils.sha3(this.msg);
    this.authorisedSignerList = [this.accounts[1], this.accounts[2]];
    this.signData = await getSignData(this.msg, this.accounts[0]);
  });

  describe('Without requesting to modify variables', function() {
    beforeEach(function() {
      this.depData = deployDoc(null, null, this.expiryDate, this.signData,
        [this.accounts[1], this.accounts[2]])
    });

    it('returns correct data', function() {
      this.depData.expiryDate.should.be.bignumber.equal(this.expiryDate);
      this.depData.signature.should.be.equal(this.signData.signature);
      this.depData.authorisedSignerList.should.be.eql(this.authorisedSignerList);
      this.depData.docHash.should.be.equal(this.signData.docHash);
      this.depData.r.should.be.equal(this.signData.r);
      this.depData.s.should.be.equal(this.signData.s);
      this.depData.v.should.be.bignumber.equal(this.signData.v);
    });
  }); //----end tag without requesting---->

  describe('requesting to modify variables', function() {
    beforeEach(function() {
      this.testMsg = 'decentralize world';
      this.testHash = web3.utils.sha3(this.testMsg);
    })
    //----start tag requesting to modify ---->
    context('modify expiryDate', function() {
      beforeEach(function() {
        this.expiryDate = new BN(123456789)
        this.depData = deployDoc('expiryDate', 123456789, this.expiryDate, this.signData,
          [this.accounts[1], this.accounts[2]])
      });

      it('returns correct modified expiryDate', function() {
        (this.depData.expiryDate).should.be.bignumber.equal(this.expiryDate)
      });

      it('returns all other data unmodified', function() {
        this.depData.signature.should.be.equal(this.signData.signature);
        this.depData.authorisedSignerList.should.be.eql(this.authorisedSignerList);
        this.depData.docHash.should.be.equal(this.signData.docHash);
        this.depData.r.should.be.equal(this.signData.r);
        this.depData.s.should.be.equal(this.signData.s);
        this.depData.v.should.be.bignumber.equal(this.signData.v);
      });
    }); //---end tag modify expiryDate-->

    context('modify docHash', function() {
      beforeEach(function() {
        this.depData = deployDoc('docHash', this.testHash, this.expiryDate, this.signData,
          [this.accounts[1], this.accounts[2]])
      });

      it('returns correct modified docHash', function() {
        (this.depData.docHash).should.be.equal(this.testHash)
      });

      it('returns all other data unmodified', function() {
        this.depData.expiryDate.should.bignumber.equal(this.expiryDate);
        this.depData.signature.should.be.equal(this.signData.signature);
        this.depData.authorisedSignerList.should.be.eql(this.authorisedSignerList);
        this.depData.r.should.be.equal(this.signData.r);
        this.depData.s.should.be.equal(this.signData.s);
        this.depData.v.should.be.bignumber.equal(this.signData.v);
      });
    }); //----end tag modify docHash ---->

    context('modify signature', function() {
      beforeEach(async function() {
        this.signature = await web3.eth.sign(this.testHash, this.accounts[0]);
        this.depData = deployDoc('signature', this.signature, this.expiryDate, this.signData,
          [this.accounts[1], this.accounts[2]]);
      });

      it('returns correct modified signature', function() {
        this.depData.signature.should.be.equal(this.signature);
      });

      it('returns all other data unmodified', function() {
        this.depData.expiryDate.should.bignumber.equal(this.expiryDate);
        this.depData.docHash.should.be.equal(this.docHash);
        this.depData.authorisedSignerList.should.be.eql(this.authorisedSignerList);
        this.depData.r.should.be.equal(this.signData.r);
        this.depData.s.should.be.equal(this.signData.s);
        this.depData.v.should.be.bignumber.equal(this.signData.v);
      });
    }); //----end tag modify signature ---->

    context('modify variable r', function() {
      beforeEach(async function() {
        this.sigData = await getSignData(this.testHash, this.accounts[0]);
        this.depData = deployDoc('r', this.sigData.r, this.expiryDate, this.signData,
          [this.accounts[1], this.accounts[2]]);
      });

      it('returns correct modified variable r', function() {
        this.depData.r.should.be.equal(this.sigData.r);
      });

      it('returns all other data unmodified', function() {
        this.depData.expiryDate.should.bignumber.equal(this.expiryDate);
        this.depData.docHash.should.be.equal(this.docHash);
        this.depData.authorisedSignerList.should.be.eql(this.authorisedSignerList);
        this.depData.s.should.be.equal(this.signData.s);
        this.depData.v.should.be.bignumber.equal(this.signData.v);
      });
    }); //----end tag modify variable r ---->

    context('modify variable r', function() {
      beforeEach(async function() {
        this.sigData = await getSignData(this.testHash, this.accounts[0]);
        this.depData = deployDoc('s', this.sigData.s, this.expiryDate, this.signData,
          [this.accounts[1], this.accounts[2]]);
      });

      it('returns correct modified varaible s', function() {
        this.depData.s.should.be.equal(this.sigData.s);
      });

      it('returns all other data unmodified', function() {
        this.depData.expiryDate.should.bignumber.equal(this.expiryDate);
        this.depData.docHash.should.be.equal(this.docHash);
        this.depData.authorisedSignerList.should.be.eql(this.authorisedSignerList);
        this.depData.r.should.be.equal(this.signData.r);
        this.depData.v.should.be.bignumber.equal(this.signData.v);
      });
    }); //----end tag modify variable s ---->

    context('modify variable v', function() {
      beforeEach(async function() {
        this.sigData = await getSignData(this.testHash, this.accounts[0]);
        this.depData = deployDoc('v', this.sigData.v, this.expiryDate, this.signData,
          [this.accounts[1], this.accounts[2]]);
      });

      it('returns correct modified variable v', function() {
        this.depData.v.should.be.bignumber.equal(this.sigData.v);
      });

      it('returns all other data unmodified', function() {
        this.depData.expiryDate.should.bignumber.equal(this.expiryDate);
        this.depData.docHash.should.be.equal(this.docHash);
        this.depData.authorisedSignerList.should.be.eql(this.authorisedSignerList);
        this.depData.s.should.be.equal(this.signData.s);
        this.depData.r.should.be.equal(this.signData.r);
      });
    }); //----end tag modify
  }); //----end tag requesting to modify ---->

  describe('throw error check', function() {
    beforeEach(function() {
      this.errMsg = 'null type is not supported';
    });

    it('throws an error for unmatch variable names', function() {
      (() => {
        deployDoc('hmm.. Tron', this.signData.v, this.expiryDate, this.signData,
          [this.accounts[1], this.accounts[2]]);
      }).should.throw(Error, 'Could not find any variable named hmm.. Tron');
    });

    it('throws an error if an intended modification variable is null', function() {
      (() => {
        deployDoc(null, 'signature', this.expiryDate, this.signData,
          [this.accounts[1], this.accounts[2]]);
      }).should.throw(Error, this.errMsg);
    });

    it('throws an if null value is passed for intended modification variable', function() {
      (() => {
        deployDoc('signature', null, this.expiryDate, this.signData,
          [this.accounts[1], this.accounts[2]]);
      }).should.throw(Error, this.errMsg);
    });
  }); //----end tag throw erorr check ---->
}); //----Main Tag---->
