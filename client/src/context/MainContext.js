import React from 'react';

export function initState() {
  return {
    loadWeb3: {
      web3: null,
      contract: null,
      networkId: null,
      account: null
    },
    hashFile: {
      hashOutput: null,
      nextBtn: {
        value: false,
        disable: false
      }
    },
    signHash: {
      account: null,
      signData: {
        r: null,
        s: null,
        v: null,
        docHash: null,
        signature: null
      },
      nextBtn: {
        value: false,
        disable: false
      }
    },
    signerListForm: {
      signerInfo: [],
      anyError: true,
      displayAddBtn: false,
      checkbox: {
        name: {
          firstLabel: 'only authorised signers',
          secondLabel: 'anyone can sign'
        },
        values: {}
      },
      nextBtn: {
        value: false,
        disable: false
      }
    },
    expiryDate: {
      selectedDate: null,
      // default value is set to negative which
      unixDate: null,
      checkbox: {
        name: {
          firstLabel: 'yes',
          secondLabel: 'no'
        },
        values: {}
      },
      nextBtn: {
        value: false,
        disable: false
      }
    },
    verifyAndDeploy: {
      txHash: ''
    }
  }
}

export const MainContext = React.createContext({});

