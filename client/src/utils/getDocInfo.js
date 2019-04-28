async function getDocInfo(contract, account, hash) {
    const getDocData = await contract.methods.getDocData(hash)
        .call({ from: account });

    if (getDocData.docHash) {
        return getDocData;
    } else {
        return false
    }
}

export default getDocInfo;

