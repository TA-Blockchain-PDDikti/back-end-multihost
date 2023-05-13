const userService = require('../services/user.js')


const registerUser = async(req, res) => {
    try{
        const data = req.body;
        const username = data.username;
        const orgName = data.organizationName;
        const role = data.role;

        const result = await userService.registerUser(username, orgName, role)
        
        if (!result.error){
            res.status(200).send(result)
        }
        else{
            res.status(500).send(result)
        }
    }
    catch(error){
        const response = {
            "success": false, 
            "error": error.toString()
        };
        res.status(400).send(response)
    }
}

const enrollAdmin = async(req, res) => {
    try{
        const data = req.body;
        const username = data.username;
        const password = data.password;
        const orgName = data.organizationName;

        const result = await userService.enrollAdmin(username, password, orgName)
        res.status(200).send(result)
    }
    catch(error){
        const response = {
            "success": false, 
            "error": error.toString()
        };
        res.status(400).send(response)
    }
}


const loginUser = async(req, res) => {
    try{
        const data = req.body;
        const username = data.username;
        const password = data.password;

        const result = await userService.loginUser(username, password)
        res.status(200).send(result)
    }
    catch(error){
        const response = {
            "success": false,
            "error": `Login Failed: ${error}` 
        }
        res.status(401).send(response)
        
    }
}

// exports.me = function(req,res){
//     if (req.headers && req.headers.authorization) {
//         var authorization = req.headers.authorization.split(' ')[1],
//             decoded;
//         try {
//             decoded = jwt.verify(authorization, secret.secretToken);
//         } catch (e) {
//             return res.status(401).send('unauthorized');
//         }
//         var userId = decoded.id;
//         // Fetch the user by id 
//         User.findOne({_id: userId}).then(function(user){
//             // Do something with the user
//             return res.send(200);
//         });
//     }
//     return res.send(500);
// }

// async function getUsernamePassword(request) {
//     // check for basic auth header
//     if (!request.headers.authorization || request.headers.authorization.indexOf('Basic ') === -1) {
//         return new Promise().reject('Missing Authorization Header');  //  status 401
//     }

//     // get auth credentials
//     const base64Credentials = request.headers.authorization.split(' ')[1];
//     const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
//     const [username, password] = credentials.split(':');

//     //  At this point, username + password could be verified for auth -
//     //  but NOT BEING VERIFIED here.  Username and password are
//     //  verified with Fabric-Certificate-Authority at enroll-user time.
//     //  Once enrolled,
//     //  certificate is retrieved from CA and stored in local wallet.
//     //  After that, password will not be used.  username will be used
//     //  to pick up certificate from the local wallet.

//     if (!username || !password) {
//         return new Promise().reject('Invalid Authentication Credentials');  //  status 401
//     }

//     // attach username and password to request object
//     request.username = username;
//     request.password = password;

//     return request;
// }

module.exports = {enrollAdmin, registerUser, loginUser}