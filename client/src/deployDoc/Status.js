import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import Loading from './Loading';

async function getTxData(web3, txHash) {
    const receipt = await web3.eth.getTransactionReceipt(txHash);
    return receipt;
}

function idToName(id) {
    const link = 'etherscan.io';
    if (id === 1) {
        return link
    } else if (id === 3) {
        return 'ropsten.' + link;
    } else if (id === 4) {
        return 'rinkeby.' + link;
    } else if (id === 42) {
        return 'kovan.' + link;
    } else {
        return 'unknown';
    }
}

class Status extends React.Component {
    state = {
        hash: '',
        web3: '',
        receipt: '',
        error: '',
        network: ''
    }

    componentDidMount = async () => {
        const getHash = this.props.location.hash;
        const hash = getHash.slice(1);
        const web3 = this.props.location.web3;
        const self = this;
        let network;

        if (web3) {
            network = await web3.eth.net.getNetworkType();
        }

        if (web3 && hash) {
            this.timer = setInterval(async function () {
                getTxData(web3, hash).then((result) => {
                    if (result) {
                        clearInterval(self.timer);
                        self.setState({
                            web3: web3,
                            hash: hash,
                            result: result,
                            network: network
                        });
                    }
                }).catch((error) => {
                    clearInterval(self.timer);
                    self.setState({
                        web3: web3,
                        hash: hash,
                        error: error,
                        network: network
                    });
                })
            }, 1000);
        }
    }

    render() {
        const state = this.state;
        const result = state.result;
        const error = state.error;
        const networkId = this.props.location.networkId;
        const getHash = this.props.location.hash;
        const hash = getHash.slice(1);
        const redirect = this.props.location.redirect;
        let networkLink;

        var getNetwork = idToName(networkId);
        let fullLink;

        if (getNetwork && getNetwork !== 'unknown') {
            fullLink = `https://${getNetwork}/tx/${hash}`;
            networkLink = (
                <div>
                    <h3>Deployed network link</h3>
                    <a href={fullLink} target='_blank' rel="noopener noreferrer">{fullLink}</a>
                </div>
            );

        } else {
            networkLink = (
                <div>
                    <p> Deployed to unknown or private network</p>
                </div>
            );
        }

        let showLoading;

        if (redirect && !result) {
            showLoading = (
                <div>
                    {networkLink}
                    <p>Waiting for Transaction Receipt from network</p>
                    <p>Taking too long..click above link to get additional information.</p>
                    <Loading />
                </div>
            );
        } else if (redirect && result) {
            showLoading = (
                <div>
                    {networkLink}
                    <p> Deployment successful </p>
                </div>
            );
        } else if (error) {
            showLoading = (
                <div>
                    <h4>Error:</h4>
                </div>
            );
        } else if (!redirect) {
            showLoading = (
                <div>
                    <h4>Please Proceed to Deploy Document first</h4>
                    <Link to="/deploy" >Deploy Document </Link>
                </div>
            );
        }

        return (
            <div>
                {showLoading}
                <div>
                    <table>
                        <tbody>
                            {result ? (

                                Object.keys(result).map((key, index) => {
                                    return (
                                        <tr key={index.toString()}>
                                            <td>
                                                {key} : {result[key]}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                    null
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default withRouter(Status);

