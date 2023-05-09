const userService = require('../services/user.js')


const registerUser = async(req, res) => {
    try{
        const data = req.body;
        const email = data.email;
        const orgName = data.organizationName;
        const role = data.role;
        
        const result = await userService.registerUser(email, orgName, role)
        
        if (!result.error){
            res.status(200).send(result)
        }
        else{
            res.status(500).send(result)
        }
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
        if (!result.error){
            res.status(200).send(result)
        }
        else{
            res.status(500).send(result)
        }
    }
    catch(error){
        console.log("ERROR", error)
    }
}

module.exports = {enrollAdmin, registerUser}