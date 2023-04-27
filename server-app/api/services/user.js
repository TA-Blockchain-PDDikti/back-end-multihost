'use strict';

const { response } = require('express');
const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const registerUser = async(userId, userSecret, organizationName) =>  {
    try {
    
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', '..', 'organizations', 'peerOrganizations', `${organizationName}.example.com`, `connection-${organizationName}.json`);
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        console.log("tes")
        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities[`ca.${organizationName}`].url;
        const ca = new FabricCAServices(caURL);


        console.log("hai")
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userIdentity = await wallet.get(userId);
        if (userIdentity) {
            throw `An identity for the user "${userId}" already exists in the wallet`;
        }

        // Check to see if we've already enrolled the admin user.
        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            throw "Admin network does not exist"

        }

        // build a user object for authenticating with the CA
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({
            affiliation: 'org1.department1',
            enrollmentID: userId,
            role: 'client'
        }, adminUser);
        const enrollment = await ca.enroll({
            enrollmentID: userId,
            enrollmentSecret: userSecret
        });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: `${organizationName.capitalize()}MSP`,
            type: 'X.509',
        };
        await wallet.put(userId, x509Identity);
        console.log('Successfully registered and enrolled admin user "appUser" and imported it into the wallet');
        
        response = {
            "success":true,
            "message":"Successfully registered user and imported it into the wallet')",
        }
        
    } catch (error) {
        response = {
            "success": false,
            "message": `Failed to register user: ${error}`
        };
        
    }
    return response
}


const enrollAdmin = async(adminId, adminSecret, organization) => {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caInfo = ccp.certificateAuthorities[`ca.${organization}`];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const identity = await wallet.get(adminId);
        if (identity) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            return;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: adminId, enrollmentSecret: adminSecret });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: `${organization.capitalize()}MSP`,
            type: 'X.509',
        };
        await wallet.put(adminId, x509Identity);
        console.log(x509Identity)
        console.log('Successfully enrolled admin user "admin" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
    }
}


module.exports = {enrollAdmin, registerUser}

