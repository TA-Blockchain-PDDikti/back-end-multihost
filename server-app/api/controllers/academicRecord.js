const dataService = require('../services/academicRecord.js')

exports.createAcademicRecord = async(req, res) => {
    try{
        const data = req.body;
        const name = data.nama;

        const result = await dataService.createAcademicRecord(1,name)
        res.status(201).send({
            message: "Pendidikan Tinggi is created",
            result
        })
    }
    catch(error){
        
    }
}

exports.updateAcademicRecord = async(req, res) => {
    try{
        const data = req.body;
        const name = data.nama;

        const result = await dataService.updateAcademicRecord(1,  name)
        res.status(200).send({
            message: `Pendidikan Tinggi with id ${req.params.id} is updated`,
            
        })
    }
    catch(error){
        
    }
}

exports.deleteAcademicRecord = async(req, res) => {
    try{
        const result = await dataService.deleteAcademicRecord(1);
        res.status(200).send({
            message: `Pendidikan Tinggi with id ${req.params.id} is deleted`,
        })
    }
    catch(error){
        
    }
}

exports.getAcademicRecordById = async(req, res) => {
    const data = await dataService.getAcademicRecordById(1) 
    res.status(200).send({data});
}

exports.setGrade = async(req, res) => {
    const data = await dataService.setGrade(1)
    res.status(200).send({data});
}


