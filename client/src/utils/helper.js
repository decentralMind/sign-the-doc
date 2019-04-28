import React from 'react';

export const failWeb3Msg = 'Wrong Network selection or MetaMask not installed, try selecting different network or login/install MetaMask';

//It will be only used on live production.
export const wrongNetMsg = 'This contract is not deployed on this network. Please switch to one of the following network: Ropsten, Rinkeby or Kovan.'

export function hasKey(obj, key) {
  if (obj.hasOwnProperty(key))
    return true;
  return false;
}

export function accessMsg(step) {
  return (
    <div>
      <p> Complete Step:{step} to access this content.</p>
    </div>
  );
}

export function proceedMsg(step) {
  return (
    <div>
      <p><i>Click Next to proceed to {step} below.</i></p>
    </div>
  );
}

export function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop))
      return false;
  }
  return true;
}

export function makeSignerList(signerInfo) {
  let signerList = [];
  for (let i = 0; i < signerInfo.length; i++) {
    if (!signerInfo[i].error && signerInfo[i].address.length > 0) {
      signerList.push(signerInfo[i].address);
    };
  }
  return signerList;
}

export function networkCheck(id) {
  if (id !== 3 && id !== 4 && id !== 42) {
      return false;
  } else {
      return true;
  }
}


