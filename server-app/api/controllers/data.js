const dataService = require('../services/data.js')
const userService = require('../services/user.js')
const { v4: uuidv4 } = require('uuid')

//Pendidikan Tinggi
exports.createPT = async(req, res) => {
    try{
        const data = req.body;
        const nama = data.nama;
        const adminPT = data.usernameAdmin;
        var id = data.id;

         // Randomize unique Id if there is no request id given
        if (!id) {
            id = uuidv4()
        }

        // Register admin PT identity to CA
        await userService.registerUser(adminPT, 'he1', "admin PT")

        await dataService.createPT(req.user.username, id, nama, adminPT)
        res.status(201).send({
            success: true,
            message: "Pendidikan Tinggi is created",
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
        const data = req.body;
        const nama = data.nama;
        const adminPT = data.usernameAdmin;
        const idPT = req.params.id;

        await dataService.updatePT(req.user.username,idPT, nama, adminPT)
        res.status(200).send({
            success: true,
            message: `Pendidikan Tinggi with id ${idPT} is updated`,
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
        const idPT  = req.params.id;
        await dataService.deletePT(req.user.username, idPT);
        res.status(200).send({
            success: true,
            message: `Pendidikan Tinggi with id ${idPT} is deleted`,
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
        data = await dataService.getAllPT(req.user.username) 
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
        const idPT = req.params.id
        data = await dataService.getPTById(req.user.username,idPT) 
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
        const data = req.body;
        const idPT =  data.idPT;
        const nama = data.nama;
        const jenjang = data.jenjangPendidikan;
        var id = data.id;

        // Randomize unique Id if there is no request id given
        if (!id) {
            id = uuidv4()
        }
        
        await dataService.createProdi(req.user.username, id, idPT, nama, jenjang)
        res.status(201).send({
            success: true,
            message: "Prodi is created",
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
        const data = req.body;
        const idPT =  data.idPT;
        const nama = data.nama;
        const jenjang = data.jenjangPendidikan;
        const idProdi = req.params.id

        await dataService.updateProdi(req.user.username, idProdi, idPT, nama, jenjang)
        res.status(200).send({
            success: true,
            message: `Prodi with id ${idProdi} is updated`,
            
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
        const idProdi = req.params.id;
        await dataService.deleteProdi(req.user.username, idProdi);
        
        res.status(200).send({
            success: true,
            message: `Prodi with id ${idProdi} is deleted`,
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
        const data = req.body;
        const idPT = data.idPT;
        const idProdi = data.idProdi;
        const nama = data.nama;
        const username = data.username;
        var id = data.id;
        
        // Randomize unique Id if there is no request id given
        if (!id) {
            id = uuidv4()
        }

         // Register dosen identity to CA
        await userService.registerUser(username, 'he1', "dosen")

        await dataService.createDosen(req.user.username, id, idPT,idProdi,nama)
        res.status(201).send({
            success: true,
            message: "Dosen is created",
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
        const data = req.body;
        const idPT = data.idPT;
        const idProdi = data.idProdi;
        const nama = data.nama;
        const idDosen = req.params.id

        const result = await dataService.updateDosen(req.user.username, idDosen, idPT,idProdi,nama)
        res.status(200).send({
            success: true,
            message: `Dosen with id ${idDosen} is updated`,
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

exports.signDosen = async(req, res) => {
    try{
        const data = req.body;
        const nidn = data.nidn;
        const idDosen = req.params.id

        const result = await dataService.signDosen(req.user.username, idDosen, nidn)
        res.status(200).send({
            success: true,
            message: `Dosen with id ${idDosen} is signed`,
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
        const idDosen  = req.params.id;
        await dataService.deleteDosen(req.user.username, idDosen);

        res.status(200).send({
            success: true,
            message: `Dosen with id ${idDosen} is deleted`,
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

exports.getDosenByPT = async(req, res) => {
    try {
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
        const data = req.body;
        const idPT = data.idPT;
        const idProdi = data.idProdi;
        const nama = data.nama;
        const nipd = data.nipd;
        const username = data.username;
        var id = data.id;

        // Randomize unique Id if there is no request id given
        if (!id) {
            id = uuidv4()
        }

         // Register mahasiswa identity to CA
        await userService.registerUser(username, 'he1', "mahasiswa")
        await dataService.createMahasiswa(req.user.username, id, idPT, idProdi, nama, nipd, username)
        
        res.status(201).send({
            success: true,
            message: "Mahasiswa is created",
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
        const data = req.body;
        const idPT = data.idPT;
        const idProdi = data.idProdi;
        const nama = data.nama;
        const nipd = data.nipd;
        const idMahasiswa = req.params.id

        await dataService.updateMahasiswa(req.user.username, idMahasiswa, idPT, idProdi, nama, nipd)
        res.status(200).send({
            success: true,
            message: `Mahasiswa with id ${idMahasiswa} is updated`,
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
        const idMahasiswa = req.params.id
        await dataService.deleteMahasiswa(req.user.username, idMahasiswa)
        res.status(200).send({
            success: true,
            message: `Mahasiswa with id ${idMahasiswa} is deleted`,
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

exports.getMahasiswaByKelas = async(req, res) => {
    try {
        const idKelas = req.params.id 
        data = await dataService.getMahasiswaByKelas(req.user.username, idKelas) 
        res.status(200).send({data});
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
        const data = req.body;
        const idProdi  = data.idProdi;
        const idPT  = data.idPT;
        const nama = data.nama;
        const sks = data.sks;
        const jenjangPendidikan = data.jenjangPendidikan
        var id = data.id;

        // Randomize unique Id if there is no request id given
        if (!id) {
            id = uuidv4()
        }

        await dataService.createMataKuliah(req.user.username, id,  idPT, idProdi, nama, sks, jenjangPendidikan)
        res.status(201).send({
            success: true,
            message: "Mata Kuliah is created",
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
        const data = req.body;
        const idProdi  = data.idProdi;
        const idPT  = data.idPT;
        const nama = data.nama;
        const sks = data.sks;
        const jenjangPendidikan = data.jenjangPendidikan
        const idMk = req.params.id;

        const result = await dataService.updateMataKuliah(req.user.username, idMk,  idPT, idProdi, nama, sks, jenjangPendidikan)
        res.status(200).send({
            success: true,
            message: `Mata Kuliah with id ${idMk} is updated`,
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
        const idMk = req.params.id;
        await dataService.deleteMataKuliah(req.user.username, idMk)
        res.status(200).send({
            success: true,
            message: `MataKuliah with id ${req.params.id} is deleted`,
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
        const data = req.body;
        const nama = data.nama;
        const idMk = data.idMk;
        const idProdi = data.idProdi;
        const semester = data.semester;
        const sks = data.sks;
        var id = data.id;

        // Randomize unique Id if there is no request id given
        if (!id) {
            id = uuidv4()
        }

        await dataService.createKelas(req.user.username, id, idProdi, idMk, nama, semester, sks)
        res.status(201).send({
            success: true,
            message: "Kelas is created",
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
        const data = req.body;
        const nama = data.nama;
        const idProdi = data.idProdi;
        const idMk = data.idMk;
        const semester = data.semester;
        const sks = data.sks;
        const idKelas = req.params.id;

        const result = await dataService.updateKelas(req.user.username,  idKelas, idProdi, idMk, nama, semester, sks)
        res.status(200).send({
            success: true,
            message: `Kelas with id ${idKelas} is updated`,
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
        const idKelas = req.params.id;
        await dataService.deleteKelas(req.user.username, idKelas)
        res.status(200).send({
            success: true,
            message: `Kelas with id ${req.params.id} is deleted`,
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

exports.assignDosen = async(req, res) => {
    try{
        const data = req.body;
        const idKelas = data.idKelas;
        const idDosen = data.idDosen;

        const result = await dataService.assignDosen(req.user.username,idKelas, idDosen)
        res.status(200).send({
            success: true,
            message: `Dosen with id ${idDosen} is assign to class with id ${idKelas}`,
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

exports.assignMahasiswa = async(req, res) => {
    try{
        const data = req.body;
        const idKelas = data.idKelas;
        const idMahasiswa = data.idMahasiswa;

        const result = await dataService.assignMahasiswa(req.user.username, idKelas, idMahasiswa)
        res.status(200).send({
            success: true,
            message: `Mahasiswa with id ${idMahasiswa} is assign to class with id ${idKelas}`,
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

// //Verifier
// exports.createVerifier = async(req, res) => {
//     try{
//         const data = req.body;
//         const name = data.nama;

//         const result = await dataService.createVerifier(req.user.username,name)
//         res.status(201).send({
//             message: "Verifier is created",
//             data
//         })
//     }
//     catch(error){
//         console.log("ERROR", error)
//         res.status(400).send({
//             success: false,
//             error: error.toString(),
//         })    
//     }
// }

// exports.updateVerifier = async(req, res) => {
//     try{
//         const data = req.body;
//         const name = data.nama;

//         const result = await dataService.updateVerifier(req.user.username,  name)
//         res.status(200).send({
//             message: `Verifier with id ${req.params.id} is updated`,
            
//         })
//     }
//     catch(error){
//         console.log("ERROR", error)
//         res.status(400).send({
//             success: false,
//             error: error.toString(),
//         })    
//     }
// }

// exports.deleteVerifier = async(req, res) => {
//     try{
//         const result = await dataService.deleteVerifier(req.user.username)
//         res.status(200).send({
//             message: `Verifier with id ${req.params.id} is deleted`,
//         })
//     }
//     catch(error){
//         console.log("ERROR", error)
//         res.status(400).send({
//             success: false,
//             error: error.toString(),
//         })    
//     }
// }


// exports.getAllVerifier = async(req, res) => {
//     data = await dataService.getAllVerifier(req.user.username) 
//     res.status(200).send({data});
// }




