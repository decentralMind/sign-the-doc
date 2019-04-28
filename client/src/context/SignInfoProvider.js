import React from 'react';
import { docDataState, SignInfoContext } from './SignInfoContext';

class SignInfoProvider extends React.Component {
    constructor(props) {
        super(props);

        this.updateLoadWeb3 = (web3Data) => {
            this.setState({
                loadWeb3: web3Data
            });
        }

        this.updateUploadHash = (hashOutput, fileName) => {
            const { loadWeb3 } = this.state;
            this.setState({
                ...docDataState(),
                loadWeb3: loadWeb3,
                uploadHash: hashOutput,
                fileName: fileName
            });
        }

        this.updateInputHash = (hashOutput, error) => {
            const { uploadHash } = this.state;
            /*
             Todo: 
             There is no point of updating inputHashError with empty string('') if 
             it's value is set to empty string already.

             Break this function to make it simpler.
            */
            if (uploadHash && error) {
                this.setState({
                    ...docDataState(),
                    inputHash: hashOutput,
                    inputHashError: error
                });
            } else if (uploadHash && !error) {
                this.setState({
                    ...docDataState(),
                    inputHash: hashOutput,
                    inputHashError: ''
                });
            } else if (!uploadHash && error) {
                this.setState({
                    inputHash: hashOutput,
                    inputHashError: error
                });
            } else if (!uploadHash && !error) {
                this.setState({
                    inputHash: hashOutput,
                    inputHashError: ''
                });
            }
        }

        this.updateDocData = (docData) => {
            this.setState({
                docData: docData
            });
        }

        this.resetState = () => {
            let loadWeb3 = { ...this.state.loadWeb3 };
            this.setState({
                ...docDataState(),
                loadWeb3: loadWeb3
            });
        }

        this.updateSignData = (signData) => {
            this.setState({
                signData: signData
            });
        }

        this.updaterFunction = {
            updateLoadWeb3: this.updateLoadWeb3,
            updateInputHash: this.updateInputHash,
            updateUploadHash: this.updateUploadHash,
            updateDocData: this.updateDocData,
            updateHashAndReset: this.updateHashAndReset,
            updateSignData: this.updateSignData,
            resetState: this.resetState
        }
        this.state = {
            ...docDataState(),
            ...this.updaterFunction
        };
    }

    render() {
        // console.log("+++++++SignInfo state++++++++", this.state);
        return (
            <div>
                <SignInfoContext.Provider value={this.state}>
                    {this.props.children}
                </SignInfoContext.Provider>
            </div >
        );
    }
}

const SignInfoConsumer = SignInfoContext.Consumer;

export { SignInfoProvider, SignInfoConsumer }