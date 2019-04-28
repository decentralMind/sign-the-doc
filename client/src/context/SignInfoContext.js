import React from 'react';

export function docDataState() {
    return {
        loadWeb3: {
            web3: '',
            contract: '',
            account: '',
            networkId: ''
        },
        uploadHash: '',
        inputHash: '',
        inputHashError: '',
        fileName: '',
        docData: {
            docHash: '',
            creatorAddress: '',
            expiryDate: '',
            creationDate: '',
            signature: '',
            authorisedSigners: [],
            whoSigned: []
        },
        signData: {
            r: null,
            s: null,
            v: null,
            docHash: null,
            signature: null,
            signedAccount: null
        }
    }
}

export const SignInfoContext = React.createContext({});
