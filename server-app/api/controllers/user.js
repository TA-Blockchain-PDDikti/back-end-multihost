const userService = require('../services/user.js')


const registerUser = async(req, res) => {
    try{
        const data = req.body;
        const email = data.email;
        const password = data.password;
        const orgName = data.organizationName;
        
        console.log(email, password, orgName)
        console.log("helo")
        const result = await userService.registerUser(email, password, orgName)
        console.log("helo1")
        res.status(200).send({result})
    }
    catch(error){
        const response = {
            "success": false,
            "message": `Failed to enroll admin user "admin": ${error}`
        };
        return response
    }
}

const enrollAdmin = async(req, res) => {
    try{
        const data = req.body;
        const email = data.email;
        const password = data.password;
        const orgName = data.organizationName;
        const result = await userService.enrollAdmin(email, password, orgName)
        res.status(200).send({result})
    }
    catch(error){
        console.log("ERROR")
    }
}

module.exports = {enrollAdmin, registerUser}