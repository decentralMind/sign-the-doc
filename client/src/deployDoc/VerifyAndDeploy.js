import React from 'react';

import { MainContext } from '../context/MainContext';
import { makeSignerList, failWeb3Msg } from '../utils/helper';
import { checkWeb3 } from '../utils/initWeb3';
import { accessMsg } from '../utils/helper';
import { withRouter } from 'react-router-dom';
import { getCheckbox } from '../utils/getContextValues';

import moment from 'moment'

class VerifyAndDeploy extends React.Component {

  deploy = async () => {

    //This context is used for check purpose only during web3 initialization.
    const currentContext = this.context;

    await checkWeb3(currentContext);

    //loading updated new context context
    const context = this.context;
    const { web3, contract, networkId } = context.loadWeb3;

    if (!web3) {
      return console.log(failWeb3Msg);
    }

    const { account, signData } = context.signHash;

    const { signerInfo } = context.signerListForm;
    const signerList = makeSignerList(signerInfo);

    const expiryDate = context.expiryDate;
    const exFirstValue = getCheckbox(context, 'expiryDate', 'firstLabel');
    const exSecondValue = getCheckbox(context, 'expiryDate', 'secondLabel');

    if (exFirstValue) {
      const currentDate = moment().toDate();
      const selectedDate = moment(expiryDate.selectedDate);
      const diffInMinutes = selectedDate.diff(currentDate, 'minutes');

      if (diffInMinutes < 5 && diffInMinutes > 0) {
        alert('Document should be atleast open for 5 minutes. Please choose longer expiry date`');
        context.resetExpiryDate({});
        return;
      } else if (diffInMinutes <= 0) {
        alert('Provided expiry date is less then current date. Plese choose longer expiry date.');
        context.resetExpiryDate({});
        return;
      }
    }

    const deployAccount = await web3.eth.getCoinbase();

    //  Account used for deployment of this contract must be same for the account used for signing the hash of the file.

    if (deployAccount !== account) {
      const wrongAccMsg = `Account used for signing the document and deployment of this contract should be same.\n
      This issue is probably caused by switching to different account at Metamask. Press Ok to re-sign the document or press cancel to reselect the account`;
      
      if (window.confirm(wrongAccMsg)) {
        //Send to step1: to re sign the document.
        return context.updateHashOutput(context.hashFile.hashOutput);
      } else {
        return;
      }
    }

    let finalExpDate;
    if (exSecondValue) {
      finalExpDate = 0;
    } else {
      finalExpDate = expiryDate.unixDate;
    }

    contract.methods.createDocToSign(
      finalExpDate,
      signData.signature,
      signerList,
      signData.docHash,
      signData.r,
      signData.s,
      signData.v
    ).send({ from: account })
      .on('transactionHash', (hash) => {
        this.props.history.push({
          pathname: '/status',
          web3: web3,
          hash: hash,
          networkId: networkId,
          redirect: true
        });
      }).catch((error) => {
        console.log(error);
      });
  }

  render() {
    // //Expiry date checkbox values.
    const context = this.context;

    const exFirstValue = getCheckbox(context, 'expiryDate', 'firstLabel');
    const exSecondValue = getCheckbox(context, 'expiryDate', 'secondLabel');

    const slFirstValue = getCheckbox(context, 'signerListForm', 'firstLabel');
    const slSecondValue = getCheckbox(context, 'signerListForm', 'secondLabel');

    const expDate = context.expiryDate;
    const exNextBtn = context.expiryDate.nextBtn.value;

    let renderHashOutput
    let renderAccount;
    let renderSignature;
    let renderSignerList;
    let renderDate;
    let deploy;
    let blockMsg;
    // let accessMsg;

    if (!exNextBtn) {
      blockMsg = accessMsg(4);
    } else if (exNextBtn) {
      blockMsg = null;

      const hashOutput = context.hashFile.hashOutput;
      if (hashOutput) {
        renderHashOutput = (
          <section>
            <h4>Hash Output:</h4>
            {hashOutput}
          </section>
        );
      }

      const account = context.signHash.account;
      if (account) {
        renderAccount = (
          <section>
            <h4>Creator Account:</h4>
            {account}
          </section>
        );
      }

      const signature = context.signHash.signData.signature;
      if (signature) {
        renderSignature = (
          <section>
            <h4>Signature:</h4>
            {signature}
          </section>
        );
      }

      const signerInfo = context.signerListForm.signerInfo;
      if (signerInfo.length > 0 && slFirstValue) {
        renderSignerList = (
          <section>
            <h4>Authorised Signers:</h4>
            <i>Only following authorised signers can sign this document.</i>
            <ul>
              {signerInfo.map((signer, index) => {
                return (
                  <li key={index.toString()}>{signer.address}</li>
                )
              })
              }
            </ul>
          </section>
        );
      } else if (slSecondValue) {
        renderSignerList = (
          <section>
            <h4>Authorised Signers:</h4>
            <p>Authorised Signers not provided. Document can be sign by any one. </p>
          </section>
        );
      } else {
        renderSignerList = null;
      }

      //Expiry date checkbox label 'yes' is selected to include date.
      if (exFirstValue && expDate) {
        const selectedDate = context.expiryDate.selectedDate;
        const dateFormat = moment(selectedDate).format("dddd, MMMM Do YYYY, h:mm:ss a");

        renderDate = (
          <section>
            <article>
              <h4>Expiry date:</h4>
              <p>{dateFormat}</p>
            </article>

            <article>
              <h4>Unix timestamp:</h4>
              <p>{context.expiryDate.unixDate}</p>
            </article>
          </section>
        )
      } else if (exSecondValue) {
        renderDate = (
          <section>
            <article>
              <h4>Expiry date:</h4>
              <p>Expiry date not provided. Document is open for signing indefinetly.</p>
            </article>
          </section>
        );
      }

      deploy = (
        <div>
          <button onClick={this.deploy}>Deploy</button>
        </div>
      );
    }
    return (
      <div>
        {blockMsg}
        {renderHashOutput}
        {renderAccount}
        {renderSignature}
        {renderSignerList}
        {renderDate}
        {deploy}
      </div>
    );
  }
}

VerifyAndDeploy.contextType = MainContext;

//Create Array 
export default withRouter(VerifyAndDeploy);