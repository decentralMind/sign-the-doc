import Web3 from "web3";

const getWeb3 = async (provider = null) => {

  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    try {
      // Request account access if needed
      await window.ethereum.enable()
      // Acccounts now exposed
      return (web3);
    } catch (error) {
      console.log(error);
      return (error);
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    // Use Mist/MetaMask's provider.
    const web3 = window.web3;
    //console.log("Injected web3 detected.");
    return (web3);
  }
  // Fallback to localhost provider if provided.
  else if (provider) {
    const LoadProvider = new Web3.providers.HttpProvider(
      provider
    );
    const web3 = new Web3(LoadProvider);
    return (web3);
  } else {
    return alert('Fail to load web3 Account, Please Install/Login to MetaMask')
  }
}

export default getWeb3;
