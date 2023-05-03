const certificateService = require('../services/certificate.js')

exports.createIjazah = async(req, res) => {
    try{
        const data = req.body;
        const name = data.nama;
    
        const result = await certificateService.createIjazah(1,'A')
       
        res.status(201).send({
            message: "Ijazah is created",
            result
        })
      
    }
    catch(error){
        
    }
}

exports.updateIjazah = async(req, res) => {
    try{
        const data = req.body;
        const name = data.nama;

        const result = await certificateService.updateIjazah(1, name)
        res.status(200).send({
            message: "Ijazah is updated",
            result
        })
    }
    catch(error){
        
    }
}

exports.signIjazah = async(req, res) => {
    try{
        const data = req.body;
        const name = data.nama;

        const result = await certificateService.signIjazah(1, name)
        res.status(200).send({
            message: "Ijazah is signed",
            result
        })
    }
    catch(error){
        
    }
}

exports.getIdentifier = async(req, res) => {
    try{
        const data = req.body;
        const name = data.nama;

        const result = await certificateService.getIdentifier(1, name)
        res.status(200).send({
            result
        })
    }
    catch(error){
        
    }
}

exports.generateIdentifier = async(req, res) => {
    try{
        const data = req.body;
        const name = data.nama;

        const result = await certificateService.generateIdentifier(1, name)
        res.status(201).send({
            message: "Identifier is generated",
            result
        })
    }
    catch(error){
        
    }
}

exports.addSigner = async(req, res) => {
    try{
        const data = req.body;
        const name = data.nama;

        const result = await certificateService.addSigner(1, name)
        res.status(201).send({
            message: "Signer is added",
            result
        })
    }
    catch(error){
        
    }
}


exports.verify = async(req, res) => {
    try{
        const data = req.body;
        const name = data.nama;

        const result = await certificateService.addSigner(1, name)
        res.status(200).send({
            message: "Ijazah is verified",
            result
        })
    }
    catch(error){
        
    }
}

exports.getIjazah = async(req, res) => {
    try{
        const data = req.body;
        const name = data.nama;

        const result = await certificateService.getIjazah(1, name)
        res.status(200).send({
            result
        })
    }
    catch(error){
        
    }
}
