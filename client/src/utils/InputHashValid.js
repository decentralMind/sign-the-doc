
function isHashValid(address) {
    const myRe = /^0x[a-fA-F0-9]{64}$/;
    if (myRe.test(address)) {
        return true;
    } else {
        return false;
    }
}

function hasSpace(address) {
    const myRe = /\s/g;
    if (myRe.test(address)) {
        return true;
    } else {
        return false;
    }
}

function inputHashValid(inputHash) {
    //remove any first and last space
    const hash = inputHash.trim();
    const prefix = hash.slice(0, 2);

    if (hash.length === 0) return true
    if (prefix !== "0x") return 'address must start with 0x prefix.'
    if (hasSpace(hash)) return 'address should not contain any space character.'
    if (hash.length !== 66) return 'address length should be 66 including 0x prefix at the front.'
    if (!isHashValid(hash)) return 'address should be in correct hex format.'

    return false;
}


export default inputHashValid;
