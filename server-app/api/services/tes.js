'use strict';

const { Wallets, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const { KJUR, KEYUTIL, X509 } = require('jsrsasign');
const CryptoJS = require('crypto-js');

const organizationName = 'he1'
const ccpPath = path.resolve(__dirname, '..', '..', '..', 'organizations', 'peerOrganizations', `${organizationName}.example.com`, `connection-${organizationName}.json`);
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

const caCertPath = path.resolve(__dirname, '..', '..', '..', 'organizations', 'peerOrganizations', `${organizationName}.example.com`, 'ca', `ca.${organizationName}.example.com-cert.pem`);
const caCert = fs.readFileSync(caCertPath, 'utf8');


async function main() {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet', 'he1');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Collect input parameters
        // user: who initiates this query, can be anyone in the wallet
        // filename: the file to be validated
        // certfile: the cert file owner who signed the document
        const user = process.argv[2];
        const filename = process.argv[3];
        const certfile = "-----BEGIN CERTIFICATE-----\nMIICiDCCAi6gAwIBAgIUfvLk/dLfQhJcmmiTbuFrejQ6xnwwCgYIKoZIzj0EAwIw\najELMAkGA1UEBhMCVUsxEjAQBgNVBAgTCUhhbXBzaGlyZTEQMA4GA1UEBxMHSHVy\nc2xleTEYMBYGA1UEChMPaGUxLmV4YW1wbGUuY29tMRswGQYDVQQDExJjYS5oZTEu\nZXhhbXBsZS5jb20wHhcNMjMwNTI1MDI1NTAwWhcNMjQwNTI0MDM0NjAwWjBEMS8w\nCgYDVQQLEwNoZTEwDQYDVQQLEwZjbGllbnQwEgYDVQQLEwtkZXBhcnRtZW50MTER\nMA8GA1UEAxMIZG9zZW4xMjMwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAAQKF4dB\nTZ4YxoGdnu/WqjYSRxm62PljYsI6jlge5HI2Xnsn7bMSAd5KU7JWpXHidr//+qYl\nl99hIdyXC/53KehUo4HXMIHUMA4GA1UdDwEB/wQEAwIHgDAMBgNVHRMBAf8EAjAA\nMB0GA1UdDgQWBBT3TiuNP5SqM8XDijjSb6JRPdrKQTAfBgNVHSMEGDAWgBRNOw43\nCzflwS6J2PwidzgYSc+gYDB0BggqAwQFBgcIAQRoeyJhdHRycyI6eyJwYXNzd29y\nZCI6IiQyYiQxMCRBaEV6WktOTFptVTZ2MjgxVVBNRGV1R2w3dHN0ZTRrR3ZWMTNC\nNDRtc2ZsaS5KelpsMGlPVyIsInVzZXJUeXBlIjoiZG9zZW4ifX0wCgYIKoZIzj0E\nAwIDSAAwRQIhAMhq5XK9BtQBKsHcfj9dD4ohQqtekSql6+ff3JYmu3yZAiBMc1yi\nXpd3gx7AASScLS7IFb8Wws5vhY079FFrHKyluQ==\n-----END CERTIFICATE-----\n";

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.get(user);
        if (!userExists) {
            console.log('An identity for the user ' + user + ' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // calculate Hash from the file
       // const fileLoaded = fs.readFileSync(filename, 'utf8');
        var hashToAction = CryptoJS.SHA256(filename).toString();
        console.log("Hash of the file: " + hashToAction);

        // get certificate from the certfile
        console.log(certfile)
       // const certLoaded = fs.readFileSync(certfile, 'utf8');

        // retrieve record from ledger

        // // Create a new gateway for connecting to our peer node.
        // const gateway = new Gateway();
        // await gateway.connect(ccp, { wallet, identity: user, discovery: { enabled: false } });

        // // Get the network (channel) our contract is deployed to.
        // const network = await gateway.getNetwork('mychannel');

        // // Get the contract from the network.
        // const contract = network.getContract('docrec');

        // Submit the specified transaction.
        // const result = await contract.evaluateTransaction('queryDocRecord', hashToAction);
        // console.log("Transaction has been evaluated");
        // var resultJSON = JSON.parse(result);
        // console.log("Doc record found, created by " + resultJSON.time);
        // console.log("");

        // Show info about certificate provided
        const certObj = new X509();
        certObj.readCertPEM(certfile);
        console.log("Detail of certificate provided")
        console.log("Subject: " + certObj.getSubjectString());
        console.log("Issuer (CA) Subject: " + certObj.getIssuerString());
        console.log("Valid period: " + certObj.getNotBefore() + " to " + certObj.getNotAfter());
        console.log("CA Signature validation: " + certObj.verifySignature(KEYUTIL.getKey(caCert)));
        console.log("");

        // perform signature checking
        var userPublicKey = KEYUTIL.getKey(certfile);
        var recover = new KJUR.crypto.Signature({"alg": "SHA256withECDSA"});
        recover.init(userPublicKey);
        recover.updateHex(hashToAction);
        const signatureDosen = 'MEQCIApEP3BfQo4iuq3tSGPmWQGRS254TZooEH0qYOMpvLSsAiAW33ik0yzHGVjuaCTTAjwlM9yn32LmozI6/uhmTRH7Dw=='
        var getBackSigValueHex = Buffer.from(signatureDosen, 'base64').toString('hex');
        console.log("Signature verified with certificate provided: " + recover.verify(getBackSigValueHex));

        // perform certificate validation
        // var caPublicKey = KEYUTIL.getKey(caCert);
        // var certValidate = new KJUR.crypto.Signature({"alg": "SHA256withECDSA"});
        // certValidate.init(caPublicKey);
        // certValidate.update

        // Disconnect from the gateway.
        //await gateway.disconnect();


    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

main();