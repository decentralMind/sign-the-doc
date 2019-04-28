async function isHashUnique(contract, account, hash) {

    const getDocData = await contract.methods.getDocData(hash)
        .call({ from: account });

    if (getDocData && getDocData.docHash === hash) {
        return false;
    } else {
        return true;
    }
}

export default isHashUnique;

