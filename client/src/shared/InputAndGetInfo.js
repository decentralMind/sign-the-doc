import React from 'react';
import HashFile from '../shared/HashFile';
import { SignInfoConsumer } from '../context/SignInfoProvider';
import { SignInfoContext } from '../context/SignInfoContext';
import inputHashValid from '../utils/InputHashValid';
import { checkWeb3 } from '../utils/initWeb3';
import { failWeb3Msg } from '../utils/helper';

class InputAndGetInfo extends React.Component {

    handleClick = async (hashStateKey) => {
        const currentContext = this.context;

        await checkWeb3(currentContext);

        //loading updated new context context
        const context = this.context;
        const { web3, contract, account } = context.loadWeb3;

        if (!web3) {
            return console.log(failWeb3Msg);
        }

        const hashOutput = context[hashStateKey];
        let docData = { ...this.context.docData };

        const errorMsg = `Provided hash:\n ${hashOutput},\n is not deployed on this network, try selecting different network or provide different Hash. If you have just deployed the document please wait for while and try again.
        `
        const getData = await contract.methods.getDocData(hashOutput).call({
            from: account
        });

        if (!getData.signature) {
            return alert(errorMsg);
        } else {
            docData.docHash = getData.docHash;
            docData.creatorAddress = getData.creatorAddress;
            docData.expiryDate = getData.expiryDate;
            docData.creationDate = getData.creationDate;
            docData.signature = getData.signature;
            docData.authorisedSigners = getData.authorisedSigners;
            docData.whoSigned = getData.whoSigned;

            context.updateDocData(docData);
        }
    }

    handleChange = (e) => {
        const context = this.context;
        const hashValue = e.target.value;
        //remove excess space from front and back
        const trimValue = hashValue.trim();
        const validate = inputHashValid(trimValue);
        context.updateInputHash(trimValue, validate);
    }

    render() {
        return (
            <div>
                <SignInfoConsumer>
                    {({ inputHash, inputHashError, uploadHash, updateUploadHash }) => (
                        <div>
                            <section>
                                <h4><i>Upload Document/File</i></h4>
                                <HashFile updaterFunc={updateUploadHash} reset={inputHash} />

                                {uploadHash ? (
                                    <div>
                                        <p> Hash generated: <strong>{uploadHash}</strong></p>
                                        <button onClick={() => this.handleClick("uploadHash")}>Get Info</button>
                                    </div>
                                ) : (
                                        null
                                    )}
                            </section>
                            <section>
                                <h1> OR </h1>
                                <label>
                                    <h4><i>Enter Hash Of The Document/File:</i></h4>
                                    <input type="text" value={inputHash} style={{ width: "500px" }} onChange={this.handleChange} />
                                </label>
                                <br />
                                <span style={{ color: "red" }}>{
                                    (inputHashError && inputHashError !== true) ? (
                                        "Error : " + inputHashError
                                    ) : (
                                            null
                                        )
                                }
                                </span>
                                <br />
                                {(inputHash && !inputHashError) ? (
                                    <button name="inputHash" onClick={() => this.handleClick("inputHash")}>Get Info</button>
                                ) : (
                                        null
                                    )}
                            </section>
                        </div>
                    )}
                </SignInfoConsumer>
                <br />
            </div>
        );
    }
}

InputAndGetInfo.contextType = SignInfoContext;
export default InputAndGetInfo;

