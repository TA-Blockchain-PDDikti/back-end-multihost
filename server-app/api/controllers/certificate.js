const certificateService = require('../services/certificate.js')

exports.createAcademicCertificate = async(req, res) => {
    try{
        const data = req.body;
        const idPT = data.idPT;
        const idProdi = data.idProdi;
        const idMahasiswa = data.idMahasiswa;
        const jenjangPendidikan = data.jenjangPendidikan;
        const nomorIjazah = data.nomorIjazah;
        const tanggalLulus = data.tanggalLulus;
        const totalMutu = data.totalMutu;
        const totalSks = data.totalSks;
        const ipk = data.ipk
    
        const resultIjazah = await certificateService.createIjazah(req.user.username, idPT, idProdi, idMahasiswa, jenjangPendidikan, nomorIjazah, tanggalLulus)
        const resultTranskrip = await certificateService.createTranskrip(req.user.username, idPT, idProdi, idMahasiswa, jenjangPendidikan, totalMutu, totalSks, ipk)
        const result = {}
       
        res.status(201).send({
            message: "Ijazah and Transkrip is created",
            result
        })
      
    }
    catch(error){
        
    }
}

exports.updateIjazah = async(req, res) => {
    try{
        const data = req.body;
        const idPT = data.idPT;
        const idProdi = data.idProdi;
        const idMahasiswa = data.idMahasiswa;
        const jenjangPendidikan = data.jenjangPendidikan;
        const nomorIjazah = data.nomorIjazah;
        const tanggalLulus = data.tanggalLulus;
        const idIjazah = req.params.id

        const result = await certificateService.updateIjazah(req.user.username, idIjazah, idPT, idProdi, idMahasiswa, jenjangPendidikan, nomorIjazah, tanggalLulus )
        res.status(200).send({
            message: "Ijazah is updated",
            result
        })
    }
    catch(error){
        
    }
}


exports.updateTranskrip = async(req, res) => {
    try{
        const data = req.body;
        const idPT = data.idPT;
        const idProdi = data.idProdi;
        const idMahasiswa = data.idMahasiswa;
        const jenjangPendidikan = data.jenjangPendidikan;
        const idIjazah = req.params.id

        const result = await certificateService.updateTranskrip(req.user.username, idIjazah, idPT, idProdi, idMahasiswa, jenjangPendidikan, nomorIjazah, tanggalLulus )
        res.status(200).send({
            message: "Transkrip is updated",
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

        const result = await certificateService.signIjazah(req.user.username, name)
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

        const result = await certificateService.getIdentifier(req.user.username, name)
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

        const result = await certificateService.generateIdentifier(req.user.username, name)
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

        const result = await certificateService.addSigner(req.user.username, name)
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

        const result = await certificateService.verify(req.user.username, name)
        res.status(200).send({
            message: "Ijazah and Transkrip is verified",
            result
        })
    }
    catch(error){
        
    }
}

exports.getIjazahById = async(req, res) => {
    try{
        const idIjazah = req.params.id

        const result = await certificateService.getIjazahById(req.user.username, idIjazah)
        res.status(200).send({
            result
        })
    }
    catch(error){
        
    }
}

exports.getITranskripById = async(req, res) => {
    try{
        const idTranskrip = req.params.id

        const result = await certificateService.getIjazahById(req.user.username, idTranskrip)
        res.status(200).send({
            result
        })
    }
    catch(error){
        
    }
}
