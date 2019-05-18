import SignTheDoc from "../contracts/SignTheDoc.json";
import getWeb3 from "../utils/getWeb3";
import { networkCheck, wrongNetMsg } from '../utils/helper';

export const loadWeb3 = async (updateLoadWeb3, liveProd = true) => {
    try {
        const web3 = await getWeb3();

        if (!web3) {
            return console.log('MetaMask not detected')
        }

        const networkId = await web3.eth.net.getId();

        //Currently only used for live production(github pages)
        if (liveProd) {
            if (!networkCheck(networkId)) {
                alert(wrongNetMsg);
                return false;
            }
        }

        const deployedNetwork = SignTheDoc.networks[networkId];

        const instance = new web3.eth.Contract(
            SignTheDoc.abi,
            deployedNetwork && deployedNetwork.address,
        );

        const account = await web3.eth.getCoinbase();

        let loadWeb3 = {};

        loadWeb3.web3 = web3;
        loadWeb3.networkId = networkId;
        loadWeb3.deployedNetwork = deployedNetwork;
        loadWeb3.contract = instance;
        loadWeb3.account = account;

        updateLoadWeb3(loadWeb3);

        return true;

    } catch (e) {
        return e
    }
}

export const checkWeb3 = async (context) => {
    if ((typeof window.ethereum == 'undefined') || (typeof window.web3 !== 'undefined')) {
        return await loadWeb3(context.updateLoadWeb3);
    }

    let web3 = context.loadWeb3.web3;
    let contract = context.loadWeb3.contract;
    let account = context.loadWeb3.account;

    if (!web3 || !contract || !account) {
        return await loadWeb3(context.updateLoadWeb3);
    }

    return true;
}
