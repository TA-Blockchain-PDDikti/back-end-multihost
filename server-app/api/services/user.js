'use strict';

const FabricCAServices = require('fabric-ca-client');
const fabric = require("../utils/fabric.js")
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt")

const registerUser = async(userId, organizationName, userType) =>  {

    const ccp = await fabric.getCcp(organizationName)

    // Create a new CA client for interacting with the CA.
    const caURL = ccp.certificateAuthorities[`ca.${organizationName}.example.com`].url;
    const ca = new FabricCAServices(caURL);

    const wallet = await fabric.getWallet()

    // Check to see if we've already enrolled the user.
    const userIdentity = await wallet.get(userId);
    if (userIdentity) {
        throw `An identity for the user ${userId} already exists in the wallet`
    }

    // Check to see if we've already enrolled the admin user.
    const adminIdentity = await wallet.get('admin');
    if (!adminIdentity) {
        throw "Admin network does not exist"
    }

    // build a user object for authenticating with the CA
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');

    // Create random password end encrypted
    var password = crypto.randomBytes(4).toString('hex');
    var encryptedPassword = await bcrypt.hash(password, 10);

    // Register the user, enroll the user, and import the new identity into the wallet.
    const secret = await ca.register({
        affiliation: 'he1.department1',
        enrollmentID: userId,
        role: 'client',
        attrs: [{ "name": "userType", "value": userType, "ecert": true}, { "name": "password", "value": encryptedPassword, "ecert": true}]
    }, adminUser);

    const enrollment = await ca.enroll({
        enrollmentID: userId,
        enrollmentSecret: secret,
        attr_reqs: [{ name: "userType", optional: false }, { name: "password", optional: false }]
    });

    const x509Identity = {
        credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
        },
        mspId: `${organizationName.toUpperCase()}MSP`,
        type: 'X.509',
    };
    await wallet.put(userId, x509Identity);
    
    const response = {
        "success":true,
        "password": password,
        "message":"Successfully registered user and imported it into the wallet",
    }
    return response

}

const enrollAdmin = async(adminId, adminSecret, organizationName) => {
    
    const ccp = await fabric.getCcp(organizationName)

    // Create a new CA client for interacting with the CA.
    const caInfo = ccp.certificateAuthorities[`ca.${organizationName}.example.com`];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

    const wallet = await fabric.getWallet()

    // Check to see if we've already enrolled the admin user.
    const identity = await wallet.get(adminId);
    if (identity) {
        throw 'An identity for the admin user "admin" already exists in the wallet'
    }

    // Enroll the admin user, and import the new identity into the wallet.
    const enrollment = await ca.enroll({ enrollmentID: adminId, enrollmentSecret: adminSecret });

    const x509Identity = {
        credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
        },
        mspId: `${organizationName.toUpperCase()}MSP`,
        type: 'X.509',
    };
    await wallet.put(adminId, x509Identity);

    const response = {
        "success":true,
        "message":"Successfully registered admin and imported it into the wallet",
    }
    return response
}

const loginUser = async(username, password) => {

    const response = {}
    const ccp = await fabric.getCcp('he1')

    // Create a new CA client for interacting with the CA.
    const caURL = ccp.certificateAuthorities[`ca.he1.example.com`].url;
    const ca = new FabricCAServices(caURL, undefined, `ca.he1.example.com`);
    
    const wallet = await fabric.getWallet()

    // Check to see if we've already registered and enrolled the user.
    const user = await wallet.get(username);
    if (!user) {
        throw `User ${username} is not registered yet`
    }

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
    const userPassword = userAttrs.find(e => e.name == "password").value
    const userType = userAttrs.find(e => e.name == "userType").value

    // Compare input password with password in CA
    if (await bcrypt.compare(password, userPassword)){
        const payload = {  
            "username": username,
            "userType": userType 
        }
        const token = jwt.sign(payload, 'secret_key', {expiresIn: "2h",});

        response.success = true
        response.message = "Successfully Login"
        response.user = payload
        response.token = token
    }
    else{
        throw "Password Not Correct"
    }

    return response

}

module.exports = {enrollAdmin, registerUser, loginUser}

