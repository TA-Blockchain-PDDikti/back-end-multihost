const certificateService = require('../services/acdemicCertificate.js')

exports.createAcademicCertificate = async(req, res) => {
    try {
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const data = req.body;
        const idPT = data.idSp;
        const idProdi = data.idSms;
        const idMahasiswa = data.idPd;
        const jenjangPendidikan = data.jenjangPendidikan;
        const nomorIjazah = data.nomorIjazah;
        const tanggalLulus = data.tanggalLulus;
        const totalMutu = data.totalMutu;
        const totalSks = data.totalSks;
        const ipk = data.ipk

    
        await certificateService.createIjazah(req.user.username, idPT, idProdi, idMahasiswa, jenjangPendidikan, nomorIjazah, tanggalLulus)
        await certificateService.createTranskrip(req.user.username, idPT, idProdi, idMahasiswa, jenjangPendidikan, totalMutu, totalSks, ipk)
       
        res.status(201).send({
            success: true,
            message: "Ijazah dan Transkrip telah ditambahkan",
        })
      
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })      
    }
}

exports.updateIjazah = async(req, res) => {
    try {
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const data = req.body;
        const idPT = data.idSp;
        const idProdi = data.idSms;
        const idMahasiswa = data.idPd;
        const jenjangPendidikan = data.jenjangPendidikan;
        const nomorIjazah = data.nomorIjazah;
        const tanggalLulus = data.tanggalLulus;
        const idIjazah = req.params.id

        const result = await certificateService.updateIjazah(req.user.username, idIjazah, idPT, idProdi, idMahasiswa, jenjangPendidikan, nomorIjazah, tanggalLulus )
        res.status(200).send({
            success : true,
            message: "Ijazah telah diubah",
        })
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })      
    }
}


exports.updateTranskrip = async(req, res) => {
    try {
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const data = req.body;
        const idPT = data.idSp;
        const idProdi = data.idSms;
        const idMahasiswa = data.idPd;
        const jenjangPendidikan = data.jenjangPendidikan;
        const totalMutu = data.totalMutu;
        const totalSks = data.totalSks;
        const ipk = data.ipk
        const id = req.params.id

        const result = await certificateService.updateTranskrip(req.user.username, id, idPT, idProdi, idMahasiswa, jenjangPendidikan,  totalMutu, totalSks, ipk )
        res.status(200).send({
            success : true,
            message: "Transkrip telah diubah",
        })
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })      
    }
}

exports.signIjazah = async(req, res) => {
    try {
        if (req.user.userType != "dosen") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const data = req.body;
        const name = data.nama;

        const result = await certificateService.signIjazah(req.user.username, name)
        res.status(200).send({
            message: "Ijazah is signed",
            result
        })
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })      
    }
}

exports.getIdentifier = async(req, res) => {
    try {
        if (req.user.userType != "mahasiswa") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const data = req.body;
        const name = data.nama;

        const result = await certificateService.getIdentifier(req.user.username, name)
        res.status(200).send({
            result
        })
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })      
    }
}

exports.generateIdentifier = async(req, res) => {
    try {
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const data = req.body;
        const name = data.nama;

        const result = await certificateService.generateIdentifier(req.user.username, name)
        res.status(201).send({
            message: "Identifier is generated",
            result
        })
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })      
    }
}

exports.addSigner = async(req, res) => {
    try {
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const data = req.body;
        const name = data.nama;

        const result = await certificateService.addSigner(req.user.username, name)
        res.status(201).send({
            message: "Signer is added",
            result
        })
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })      
    }
}


exports.verify = async(req, res) => {
    try {
        const data = req.body;
        const name = data.nama;

        const result = await certificateService.verify(req.user.username, name)
        res.status(200).send({
            message: "Ijazah and Transkrip is verified",
            result
        })
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })      
    }
}

exports.getAllIjazah = async(req, res) => {
    try {
        if (req.user.userType != "admin pddikti") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const idIjazah = req.params.id

        const result = await certificateService.getAllIjazah(req.user.username)
        res.status(200).send({
            result
        })
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })      
    }
}

exports.getAllTranskrip = async(req, res) => {
    try {
        if (req.user.userType != "admin pddikti") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const result = await certificateService.getAllTranskrip(req.user.username)
        res.status(200).send({
            result
        })
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })  
        
    }
}


exports.getIjazahById = async(req, res) => {
    try {
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const idIjazah = req.params.id

        const result = await certificateService.getIjazahById(req.user.username, idIjazah)
        res.status(200).send(result)
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })      
    }
}

exports.getTranskripById = async(req, res) => {
    try {
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const idTranskrip = req.params.id

        const result = await certificateService.getTranskripById(req.user.username, idTranskrip)
        res.status(200).send(result)
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })  
        
    }
}

exports.getIjazahByIdPt = async(req, res) => {
    try {
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const idPt = req.params.id

        const result = await certificateService.getIjazahByIdPt(req.user.username, idPt)
        res.status(200).send({
            result
        })
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })      
    }
}

exports.getTranskripByIdPt = async(req, res) => {
    try {
        if (req.user.userType != "admin PT" && req.user.userType != "dosen") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const idPt = req.params.id

        const result = await certificateService.getTranskripByIdPt(req.user.username, id)
        res.status(200).send({
            result
        })
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })  
        
    }
}

exports.getIjazahByIdProdi = async(req, res) => {
    try {
        if (req.user.userType != "admin PT" && req.user.userType != "dosen") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const idProdi = req.params.id

        const result = await certificateService.getIjazahByIdProdi(req.user.username, idProdi)
        res.status(200).send({
            result
        })
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })      
    }
}

exports.getTranskripByIdProdi = async(req, res) => {
    try {
        if (req.user.userType != "admin PT" && req.user.userType != "dosen") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const idProdi = req.params.id

        const result = await certificateService.getTranskripByIdProdi(req.user.username, idProdi)
        res.status(200).send({
            result
        })
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })  
        
    }
}

exports.getIjazahByIdMahasiswa = async(req, res) => {
    try {
        if (req.user.userType != "admin PT" && req.user.userType != "mahasiswa") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const idMahasiswa = req.params.id

        const result = await certificateService.getIjazahByIdMahasiswa(req.user.username, idMahasiswa)
        res.status(200).send({
            result
        })
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })      
    }
}

exports.getTranskripByIdMahasiswa = async(req, res) => {
    try {
        if (req.user.userType != "admin PT" && req.user.userType != "mahasiswa") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const idMahasiswa = req.params.id

        const result = await certificateService.getTranskripByIdMahasiswa(req.user.username, idMahasiswa)
        res.status(200).send({
            result
        })
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })  
        
    }
}

