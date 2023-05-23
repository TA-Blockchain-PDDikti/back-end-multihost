
const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const fs = require('fs');

const getCcp = (organizationName) =>{
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

const getUserAttrs = async(username) => {
   
    const ccp = getCcp('he1')
    const wallet = await getWallet()

    // Create a new CA client for interacting with the CA.
    const caURL = ccp.certificateAuthorities[`ca.he1.example.com`].url;
    const ca = new FabricCAServices(caURL, undefined, `ca.he1.example.com`);
    
    // Check to see if we've already enrolled the admin user.
    const adminIdentity = await wallet.get('admin');
    if (!adminIdentity) {
        throw "Admin network does not exist"
    }

    // build a user object for authenticating with the CA
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');

    // retrieve the registered identity 
    const identityService = ca.newIdentityService()
    const userIdentity = await identityService.getOne(username, adminUser)

    // Get user attr 
    const userAttrs = userIdentity.result.attrs

    console.log(userAttrs)
    return userAttrs
}

module.exports = {getCcp, getWallet, connectToNetwork, getUserAttrs}