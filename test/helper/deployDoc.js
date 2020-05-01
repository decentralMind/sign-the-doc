
const { BN } = require('./setup');

function deployDoc(modify, value, expiryDate, signData, authorisedSignerList) {
  var expiryDate = expiryDate;
  var signature = signData.signature;
  var authorisedSignerList = authorisedSignerList;
  var docHash = signData.docHash;
  var r = signData.r;
  var s = signData.s;
  var v = signData.v;

  if (modify && !value) {
    throw new Error(`${value} type is not supported`);
  } else if (!modify && value) {
    throw new Error(`${modify} type is not supported`);
  } else if (modify && value) {
    switch (modify) {
      case 'expiryDate':
        expiryDate = new BN(value);
        break;

      case 'signature':
        signature = value;
        break;

      case 'authorisedSignerList':
        authorisedSignerList = value;
        break;

      case 'docHash':
        docHash = value;
        break;

      case 'r':
        r = value;
        break;

      case 's':
        s = value;
        break;

      case 'v':
        v = new BN(value);
        break;

      default:
        throw new Error(`Could not find any variable named ${modify}`);
    }
  }

  return {
    expiryDate: expiryDate,
    signature: signature,
    authorisedSignerList: authorisedSignerList,
    docHash: docHash,
    r: r,
    s: s,
    v: v
  };
}

module.exports = deployDoc;
