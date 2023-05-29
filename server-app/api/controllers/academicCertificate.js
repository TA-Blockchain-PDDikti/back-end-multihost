const certificateService = require('../services/academicCertificate.js')

exports.createAcademicCertificate = async(req, res) => {
    try {
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }

        const data = req.body;
        const dataLulusan = data.dataLulusan;
        console.log("dataLulusan", dataLulusan, typeof(dataLulusan))

        await Promise.all(dataLulusan.map( async(item, index) => {

            const idPT = item.idSp;
            const idProdi = item.idSms;
            const idMahasiswa = item.idPd;
            const jenjangPendidikan = item.jenjangPendidikan;
            const nomorIjazah = item.nomorIjazah;
            const tanggalLulus = item.tanggalLulus;
            const totalMutu = item.totalMutu;
            const totalSks = item.totalSks;
            const ipk = item.ipk

            argsIjazah = [idPT, idProdi, idMahasiswa, jenjangPendidikan, nomorIjazah, tanggalLulus]
            argsTranskrip = [idPT, idProdi, idMahasiswa, jenjangPendidikan, totalMutu, totalSks, ipk] 
            await certificateService.setGraduated(req.user.username, idMahasiswa)
            await certificateService.createIjazah(req.user.username, argsIjazah)
            await certificateService.createTranskrip(req.user.username, argsTranskrip)
        }))
        
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

        args = [idIjazah, idPT, idProdi, idMahasiswa, jenjangPendidikan, nomorIjazah, tanggalLulus]
        const result = await certificateService.updateIjazah(req.user.username, args)
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

        args = [id, idPT, idProdi, idMahasiswa, jenjangPendidikan,  totalMutu, totalSks, ipk]
        const result = await certificateService.updateTranskrip(req.user.username, args)
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

exports.getAllIjazah = async(req, res) => {
    try {
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
        if (req.user.userType != "admin PT" && req.user.userType != "mahasiswa") {
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
        if (req.user.userType != "admin PT" && req.user.userType != "mahasiswa") {
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

        const result = await certificateService.getTranskripByIdPt(req.user.username, idPt)
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

exports.approveIjazah = async(req, res) => {
    try {
        if (req.user.userType != "dosen") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const data = req.body;
        const lstIjazah = data.lstIjazah;
        const idApprover = data.idApprover

        await Promise.all(lstIjazah.map( async(item, index) => {
            const args = [item, idApprover]
            await certificateService.approveIjazah(req.user.username, args)
        }))

        res.status(200).send({
            success: true,
            message: `Ijazah disetujui oleh ${idApprover}`,
        })
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })      
    }
}

exports.approveTranskrip = async(req, res) => {
    try {
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const data = req.body;
        const lstTranskrip = data.lstTranskrip;
        const idApprover = data.idApprover

        await Promise.all(lstTranskrip.map( async(item, index) => {
            const args = [item, idApprover]
            await certificateService.approveTranskrip(req.user.username, args)
        }))

        res.status(200).send({
            success: true,
            message: `Transkrip disetujui oleh ${idApprover}`,
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
        if (req.user.userType != "mahasiswa") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const data = req.body;
        const idIjazah = data.idIjazah
        const idTranskrip = data.idTranskrip

        const identifier = await certificateService.generateIdentifier(req.user.username, idIjazah, idTranskrip)
        res.status(200).send({identifier})
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })      
    }
}

exports.addApprover = async(req, res) => {
    try {
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const data = req.body;
        const idProdi = data.idSms;
        const transkrip = data.transkrip;
        const ijazah = data.ijazah;

        await Promise.all(ijazah.map( async(item, index) => {
            args = [idProdi, item]
            console.log(item)
            await certificateService.addApproverIjazah(req.user.username, args)
        }))

        await Promise.all(transkrip.map( async(item, index) => {
            args = [idProdi, item]
            await certificateService.addApproverTranskrip(req.user.username, args)
        }))

        res.status(201).send({
            success: true,
            message: "Approver ijazah dan transkrip ditambahkan is added",
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
        const identifier = data.identifier;

        const result = await certificateService.verify(identifier)
        res.status(200).send(result)
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })      
    }
}


