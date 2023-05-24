const jsrs = require('jsrsasign');
//const SHA256 = require('crypto-js/sha256');
let ecdsa = new jsrs.ECDSA({'curve': 'secp256r1'});
const path = require('path')
const fs = require('fs');

async function createDigitalSignature(dataToSign, signerUsename) {
    let hexKeyWallet = await loadUserPrivateKey(signerUsename);
    let signedData = ecdsa.signHex(dataToSign.toString(), hexKeyWallet.privateKey);
    return signedData;
}

function loadUserPrivateKey(username) {
    try {
        let filePath = path.join(process.cwd(), 'wallet', `${username}.id`);

        if (!fs.existsSync(filePath)) {
            console.log(`User ${username} does not exist in wallet`);
            return null;
        }
        console.log("hai")
        let rawData = fs.readFileSync(path.join(process.cwd(), 'wallet', `${username}.id`));
        console.log(rawData)
        return JSON.parse(rawData);
    } catch (e) {
        console.log("Error in loadHexKeysFromWallet for username " + username);
        console.log(e);
        return null;
    }
}

module.exports = {createDigitalSignature}