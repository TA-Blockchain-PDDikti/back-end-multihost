const jsrs = require('jsrsasign');
//const SHA256 = require('crypto-js/sha256');
let ecdsa = new jsrs.ECDSA({'curve': 'secp256r1'});
const path = require('path')
const fs = require('fs');
const { KJUR, KEYUTIL, X509 } = require('jsrsasign');
const fabric = require("../utils/fabric.js")

async function createDigitalSignature(dataToSign, signerUsename) {
    let keyWallet = await loadUserKey(signerUsename);
    let signedData = ecdsa.signHex(dataToSign.toString(), keyWallet.privateKey);
    return signedData;
}

async function signature(dataToSign, signerUsename) {
    // hash the data
    var hashToAction = CryptoJS.SHA256(dataToSign).toString();
    console.log("Hash of the file: " + hashToAction);

    // get private key
    let keyWallet = await loadUserKey(signerUsename);
    const userPrivateKey = keyWallet.privateKey;

    // Sign with private key
    console.log("private key",userPrivateKey)
    var sig = new KJUR.crypto.Signature({"alg": "SHA256withECDSA"});
    sig.init(userPrivateKey, "");
    sig.updateHex(hashToAction);
    var sigValueHex = sig.sign();
    var sigValueBase64 = Buffer.from(sigValueHex, 'hex').toString('base64');
    console.log("Signature: " + sigValueBase64);
    return sigValueBase64
}

async function loadUserKey(username) {
    try {
        const wallet = await fabric.getWallet('HE1')
        const user = await wallet.get(user);

        if (!user) {
            throw `User ${username} does not exist in wallet`;
        }
        return user.credentials;
    } catch (e) {
        console.log("Error in loadHexKeysFromWallet for username " + username);
        console.log(e);
        return null;
    }
}

module.exports = {createDigitalSignature}