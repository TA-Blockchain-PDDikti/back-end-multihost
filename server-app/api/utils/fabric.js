
const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const fs = require('fs');
const sha = require('js-sha256');
const asn = require('asn1.js');
const { BlockDecoder } = require('fabric-common');

const getCcp = (organizationName) =>{
    // load the network configuration
    const ccpPath = path.resolve(__dirname, '..', '..', '..', 'organizations', 'peerOrganizations', `${organizationName.toLowerCase()}.example.com`, `connection-${organizationName.toLowerCase()}.json`);
    return JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
}

const getWallet = async(org) => {
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet', org.toLowerCase());
    return await Wallets.newFileSystemWallet(walletPath);
}

const connectToNetwork = async(organizationName, chaincodeName, user) => {
    const ccp = await getCcp(organizationName)
    const wallet = await getWallet(organizationName)

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get(user);
        if (!identity) {
            throw `An identity for the user ${user} does not exist in the wallet`
        }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: user, discovery: { enabled: true, asLocalhost: true } });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('academicchannel');

    // Get the contract from the network.
    const contract = network.getContract(chaincodeName);
    
    return {gateway, network, contract}

}

const getUserAttrs = async(username, organizationName) => {
   
    const ccp = getCcp(organizationName)
    const wallet = await getWallet(organizationName)

    // Create a new CA client for interacting with the CA.
    const caURL = ccp.certificateAuthorities[`ca.${organizationName}.example.com`].url;
    const ca = new FabricCAServices(caURL, undefined, `ca.${organizationName}.example.com`);
    
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

const calculateBlockHash = function(header) {
    let headerAsn = asn.define('headerAsn', function() {
        this.seq().obj(
            this.key('Number').int(),
            this.key('PreviousHash').octstr(),
            this.key('DataHash').octstr()
        );
    });

    let output = headerAsn.encode({
        Number: parseInt(header.number),
        PreviousHash: Buffer.from(header.previous_hash, 'hex'),
        DataHash: Buffer.from(header.data_hash, 'hex')
    }, 'der');
    let hash = sha.sha256(output);
  return hash;
};


const getSignature = async(txId) => {
    const network = await fabric.connectToNetwork("HE1", "qscc", 'admin')
    const transaction = await network.contract.evaluateTransaction('GetTransactionByID', 'academicchannel', txId)
    network.gateway.disconnect()

    const trDecode = BlockDecoder.decodeTransaction(transaction)
    const signature = Buffer.from(trDecode.transactionEnvelope.signature).toString('base64')
    console.log("SIGNATURE", signature)

    const time = new Date(trDecode.transactionEnvelope.payload.header.channel_header.timestamp)
    const timeFormat =  date.format(time,'YYYY/MM/DD HH:mm:ss')

    const result = {
        "signature": signature,
        "signTime": timeFormat
    }
    return result
}

const getAllSignature = async(txIds) => {
    await Promise.all(txIds.map( async(item, index) => {
        txIds[index] = await getSignature(item)
    }))
    return txIds
}

module.exports = {getCcp, getWallet, connectToNetwork, getUserAttrs, calculateBlockHash, getSignature, getAllSignature}