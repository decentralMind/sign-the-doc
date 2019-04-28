import React from 'react';

import InputAndGetInfo from '../shared/InputAndGetInfo';
import DownloadMetaMask from '../shared/DownloadMetaMask';

import getSignData from '../utils/getSignData';

import { SignInfoContext } from '../context/SignInfoContext';
import { withRouter } from 'react-router-dom';
import { checkWeb3 } from '../utils/initWeb3';
import { accessMsg, failWeb3Msg } from '../utils/helper';
import { RenderDocInfo } from '../shared/DisplayInfo';

import moment from 'moment';

class signDoc extends React.Component {

    componentDidMount = async () => {
        const { uploadHash, inputHash } = this.context;

        if (uploadHash || inputHash) {
            this.context.resetState();
        }

        await checkWeb3(this.context);

        const { web3 } = this.context.loadWeb3;

        if (!web3) {
            return console.log(failWeb3Msg);
        }
    }

    handleClick = async () => {
        const context = this.context;

        const { web3 } = context.loadWeb3;
        const { docData, uploadHash, inputHash } = context;

        if (!docData.signature) {
            return alert(`Could not retrieve deployed document data, try uploading file or enter hash again.`)
        }

        if (web3 && docData.signature) {

            //Todo
            //Find simpler method.
            //web3.eth.getCoinbase method is not suitable, it returns address in lower case format.
            const allAccounts = await web3.eth.getAccounts();
            const account = allAccounts[0];

            const currentDate = moment().unix();
            const expiryDate = docData.expiryDate.toNumber();
            const diffDate = expiryDate - currentDate;

            if (!account) {
                return alert('web3 account not detected, try login/install to MetaMask');
            }

            if (expiryDate > 0 && diffDate < 1) {
                return alert('Signing time period already expired. This contract is closed for signing.')
            }

            const authList = docData.authorisedSigners;
            if (authList.length > 0 && !authList.includes(account)) {
                return alert(`This account:${account} is not authorised to sign.`)
            }

            const whoSigned = docData.whoSigned;
            if (whoSigned.length > 0 && whoSigned.includes(account)) {
                return alert(`Already signed by this account: ${account}. Multiple signing by same account is not allowed.`)
            }

            /*Todo:
                >Need reliable way to detect generated hash on state.
                >Possibly update the state with hash name and load from it.
            */
            let currentHash;
            if (uploadHash) {
                currentHash = uploadHash;
            } else {
                currentHash = inputHash;
            }

            const signData = await getSignData(web3, currentHash, account);

            signData.signedAccount = account;

            context.updateSignData(signData);
        }
    }

    deployClick = async () => {

        const currentContext = this.context;

        await checkWeb3(currentContext);

        //Loading with new context after checkWeb3 initialize web3 and update state.
        const { web3, contract, networkId } = this.context.loadWeb3;
        const { signData } = this.context;

        if (!web3) {
            return console.log(failWeb3Msg);
        }

        const allAccounts = await web3.eth.getAccounts();
        const account = allAccounts[0];

        const { creatorAddress } = this.context.docData;

        //Todo
        //Find simpler method.
        //web3.eth.getCoinbase method is suitable, it returns address in lower case format.
        if (signData.signedAccount !== account) {
            return alert(`Account used for signing and deployment should be same.\n
            Signed Account: ${signData.signedAccount} \n
            Trying to deploy with Account: ${account}`)
        }

        contract.methods.signTheDoc(
            creatorAddress,
            signData.docHash,
            signData.r,
            signData.s,
            signData.v,
            signData.signature,
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
                alert(JSON.stringify(error));
            });
    }

    render() {
        
        if (!window.ethereum) {
            return (
                <div>
                    <DownloadMetaMask />
                </div>
            );
        }

        const { docData, signData } = this.context;

        let signProcess;

        if (docData.docHash && docData.signature) {
            signProcess = (
                <div>
                    {RenderDocInfo(docData)}
                    <p>Click sign if above information is correct</p>
                    <button onClick={this.handleClick}>Sign</button>
                </div>
            )
        } else {
            signProcess = accessMsg(1)
        }

        let deploy;
        if (signData.docHash && signData.signature) {
            deploy = (
                <div>
                    <p>Hash: {signData.docHash}</p>
                    <p>Signature:{signData.signature}</p>
                    <p>Click deploy publish the signature</p>
                    <button onClick={this.deployClick}>Deploy</button>
                </div>
            )
        } else {
            deploy = accessMsg(2);
        }
        return (
            <div>
                <section>
                    <h3>Step 1: Get Document Information</h3>
                    <InputAndGetInfo />
                </section>

                <section>
                    <h3>Step 2: Verify And Sign </h3>
                    {signProcess}
                </section>

                <section>
                    <h3>Step 3: Verify And Deploy </h3>
                    {deploy}
                </section>
            </div>
        );
    }
}

signDoc.contextType = SignInfoContext;
export default withRouter(signDoc);