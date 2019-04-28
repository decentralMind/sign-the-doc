import React from 'react';
import metaMaskLogo from './metaMaskLogo.png'

export default function DownloadMetaMask() {
    return (
        <div>
            <p>Please install web3 client METAMASK to continue..</p>
            <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">
                <img src={metaMaskLogo} alt="MetaMask logo"  style={{width:'150px', height:'50px'}}/>
            </a>
        </div>
    );
}