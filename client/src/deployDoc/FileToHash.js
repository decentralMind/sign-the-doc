import React from "react";
import { keccak256 } from 'js-sha3';
import { MainContext } from '../context/MainContext';
import { checkWeb3 } from '../utils/initWeb3';
import { proceedMsg, failWeb3Msg } from '../utils/helper';
import NextButton from "./NextButton";
import isHashUnique from '../utils/hashUnique';


class FileToHash extends React.Component {
  state = {
    progress: ''
  }

  userConsent = (event) => {
    const context = this.context;
    const { hashOutput } = context.hashFile;

    const file = event.target.files[0];

    if (hashOutput && file) {
      if (window.confirm('Warning: All entered data will be reset')) {
        this.handleChange(event);
      }
    } else if (!hashOutput) {
      this.handleChange(event);
    }
  }

  handleChange = (event) => {
    let reader = new FileReader();
    const file = event.target.files[0];

    if (!file) {
      return alert('Please select at least one file.')
    }

    const batch = 1024 * 1024 * 2;
    let start = 0;
    let fileName = file.name;
    const total = file.size;
    let current = keccak256;
    const self = this;

    let end;

    reader.onload = function (event) {
      try {
        current = current.update(event.target.result);
        asyncUpdate();
      } catch (e) {
        console.log('error', e)
      }
    };

    var asyncUpdate = function () {
      if (total === 0) {
        return alert("Current uploaded file is empty.File size needs to be greater than 0 byte");
      } else if (start < total && total > 0) {
        let progressInfo = `hashing...${(start / total * 100).toFixed(2)} %`;
        self.setState({
          progress: progressInfo
        });
        end = Math.min(start + batch, total);
        reader.readAsArrayBuffer(file.slice(start, end));
        start = end;
      } else {
        const hashOutput = '0x' + current.hex();
        self.setState({
          progress: '100%'
        }, () => self.updateMainContext(hashOutput, fileName, null));
      }
    };
    asyncUpdate();
  }

  updateMainContext = async (hashOutput, fileName, nextBtnValue) => {
    await checkWeb3(this.context);

    const { web3, contract, account } = this.context.loadWeb3;

    if (!web3) {
      return console.log(failWeb3Msg);
    }

    try {
      const unique = await isHashUnique(contract, account, hashOutput);

      if (!unique) {
        return alert(`Current file Hash already exist on the network.Someone has already deployed hash of this file.Hash must be unique.Please choose different file or modifiy the content of the file slightly to produce different hash and try again.`);
      }

      if (unique) {
        this.context.updateHashOutput(hashOutput, fileName, nextBtnValue);
      }

    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const complete = '100%';
    const hashOutput = this.context.hashFile.hashOutput;

    let progress = this.state.progress;
    let showProgress;

    if (progress && progress !== complete) {
      showProgress = (
        <div>
          <p>Progress: {this.state.progress}</p>
        </div>
      );
    } else if ((progress === complete) && hashOutput) {
      showProgress = (
        <div>
          <p>Progress: {this.state.progress}</p>
          <p><strong>Hash generated: {hashOutput}></strong></p>
          {proceedMsg('Step2')}
          <NextButton toUpdate="hashFile" />
        </div>
      );
    } else {
      progress = null;
    }

    return (
      <div>
        <form>
          <label>
            Select a File:
          <input type="file" onChange={this.userConsent}
              onClick={(event) => {
                event.target.value = null
              }} />
          </label>
        </form>
        <div>
          {showProgress}
        </div>
      </div>
    );
  }
}

FileToHash.contextType = MainContext;
export default FileToHash;
