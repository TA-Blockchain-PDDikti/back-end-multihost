const userService = require('../services/user.js')


const registerUser = async(req, res) => {
    try{
        const data = req.body;
        const email = data.email;
        const orgName = data.organizationName;
        
        const result = await userService.registerUser(email, orgName)
        res.status(200).send({result})
    }
    catch(error){
        console.log("ERROR", error)
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
        console.log("ERROR", error)
    }
}

module.exports = {enrollAdmin, registerUser}