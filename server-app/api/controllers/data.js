const dataService = require('../services/data.js')
const userService = require('../services/user.js')
const { v4: uuidv4 } = require('uuid')

//Pendidikan Tinggi
exports.createPT = async(req, res) => {
    try{
        if (req.user.userType != "admin pddikti") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const data = req.body;
        const nama = data.nama;
        const adminPT = data.usernameAdmin;
        var id = data.id;

         // Randomize unique Id if there is no request id given
        if (!id) {
            id = uuidv4()
        }

        const dataAdmin = {"idSp": id, "namaSp": nama}

        // Register admin PT identity to CA
        const registerAkun = await userService.registerUser(adminPT, 'HE1', "admin PT", dataAdmin)

        const args = [id, 'HE1MSP', nama, adminPT]
        await dataService.createPT(req.user.username, args)
        res.status(201).send({
            success: true,
            message: "Pendidikan Tinggi telah ditambahkan",
            accountPassword: registerAkun.password 
        })
    }
    catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })
    }
}

exports.updatePT = async(req, res) => {
    try{
        if (req.user.userType != "admin pddikti") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const data = req.body;
        const nama = data.nama;
        const idPT = req.params.id;

        args = [idPT, 'HE1MSP', nama]
        await dataService.updatePT(req.user.username, args)
        res.status(200).send({
            success: true,
            message: `Pendidikan Tinggi dengan id ${idPT} telah diubah`,
        })
    }
    catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })
    }
}

exports.deletePT = async(req, res) => {
    try{
        if (req.user.userType != "admin pddikti") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const idPT  = req.params.id;
        await dataService.deletePT(req.user.username, idPT);
        res.status(200).send({
            success: true,
            message: `Pendidikan Tinggi dengan id ${idPT} telah dihapus`,
        })
    } catch(error) {
        console.log("ERROR", error)
        res.status(400).send({
            success: false,
            error: error.toString(),
        })
    }
}

exports.getAllPT = async(req, res) => {
    try{
        if (req.user.userType != "admin pddikti") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const data = await dataService.getAllPT(req.user.username) 
        res.status(200).send({data});
    } catch(error) {
        res.status(400).send({
            success: false,
            error: error.toString(),
        })
    }

}

exports.getPTById = async(req, res) => {
    try {
        if (req.user.userType != "admin pddikti" && req.user.userType != "admin PT" ) {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }

        var isAdminPt = false
        if (req.user.userType == "admin PT") {
            isAdminPt = true
        }
        const idPT = req.params.id
        const data = await dataService.getPTById(req.user.username, idPT, isAdminPt) 
        res.status(200).send(data);
    } catch (error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })
    }
}

//Prodi
exports.createProdi = async(req, res) => {
    try {
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        } 
        const data = req.body;
        const idPT =  data.idSp;
        const nama = data.nama;
        const jenjang = data.jenjangPendidikan;
        var id = data.id;

        // Randomize unique Id if there is no request id given
        if (!id) {
            id = uuidv4()
        }
        
        args = [id, idPT, nama, jenjang]
        await dataService.createProdi(req.user.username, args)
        res.status(201).send({
            success: true,
            message: "Prodi telah ditambahkan",
        })
    } catch(error){
        console.log(error)
        res.status(400).send({
            success: false,
            error: error.toString(),
        })
    }
}

exports.updateProdi = async(req, res) => {
    try {
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const data = req.body;
        const idPT =  data.idSp;
        const nama = data.nama;
        const jenjang = data.jenjangPendidikan;
        const idProdi = req.params.id

        args = [idProdi, idPT, nama, jenjang]
        await dataService.updateProdi(req.user.username, args)
        res.status(200).send({
            success: true,
            message: `Prodi dengan id ${idProdi} telah diubah`,
            
        })
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })    
    }
}

exports.deleteProdi = async(req, res) => {
    try{
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const idProdi = req.params.id;
        await dataService.deleteProdi(req.user.username, idProdi);
        
        res.status(200).send({
            success: true,
            message: `Prodi dengan id ${idProdi} telah dihapus`,
        })
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })    
    }
}

exports.getAllProdi = async(req, res) => {
    try{
        data = await dataService.getAllProdi(req.user.username) 
        res.status(200).send({data});
    } catch (error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })    
    }
}

exports.getProdiByPT = async(req, res) => {
    try {
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const idPT = req.params.id

        result = await dataService.getProdiByPT(req.user.username, idPT) 
        res.status(200).send({result});
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })    
    }
}

exports.getProdiById = async(req, res) => {
    try {
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const idProdi = req.params.id

        result = await dataService.getProdiById(req.user.username, idProdi) 
        res.status(200).send(result);
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })    
    }
}

// Dosen
exports.createDosen = async(req, res) => {
    try{
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const data = req.body;
        const idPT = data.idSp;
        const idProdi = data.idSms;
        const nama = data.nama;
        const username = data.username;
        const jabatan = data.jabatan;
        const nidn = data.nidn;
        const nomorSk = data.nomorSk;
        var id = data.id;
        
        // Randomize unique Id if there is no request id given
        if (!id) {
            id = uuidv4()
        }

         // Register dosen identity to CA
        const dataDosen = {"id": id, "nama": nama}
        const registerAkun = await userService.registerUser(username, 'HE1', "dosen", dataDosen)

        args = [id, idPT, idProdi, nama, nidn, jabatan, nomorSk, username]
        await dataService.createDosen(req.user.username, args)
        res.status(201).send({
            success: true,
            message: "Dosen telah ditambahkan",
            accountPassword: registerAkun.password 
        })
    }
    catch(error){
        console.log("ERROR", error)
        res.status(400).send({
            success: false,
            error: error.toString(),
        })    
    }
}

exports.updateDosen = async(req, res) => {
    try{
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const data = req.body;
        const idPT = data.idSp;
        const idProdi = data.idSms;
        const nama = data.nama;
        const idDosen = req.params.id
        const jabatan = data.jabatan;
        const nidn = data.nidn;
        const nomorSk = data.nomorSk;

        args = [idDosen, idPT, idProdi, nama, nidn, jabatan, nomorSk]
        const result = await dataService.updateDosen(req.user.username, args)
        res.status(200).send({
            success: true,
            message: `Dosen dengan id ${idDosen} telah diubah`,
        })
    }
    catch(error){
        console.log("ERROR", error)
        res.status(400).send({
            success: false,
            error: error.toString(),
        })    
    }
}

exports.deleteDosen = async(req, res) => {
    try{
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const idDosen  = req.params.id;
        await dataService.deleteDosen(req.user.username, idDosen);

        res.status(200).send({
            success: true,
            message: `Dosen dengan id ${idDosen} telah dihapus`,
        })
    } catch(error){
        console.log("ERROR", error)
        res.status(400).send({
            success: false,
            error: error.toString(),
        })    
    }
}


exports.getAllDosen = async(req, res) => {
    try {
        data = await dataService.getAllDosen(req.user.username) 
        res.status(200).send({data});
    } catch(error) {
        res.status(400).send({
            success: false,
            error: error.toString(),
        })
    }
}

exports.getApprovalByPT = async(req, res) => {
    try {
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const idPT  = req.params.id;
        data = await dataService.getDosenByPT(req.user.username, idPT) 
        approver = data.filter( x => x.jabatan != "")
        res.status(200).send({approver});
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })    
    }
}

exports.getDosenByPT = async(req, res) => {
    try {
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const idPT  = req.params.id;
        data = await dataService.getDosenByPT(req.user.username, idPT) 
        res.status(200).send({data});
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })    
    }
}

exports.getDosenById = async(req, res) => {
    try {
        if (req.user.userType != "admin PT" && req.user.userType != "dosen" ) {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const idDosen = req.params.id
        const result = await dataService.getDosenById(req.user.username, idDosen) 
        res.status(200).send(result);
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })    
    }
}

//Mahasiswa

exports.createMahasiswa = async(req, res) => {
    try{
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const data = req.body;
        const idPT = data.idSp;
        const idProdi = data.idSms;
        const nama = data.nama;
        const nipd = data.nipd;
        const username = data.username;
        var id = data.id;

        // Randomize unique Id if there is no request id given
        if (!id) {
            id = uuidv4()
        }

         // Register mahasiswa identity to CA
        const dataMahasiswa = {"id": id, "nama": nama}
        const registerAkun = await userService.registerUser(username, 'HE1', "mahasiswa", dataMahasiswa)
        args = [id, idPT, idProdi, nama, nipd, username]
        await dataService.createMahasiswa(req.user.username, args)
        
        res.status(201).send({
            success: true,
            message: "Mahasiswa telah ditambahkan",
            accountPassword: registerAkun.password 
        })
    }
    catch(error){
        console.log("ERROR", error)
        res.status(400).send({
            success: false,
            error: error.toString(),
        })    
    }
}

exports.updateMahasiswa = async(req, res) => {
    try{
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const data = req.body;
        const idPT = data.idSp;
        const idProdi = data.idSms;
        const nama = data.nama;
        const nipd = data.nipd;
        const idMahasiswa = req.params.id

        args = [idMahasiswa, idPT, idProdi, nama, nipd]
        await dataService.updateMahasiswa(req.user.username, args)
        res.status(200).send({
            success: true,
            message: `Mahasiswa dengan id ${idMahasiswa} telah diubah`,
        })
    }
    catch(error){
        console.log("ERROR", error)
        res.status(400).send({
            success: false,
            error: error.toString(),
        })    
    }
}

exports.deleteMahasiswa = async(req, res) => {
    try{
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const idMahasiswa = req.params.id
        await dataService.deleteMahasiswa(req.user.username, idMahasiswa)
        res.status(200).send({
            success: true,
            message: `Mahasiswa dengan id ${idMahasiswa} telah dihapus`,
        })
    }
    catch(error){
        console.log("ERROR", error)
        res.status(400).send({
            success: false,
            error: error.toString(),
        })    
    }
}


exports.getAllMahasiswa = async(req, res) => {
    try {
        data = await dataService.getAllMahasiswa(req.user.username) 
        res.status(200).send({data});
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })    
    }
}

exports.getMahasiswaByPT = async(req, res) => {
    try {
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const idPT = req.params.id
        data = await dataService.getMahasiswaByPT(req.user.username, idPT) 
        res.status(200).send({data});
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })    
    }
}

exports.getMahasiswaById = async(req, res) => {
    try {
        if (req.user.userType != "admin PT" && req.user.userType != "mahasiswa") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const idMahasiswa = req.params.id
        data = await dataService.getMahasiswaById(req.user.username, idMahasiswa) 
        res.status(200).send(data);
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })    
    }
}

//Mata KUliah
exports.createMataKuliah = async(req, res) => {
    try{
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const data = req.body;
        const idProdi  = data.idSms;
        const idPT  = data.idSp;
        const nama = data.nama;
        const sks = data.sks;
        const jenjangPendidikan = data.jenjangPendidikan
        const kodeMk = data.kodeMk;
        var id = data.id;

        // Randomize unique Id if there is no request id given
        if (!id) {
            id = uuidv4()
        }

        args = [id, idPT, idProdi, nama, kodeMk, sks, jenjangPendidikan]
        await dataService.createMataKuliah(req.user.username, args)
        res.status(201).send({
            success: true,
            message: "Mata Kuliah telah ditambahkan",
        })
    }
    catch(error){
        console.log("ERROR", error)
        res.status(400).send({
            success: false,
            error: error.toString(),
        })    
    }
}

exports.updateMataKuliah = async(req, res) => {
    try{
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const data = req.body;
        const idProdi  = data.idSms;
        const idPT  = data.idSp;
        const nama = data.nama;
        const sks = data.sks;
        const jenjangPendidikan = data.jenjangPendidikan
        const idMk = req.params.id;
        const kodeMk = data.kodeMk;

        args = [idMk,  idPT, idProdi, nama, kodeMk, sks, jenjangPendidikan]
        const result = await dataService.updateMataKuliah(req.user.username, args)
        res.status(200).send({
            success: true,
            message: `Mata Kuliah dengan id ${idMk} telah diubah`,
        })
    }
    catch(error){
        console.log("ERROR", error)
        res.status(400).send({
            success: false,
            error: error.toString(),
        })    
    }
}

exports.deleteMataKuliah = async(req, res) => {
    try{
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const idMk = req.params.id;
        await dataService.deleteMataKuliah(req.user.username, idMk)
        res.status(200).send({
            success: true,
            message: `MataKuliah dengan id ${req.params.id} telah dihapus`,
        })
    }
    catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })    
    }
}


exports.getAllMataKuliah = async(req, res) => {
    try {
        data = await dataService.getAllMataKuliah(req.user.username) 
        res.status(200).send({data});
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })    
    }
}

exports.getMataKuliahById = async(req, res) => {
    try {
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const idMk = req.params.id
        data = await dataService.getMataKuliahById(req.user.username, idMk) 
        res.status(200).send(data);
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })    
    }
}

exports.getMataKuliahByIdPt = async(req, res) => {
    try {
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const idPt = req.params.id
        data = await dataService.getMataKuliahByIdPt(req.user.username, idPt) 
        res.status(200).send({data});
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })    
    }
}


//Kelas
exports.createKelas = async(req, res) => {
    try{
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const data = req.body;
        const nama = data.nama;
        const idMk = data.idMk;
        const idProdi = data.idSms;
        const semester = data.semester;
        const sks = data.sks;
        var id = data.id;

        // Randomize unique Id if there is no request id given
        if (!id) {
            id = uuidv4()
        }

        args = [id, idProdi, idMk, nama, semester, sks]
        await dataService.createKelas(req.user.username, args)
        res.status(201).send({
            success: true,
            message: "Kelas telah ditambahkan",
        })
    }
    catch(error){
        console.log("ERROR", error)
        res.status(400).send({
            success: false,
            error: error.toString(),
        })    
    }
}

exports.updateKelas = async(req, res) => {
    try{
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const data = req.body;
        const nama = data.nama;
        const idProdi = data.idSms;
        const idMk = data.idMk;
        const semester = data.semester;
        const sks = data.sks;
        const idKelas = req.params.id;

        args = [idKelas, idProdi, idMk, nama, semester, sks]
        const result = await dataService.updateKelas(req.user.username,  args)
        res.status(200).send({
            success: true,
            message: `Kelas dengan id ${idKelas} telah diubah`,
        })
    }
    catch(error){
        console.log("ERROR", error)
        res.status(400).send({
            success: false,
            error: error.toString(),
        })    
    }
}

exports.deleteKelas = async(req, res) => {
    try{
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const idKelas = req.params.id;
        await dataService.deleteKelas(req.user.username, idKelas)
        res.status(200).send({
            success: true,
            message: `Kelas dengan id ${req.params.id} telah dihapus`,
        })
    }
    catch(error){
        console.log("ERROR", error)
        res.status(400).send({
            success: false,
            error: error.toString(),
        })    
    }
}

exports.updateDosenKelas = async(req, res) => {
    try{
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const data = req.body;
        const idKelas = data.idKls;
        const dosenLst = data.ptk;

        const args = [idKelas, dosenLst]
        await dataService.updateDosenKelas(req.user.username, args)
        
        res.status(200).send({
            success: true,
            message: `Dosen  ditambahkan ke kelas dengan id ${idKelas}`,
        })
    }
    catch(error){
        console.log("ERROR", error)
        res.status(400).send({
            success: false,
            error: error.toString(),
        })    
    }

}

exports.updateMahasiswaKelas = async(req, res) => {
    try{
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const data = req.body;
        const idKelas = data.idKls;
        const mahasiswaLst = data.pd;

        const args = [idKelas, mahasiswaLst]
        await dataService.updateMahasiswaKelas(req.user.username, args)

        res.status(200).send({
            success: true,
            message: `Mahasiswa ditambahkan ke kelas dengan id ${idKelas}`,
        })
    }
    catch(error){
        console.log("ERROR", error)
        res.status(400).send({
            success: false,
            error: error.toString(),
        })    
    }
}

exports.getAllKelas = async(req, res) => {
    try {
        data = await dataService.getAllKelas(req.user.username) 
        res.status(200).send({data});
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })    
    }
}

exports.getKelasById = async(req, res) => {
    try {
        if (req.user.userType != "admin PT" && req.user.userType != "dosen") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const idKelas = req.params.id

        result = await dataService.getKelasById(req.user.username, idKelas) 
        res.status(200).send(result);
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })    
    }
}

exports.getKelasByIdMk = async(req, res) => {
    try {
        if (req.user.userType != "admin PT") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }
        const idMk = req.params.id

        const result = await dataService.getKelasByIdMk(req.user.username, idMk) 
        res.status(200).send(result);
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })    
    }
}

exports.getKelasByIdDosen = async(req, res) => {
    try {
        if (req.user.userType != "dosen") {
            return res.status(403).send({"result":`Forbidden Access for role ${req.user.userType}`})
        }

        const idDosen = req.params.id

        const allKelas = await dataService.getAllKelas(req.user.username) 
        const result = allKelas.filter(x => x.listIdPtk.includes(idDosen))
        res.status(200).send(result);
    } catch(error){
        res.status(400).send({
            success: false,
            error: error.toString(),
        })    
    }
}

