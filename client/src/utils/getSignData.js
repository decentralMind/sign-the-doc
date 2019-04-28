async function getSignData(web3, docHash, account) {
  var signature = await web3.eth.personal.sign(docHash, account, null);

  //Remove 0x prefix
  signature = signature.substr(2);
  const r = '0x' + signature.slice(0, 64)
  const s = '0x' + signature.slice(64, 128)
  const v = '0x' + signature.slice(128, 130)
  var v_decimal = web3.utils.toDecimal(v)

  //add 0x prefix
  signature = '0x' + signature;

  if (v_decimal < 27) {
    v_decimal += 27;
  }

  if (v_decimal !== 27 && v_decimal !== 28) {
    return {
      error: new Error('V should be either 27 or 28')
    }
  }

  return {
    r: r,
    s: s,
    v: v_decimal,
    docHash: docHash,
    signature: signature
  }
}

export default getSignData;
