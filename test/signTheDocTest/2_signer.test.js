const SignTheDoc = artifacts.require('SignTheDoc');
const { BN, should } = require('../helper/setup');
const { eventExist } = require('../helper/getEvents');
const { assertFailure, internalFailWithMsg } = require('../helper/failureUtils');
const { advanceBlock, latest, latestBlock, increase, increaseTo, duration } = require('../helper/time');
const getSignData = require('../helper/getSignData');
const shouldFail = require('../helper/shouldFail');
const deployDoc = require('../helper/deployDoc');
const time = require('../helper/time');

contract('SignTheDoc', function ([accOne, accTwo, accThree, accFour, accFive]) {
  beforeEach(async function () {
    this.creatorAccount = accOne;
    this.std = await SignTheDoc.new({
      from: this.creatorAccount
    });
    this.MainMsg = 'hello world!'
    this.signData = await getSignData(this.MainMsg, this.creatorAccount);
    this.latestBlockTime = await latest();
    this.expiryDate = this.latestBlockTime.add(duration.days(1));
    this.authorisedSignerList = [accTwo, accFour];

    //Create document and deploy on network
    //Allows to pass mock value while creating and deploying document.
    this.deploy = async function (modify, value) {
      const depData = deployDoc(
        modify, value, this.expiryDate, this.signData, this.authorisedSignerList
      );

      await this.std.createDocToSign(
        depData.expiryDate,
        depData.signature,
        depData.authorisedSignerList,
        depData.docHash,
        depData.r,
        depData.s,
        depData.v, {
          from: this.creatorAccount
        });
    }

    //Sign the deployed document
    //Allows to pass mock value while signing the document.
    //Expiry date and authroised signer list is not needed.
    this.signDoc = async function (signerAccount, signerSignedData, modify, value) {
      const depData = deployDoc(
        modify, value, null, signerSignedData, null
      );

      await this.std.signTheDoc(
        this.creatorAccount,
        depData.docHash,
        depData.r,
        depData.s,
        depData.v,
        signerSignedData.signature, {
          from: signerAccount
        }
      );
    }
  });

  describe('signTheDoc', function () {
    beforeEach(async function () {
      this.signerMsg = 'hello world!'
      await this.deploy();
    });

    describe('sucessfully publish correct signed data', function () {
      beforeEach(async function () {
        this.signerAddress = accTwo;
        this.signData = await getSignData(this.signerMsg, this.signerAddress);
        this.latestTime = await latest();
        this.tolerance_seconds = new BN(2);

        await this.signDoc(accTwo, this.signData);

        this.docInfo = await this.std.getDocData(this.signData.docHash);
        this.signerInfo = await this.std.getSignerInfo(this.signData.docHash, this.signerAddress);
      });

      it('verifies correct signer address entry', async function () {
        (this.signerInfo.signerAddress).should.be.equal(this.signerAddress);
      });

      it('verifies correct document hash entry', async function () {
        (this.signerInfo.docHash).should.be.equal(this.signData.docHash);
      });

      it('verifies correct signature entry', async function () {
        (this.signerInfo.signature).should.be.equal(this.signData.signature);
      });

      it('verifies correct signed time entry', async function () {
        (this.signerInfo.signedDate).should.be.bignumber.closeTo(this.latestTime, this.tolerance_seconds);
      });

      it('correctly updates whoSigned list with signer address', async function () {
        (this.docInfo.whoSigned.length).should.be.equal(1);
        (this.docInfo.whoSigned[0]).should.be.equal(this.signerAddress);
      });

      it('correctly return boolean value true for signedOrNot mapping', async function () {
        (this.signerInfo.signedOrNot).should.be.equal(true);
      });

      it('correctly records bool value to signedOrNot mapping', async function () {
        (await this.std.isSigned(this.signData.docHash, accTwo)).should.be.equal(true);
      });

      it('should not map other address to true beside the address used for signing', async function () {
        (await this.std.isSigned(this.signData.docHash, accOne)).should.be.equal(false);
        (await this.std.isSigned(this.signData.docHash, accThree)).should.be.equal(false);
      });
    }); //---end tag sucessfully registered --->>

    describe('invalid document hash', function () {
      beforeEach(async function () {
        this.signerAddress = accThree;
        this.signData = await getSignData(this.signerMsg, this.signerAddress);
        this.mockHash = web3.utils.sha3('ethereum mining rig');
      });

      it('throws for incorrect document hash', async function () {
        await shouldFail.reverting.withMessage(
          this.signDoc(accTwo, this.signData, 'docHash', this.mockHash),
          'Failed to verify document hash.');
      });
    });//---end tag invalid document hash --->>

    describe('signer signature validation', function () {
      beforeEach(async function () {
        this.signerAddress = accThree;
        this.signData = await getSignData(this.signerMsg, this.signerAddress);
        this.mockHash = web3.utils.sha3('ethereum is the future');
        this.mockData = await getSignData(this.mockHash, accTwo);
      });

      it('throws if signature data provided by other accounts', async function () {
        //msg.sender is account accTwo
        //signature data is obtained from account accThree
        await shouldFail.reverting.withMessage(
          this.signDoc(accTwo, this.signData),
          'Signature verification failed');
      });

      it('throws for incorrect r, s and v value of ECDSA signature', async function () {
        await shouldFail.reverting.withMessage(
          this.signDoc(accTwo, this.signData, 'r', this.mockData.r),
          'Signature verification failed'
        );

        await shouldFail.reverting.withMessage(
          this.signDoc(accTwo, this.signData, 's', this.mockData.s),
          'Signature verification failed'
        );

        await shouldFail.reverting.withMessage(
          this.signDoc(accTwo, this.signData, 'v', new BN(123)),
          'Signature verification failed'
        );
      }); //----end tag throws for incorrect r, s and v---->
    });//----end tag signer signature validation---->

    describe('authorised signer only', function () {
      beforeEach(async function () {
        this.signerAddress = accFive;
        this.signData = await getSignData(this.signerMsg, this.signerAddress);
      });

      it('throws an error for unauthorised singer', async function () {
        await shouldFail.reverting.withMessage(
          this.signDoc(this.signerAddress, this.signData),
          'Provided address not authorised to sign the document.'
        );
      });
    });//---end tag authorised signer only ---->

    describe('Expiry Date', async function() {
      describe('date already expired', async function () {
        beforeEach(async function () {
          //tolerance second
          this.tolSec = new BN(1);
          this.start = await time.latest();
          this.end = this.start.add(time.duration.days(2));
          await time.increaseTo(this.end)
          this.signData = await getSignData(this.MainMsg, accTwo);
        });

        it('increase time to a time in the future', async function () {
          const now = await time.latest();
          now.should.be.bignumber.closeTo(this.end, this.tolSec);
        });

        it('throws and error if document date is already expired', async function () {
          await shouldFail.reverting.withMessage(
            this.signDoc(accTwo, this.signData),
            'Date already expired. Signing is disallowed now.'
          );
        });
      });//---end tag document signing date ---->
    });//---end tag expiry date ---->

    //multiple signing is not allowed
    describe('multiple signing disallowd', async function () {
      beforeEach(async function () {
        this.signData = await getSignData(this.MainMsg, accTwo);
        this.signDoc(accTwo, this.signData);
      });

      it('multiple signing for same document with same account is not allowed.', async function () {
        await shouldFail.reverting.withMessage(
          this.signDoc(accTwo, this.signData),
          'Already signed by this account. Multiple signing is not allowed.'
        );
      });
    });//---end tag multiple signing is not allowed ---->

  }); //----end tag signTheDoc---->
});//---END MAIN TAG --->

//validate if the sender is current user.
