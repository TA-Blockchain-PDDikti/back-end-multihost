const academicRecordService = require('../services/administrasiNilai.js')
const { v4: uuidv4 } = require('uuid')

exports.createAcademicRecordBatch = async(req, res) => {
    try {
        if (req.user.userType != "dosen") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }

        const data = req.body;
        const dataNilai = data.dataNilai;
        
        await Promise.all(dataNilai.map( async(item, index) => {
            const idKls = item.idKls;
            const idDosen = item.idPtk;
            const idMahasiswa = item.idPd;
            const nilaiAngka = item.nilaiAngka;
            const nilaiHuruf = item.nilaiHuruf;
            const nilaiIndex = item.nilaiIndex;
            var id = item.id;

            // Randomize unique Id if there is no request id given
            if (!id) {
                id = uuidv4()
            }
            
            args = [id, idKls, idDosen, idMahasiswa, nilaiAngka, nilaiHuruf, nilaiIndex]
            await academicRecordService.createAcademicRecord(req.user.username, args)
        }))
        res.status(201).send({
            success: true,
            message: "Transaction nilai has been submitted",
        })
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })    
    }
}

exports.createAcademicRecord = async(req, res) => {
    try {
        if (req.user.userType != "dosen") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const data = req.body;
        const idKls = data.idKls;
        const idDosen = data.idPtk;
        const idMahasiswa = data.idPd;
        const nilaiAngka = data.nilaiAngka;
        const nilaiHuruf = data.nilaiHuruf;
        const nilaiIndex = data.nilaiIndex;
        var id = data.id;

        // Randomize unique Id if there is no request id given
        if (!id) {
            id = uuidv4()
        }
        
        args = [id, idKls, idDosen, idMahasiswa, nilaiAngka, nilaiHuruf, nilaiIndex]
        const result = await academicRecordService.createAcademicRecord(req.user.username, args)
        res.status(201).send({
            success: true,
            message: "Transaction nilai has been submitted",
        })
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })    
    }
}

exports.updateAcademicRecord = async(req, res) => {
    try {
        if (req.user.userType != "dosen") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const data = req.body;
        const idKls = data.idKls;
        const idDosen = data.idPtk;
        const idMahasiswa = data.idPd;
        const nilaiAngka = data.nilaiAngka;
        const nilaiHuruf = data.nilaiHuruf;
        const nilaiIndex = data.nilaiIndex;
        const idNilai = req.params.id

       const args = [idNilai, idKls, idDosen, idMahasiswa, nilaiAngka, nilaiHuruf, nilaiIndex]
        const result = await academicRecordService.updateAcademicRecord(req.user.username, args)
        res.status(200).send({
            success: true,
            message: `Nilai dengan id ${idNilai} telah diubah`, 
        })
    }
    catch(error){
     res.status(400).send({
            success: false,
            error: error.toString(),
        })       
    }
}

exports.deleteAcademicRecord = async(req, res) => {
    try {
        if (req.user.userType != "dosen") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const idNilai = req.params.id
        const result = await academicRecordService.deleteAcademicRecord(req.user.username, idNilai);
        res.status(200).send({
            success: true,
            message: `Record nilai dengan id ${idNilai} telah dihapus`,
        })
    }
    catch(error){
     res.status(400).send({
            success: false,
            error: error.toString(),
        })       
    }
}

exports.getAllAcademicRecord = async(req, res) => {
    try {
        const data = await academicRecordService.getAllAcademicRecord(req.user.username) 
        res.status(200).send({data});
    } catch(error){
        res.status(400).send({
               success: false,
               error: error.toString(),
           })       
       }
}

exports.getAcademicRecordById = async(req, res) => {
    try {
        if (req.user.userType != "dosen" && req.user.userType != "mahasiswa") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const id = req.params.id
        const data = await academicRecordService.getAcademicRecordById(req.user.username, id) 
        res.status(200).send({data});
    } catch(error){
        res.status(400).send({
               success: false,
               error: error.toString(),
           })       
       }
}

exports.getAcademicRecordByIdMhsw = async(req, res) => {
    try {
        if (req.user.userType != "mahasiswa" && req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const id = req.params.id
        const data = await academicRecordService.getAcademicRecordByIdMhsw(req.user.username, id) 
        res.status(200).send({data});
    } catch(error){
        res.status(400).send({
               success: false,
               error: error.toString(),
           })       
       }
}

exports.getAcademicRecordByIdKls = async(req, res) => {
    try {
        if (req.user.userType != "dosen" && req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const id = req.params.id
        const data = await academicRecordService.getAcademicRecordByIdKls(req.user.username, id) 
        res.status(200).send({data});
    } catch(error){
        res.status(400).send({
               success: false,
               error: error.toString(),
           })       
       }
}



