import React from "react";
import { keccak256 } from 'js-sha3';

const initState =  () => {
  return {
    progress: '',
    hashOutput:'',
    fileName:''
  }
}

class HashFile extends React.Component {
  state = {
    ...initState()
  }
  
  
  componentDidUpdate = (prevProps) => {
    //Reset the state hash is manually type or provided through input box.
    if(prevProps.reset !== this.props.reset) {
      const {hashOutput, progress} = this.state;
      if(hashOutput && progress) {
        this.setState({
          ...initState()
        });
      }
    }
  }

  userConsent = (event) => {
    const { hashOutput } = this.state;

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
    const updaterFunc = this.props.updaterFunc;  
    let reader = new FileReader();
    const file = event.target.files[0];
    
    if (!file) {
      return;
    }

    const batch = 1024 * 1024 * 2;
    let start = 0;
    const fileName = file.name;
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
        self.setState({
          error: `file size needs to be greater than 0 byte`
        });
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
          progress: '100%',
          hashOutput: hashOutput,
          fileName: fileName
        }, () => self.updateContextHashOutput(updaterFunc));
      }
    };
    asyncUpdate();
  } 

  updateContextHashOutput = (updaterFunc) => {
    const { hashOutput, fileName } = this.state;
    updaterFunc(hashOutput, fileName);
  }

  render() {
    const complete = '100%';
    const { hashOutput } = this.state;
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

export default HashFile;
