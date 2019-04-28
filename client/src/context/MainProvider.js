import React from 'react';
import { initState, MainContext } from './MainContext';

class MainProvider extends React.Component {
  constructor(props) {
    super(props);

    this.updateHashOutput = (hashOutput, fileName) => {
      let newState = {
        ...initState(),
        ...this.updaterFunction
      };
      newState.loadWeb3 = this.state.loadWeb3;
      newState.hashFile.hashOutput = hashOutput;
      newState.hashFile.fileName = fileName;
      this.setState(newState);
    };

    this.updateSignerListCheckBox = (checkboxValues) => {

      //signerListForm(slf)
      let slf = this.state.signerListForm;

      //Todo:
      //Use getCheckBox
      const signerInfo = slf.signerInfo;
      const slFirstLabel = slf.checkbox.name.firstLabel;
      const slSecondLabel = slf.checkbox.name.secondLabel;
      const slFirstValue = checkboxValues[slFirstLabel];
      const slSecondValue = checkboxValues[slSecondLabel];

      if (slFirstValue && signerInfo.length === 0) {

        // slf.checkbox.values = checkboxValues;
        this.intializeForm(checkboxValues);
      } else if (slSecondValue && signerInfo.length && !signerInfo[0].error) {
        if (window.confirm('Warning: All entered address will be reset')) {
          this.resetSignerListCheckBox(checkboxValues);
        }
      } else {
        this.resetSignerListCheckBox(checkboxValues);
      }
    };

    this.resetSignerListCheckBox = (checkboxValues) => {
      let newState = {
        ...initState(),
        ...this.updaterFunction
      };
      //Load web3 state
      newState.loadWeb3 = this.state.loadWeb3;
      newState.hashFile = this.state.hashFile;
      newState.signHash = this.state.signHash;
      newState.signerListForm.checkbox.values = checkboxValues;

      this.setState(newState);
    };

    this.intializeForm = (checkboxValues) => {
      let newState = {
        ...initState(),
        ...this.updaterFunction
      };
      //Load web3 state
      newState.loadWeb3 = this.state.loadWeb3;
      newState.hashFile = this.state.hashFile;
      newState.signHash = this.state.signHash;

      newState.signerListForm.checkbox.values = checkboxValues;

      /*
      It is the initialization process of address input field.
      During initialization process Add New Signer button is enabled and shown.
      The state doesn't have any entry of signer address yet.
      */

      //Error key is set to true because empty address is consider invalid.
      const newField = { address: '', error: true };

      //Display first input field.
      newState.signerListForm.signerInfo = [...newState.signerListForm.signerInfo, newField];

      //Show Add New Signer button.
      newState.signerListForm.displayAddBtn = true;
      newState.signerListForm.openSig = false;

      this.setState(newState)
    }

    this.resetExpiryDate = (checkboxValues) => {
      let newState = {
        ...initState(),
        ...this.updaterFunction
      };
      //Load web3 state
      newState.loadWeb3 = this.state.loadWeb3;
      newState.hashFile = this.state.hashFile;
      newState.signHash = this.state.signHash;
      newState.signerListForm = this.state.signerListForm;
      newState.expiryDate.checkbox.values = checkboxValues;

      this.setState(newState);
    };

    this.updateExpiryDate = (expiryDate) => {
      this.setState({
        expiryDate: expiryDate
      });
    };

    this.updateSignerListForm = (signerListForm) => {
      const signerInfo = this.state.signerListForm.signerInfo;

      // When last remaining entered address is removed.
      // SignerListForm checkbox value is restored to it's original state.
      if (signerInfo.length === 0) {
        const checkboxValues = {};
        this.resetSignerListCheckBox(checkboxValues);
      }

      this.setState({
        signerListForm: signerListForm
      });
    };

    this.updateLoadWeb3 = (web3Data) => {
      this.setState({ loadWeb3: web3Data });
    };

    this.updateSignHash = (signData, account) => {
      const signHash = { ...this.state.signHash };
      signHash.signData = signData;
      signHash.account = account;
      this.setState({ signHash });
    }

    this.updateNextButton = (toUpdate, reset = false) => {
      let stateValue = this.state[toUpdate];

      if (!stateValue) {
        throw new Error(`${toUpdate} key doesn't exit in state`);
      } else if (!reset) {
        stateValue.nextBtn.value = true;
        stateValue.nextBtn.disable = true;
        this.setState({
          [toUpdate]: stateValue
        });
      } else if (reset) {
        stateValue.nextBtn.value = false;
        stateValue.nextBtn.disable = false;
      }
    }

    this.updateVerifyAndDeploy = (txHash) => {
      //VerifyAndDeploy
      let vd = { ...this.state.verifyAndDeploy };
      vd.txHash = txHash;

      // Reset state and only update VerifyAndDeploy state.
      this.setState({
        verifyAndDeploy: vd,
      }, () => this.redirectToStatus());
    }

    this.resetState = () => {
      const loadWeb3 = { ...this.state };
      this.setState({
        ...initState(),
        loadWeb3: loadWeb3
      });
    }

    this.updaterFunction = {
      updateLoadWeb3: this.updateLoadWeb3,
      updateHashOutput: this.updateHashOutput,
      updateSignerListCheckBox: this.updateSignerListCheckBox,
      resetExpiryDate: this.resetExpiryDate,
      updateSignerListForm: this.updateSignerListForm,
      updateExpiryDate: this.updateExpiryDate,
      updateSignHash: this.updateSignHash,
      updateNextButton: this.updateNextButton,
      updateVerifyAndDeploy: this.updateVerifyAndDeploy,
      resetState: this.resetState
    }

    this.state = {
      ...initState(),
      ...this.updaterFunction
    };

    this.redirectToStatus = () => {
      const state = this.state;
      const txHash = state.verifyAndDeploy.txHash;
      const web3 = state.loadWeb3.web3;
      this.props.history.push({
        pathname: '/status',
        txHash: txHash,
        web3: web3
      });
    }
  }
  render() {
    // console.log("+++++++Main State++++++++", this.state);
    return (
      <div>
        <MainContext.Provider value={this.state}>
          {this.props.children}
        </MainContext.Provider>
      </div >
    );
  }
}

const MainConsumer = MainContext.Consumer;

export { MainProvider, MainConsumer }

