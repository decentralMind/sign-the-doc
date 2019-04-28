import React from 'react';

import FileToHash from './FileToHash';
import SignerListForm from './SignerListForm';
import ExpiryDate from './ExpiryDate';
import SignHash from './SignHash';
import VerifyAndDeploy from './VerifyAndDeploy';
import DownloadMetaMask from '../shared/DownloadMetaMask';

import { MainContext } from '../context/MainContext';
import { checkWeb3 } from '../utils/initWeb3';

class DeployDoc extends React.Component {

  componentDidMount = async () => {
    this.context.resetState();
    await checkWeb3(this.context);
  }

  render() {
    if(!window.ethereum) {
      return (
        <div>
         <DownloadMetaMask />
         </div>
      );
    }
    return (
      <div>
        <section>
          <h3>Step1: Hash The File </h3>
          <FileToHash />
        </section>
        <section>
          <h3>Step2: Signing process</h3>
          <SignHash />
        </section>
        <section>
          <h3>Step3: Who can sign the document? </h3>
          <SignerListForm />
        </section>
        <section>
          <h3>Step4: Include expiry Date? </h3>
          <ExpiryDate />
        </section>
        <section>
          <h3>Step5: Verify and Deploy </h3>
          <VerifyAndDeploy />
        </section>
      </div >
    );
  }
}

DeployDoc.contextType = MainContext;
export default DeployDoc;
