require('dotenv').config()
const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");

var mnemonic = process.env.SEED12;

// Infura ropsten end point.
var ropstenEndPoint = 'https://' + process.env.ROPSTEN;

//Infura rinkeby end point.
// var rinkebyEndPoint =  'https://' + process.env.RINKEBY;

// // Infura kovan end point.
// var kovanEndPoint = 'https://' + process.env.KOVAN;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, ropstenEndPoint);
      },
      network_id: 3,
    },

    // Comment out below to deploy on additional networks.

    // rinkeby: {
    //   provider: function() {
    //     return new HDWalletProvider(mnemonic, rinkebyEndPoint);
    //   },
    //   network_id: 4,
    // },
    // kovan: {
    //   provider: function() {
    //     return new HDWalletProvider(mnemonic, kovanEndPoint);
    //   },
    //   network_id: 42,
    // }
  }
}

