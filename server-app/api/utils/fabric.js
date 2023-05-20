
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const getCcp = async(organizationName) =>{
    // load the network configuration

    const ccpPath = path.resolve(__dirname, '..', '..', '..', 'organizations', 'peerOrganizations', `${organizationName}.example.com`, `connection-${organizationName}.json`);
    return JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
}

const getWallet = async() => {
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    return await Wallets.newFileSystemWallet(walletPath);
}

const connectToNetwork = async(organizationName, channelName, chaincodeName, user) => {
        const ccp = await getCcp(organizationName)
        const wallet = await getWallet()

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(user);
            if (!identity) {
                throw `An identity for the user ${user} does not exist in the wallet`
            }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: user, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(channelName);

        // Get the contract from the network.
        const contract = network.getContract(chaincodeName);

        return {gateway, network, contract}

}


module.exports = {getCcp, getWallet, connectToNetwork}