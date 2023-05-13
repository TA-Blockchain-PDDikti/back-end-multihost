const dataService = require('../services/academicRecord.js')

exports.createAcademicRecord = async(req, res) => {
    try{
        const data = req.body;
        const idKls = data.idKls;
        const idDosen = data.idDosen;
        const idMahasiswa = data.idMahasiswa;
        const nilaiAngka = data.nilaiAngka;
        const nilaiHuruf = data.nilaiHuruf;
        const nilaiIndex = data.nilaiIndex;

        const result = await dataService.createAcademicRecord(req.user.username,idKls, idDosen, idMahasiswa, nilaiAngka, nilaiHuruf, nilaiIndex)
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
        const idKls = data.idKls;
        const idDosen = data.idDosen;
        const idMahasiswa = data.idMahasiswa;
        const nilaiAngka = data.nilaiAngka;
        const nilaiHuruf = data.nilaiHuruf;
        const nilaiIndex = data.nilaiIndex;
        const idNilai = req.params.id

        const result = await dataService.updateAcademicRecord(req.user.username,  idNilai, idKls, idDosen, idMahasiswa, nilaiAngka, nilaiHuruf, nilaiIndex)
        res.status(200).send({
            message: `Pendidikan Tinggi with id ${idNilai} is updated`,
            
        })
    }
    catch(error){
        
    }
}

exports.deleteAcademicRecord = async(req, res) => {
    try{
        const idNilai = req.params.id
        const result = await dataService.deleteAcademicRecord(req.user.username, idNilai);
        res.status(200).send({
            message: `Pendidikan Tinggi with id ${idNilai} is deleted`,
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


