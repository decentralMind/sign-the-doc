import React from "react";
import getSignData from '../utils/getSignData';
import { MainContext } from "../context/MainContext.js";
import { accessMsg, proceedMsg, failWeb3Msg } from '../utils/helper';
import { checkWeb3 } from '../utils/initWeb3';

import NextButton from './NextButton';

class SignHash extends React.Component {

  handleClick = async (e) => {
    await checkWeb3(this.context);
    const { web3 } = this.context.loadWeb3;

    if (!web3) {
      return console.log(failWeb3Msg);
    }

    const hashOutput = this.context.hashFile.hashOutput;
    if (!hashOutput) {
      return alert('Please visit step:1 and choose the file');
    }

    const currentAccount = await web3.eth.getCoinbase();

    const signData = await getSignData(web3, hashOutput, currentAccount);

    if (!signData.signature) {
      return alert('Please follow the instruction carefully');
    }

    this.context.updateSignHash(signData, currentAccount);
  }

  handleSubmit = (e) => {
    e.preventDefault();
  }

  render() {
    const context = this.context;
    const signature = context.signHash.signData.signature;
    const fileName = context.hashFile.fileName;

    const hashFile = context.hashFile;

    let signHash;
    let showResult;

    if (signature) {
      showResult = (
        <div>
          <p>SignedData: {hashFile.hashOutput}</p>
          <p>Signature: <strong>{signature}</strong></p>
          <p><i>Signing Process Success:</i></p>
          {proceedMsg('Step3')}
          <NextButton toUpdate="signHash" />
        </div>
      );
    } else {
      showResult = null;
    }

    if (hashFile.nextBtn.value && !signature) {
      signHash = (
        <div>
          <p><strong>Click sign</strong> below to sign the calculated hash of the file name: <strong>{fileName}</strong></p>
          <p>Calculated Hash:<strong>{hashFile.hashOutput}</strong></p>
          <div>
            <button id='sign-hash' onClick={this.handleClick}> Sign </button>
          </div>
        </div>
      );
    } else if (!hashFile.nextBtn.value && !signature) {
      signHash = accessMsg('1');
    }
    return (
      <div>
        {signHash}
        {showResult}
      </div>
    );
  }
}

SignHash.contextType = MainContext;
export default SignHash;
