
const fabric = require("../utils/fabric.js")
const { v4: uuidv4 } = require('uuid')
const user = require("./user.js")

exports.createPT = async(user, namaPT, adminPT) => {
    // Add 'perguruan tinggi' data to blockchain
    const idPT = uuidv4()
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.submitTransaction("CreateSp", idPT, 'HE1MSP', namaPT, adminPT)
    network.gateway.disconnect()

    // Register admin PT identity to CA
    const registerResult = await user.registerUser(adminPT, 'he1', "admin PT")

    return result;
}

exports.updatePT = async(user, idPT, namaPT, adminPT) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.submitTransaction("UpdateSp", idPT, 'HE1MSP', namaPT, adminPT)
    network.gateway.disconnect()
    return result;
}

exports.deletePT = async(user, idPT) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.submitTransaction("DeleteSp", idPT)
    network.gateway.disconnect()
    return result;
}

exports.getAllPT = async(user) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.evaluateTransaction("GetAllSp")
    network.gateway.disconnect()
    result = [
        { 
            "id": 123,
            "nama": "Univ ABC",
            "adminPT": "user123"  
        },
        { 
            "id": 124,
            "nama": "Univ ABD",
            "adminPT": "user124"  
        },
    ]
    return result
}

exports.getPTById = async(user, idPT) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.evaluateTransaction("GetSpById", idPT)
    network.gateway.disconnect()
    result = [
        { 
            "id": 123,
            "nama": "Univ ABC",
            "adminPT": "user123"  
        },
        { 
            "id": 124,
            "nama": "Univ ABD",
            "adminPT": "user124"  
        },
    ]
    return result
}

//Prodi
exports.createProdi = async(user, idPT, nama, jenjangPendidikan) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const prodiId = uuidv4()
    const result = await network.contract.submitTransaction("CreateSms", prodiId, idPT, nama, jenjangPendidikan)
    network.gateway.disconnect()
    return result;
}

exports.updateProdi = async(user, idProdi, idPT, nama, jenjangPendidikan) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.submitTransaction("UpdateSms", idProdi, idPT, nama, jenjangPendidikan)
    network.gateway.disconnect()
    return result;
}

exports.deleteProdi = async(user, idProdi) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.submitTransaction("DeleteSms", idProdi)
    network.gateway.disconnect()
    return result;}

exports.getAllProdi = async(user) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.evaluateTransaction("GetAllSms")
    network.gateway.disconnect()
    response = [
        { 
            "id": "123",
            "PT": "UI",
            "nama": "Ilkom",
            "jenjangPendidikan": "user123"  
        }
    ]
    return response
}

exports.getProdiByPT = async(user, idPT) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const resultAll = await network.contract.evaluateTransaction("GetAllSms")
    network.gateway.disconnect()

    //TODO: Filter by  PT 
    result = { 
        "PT": "UI",
        "listProdi": [{ 
            "id": "123",
            "nama": "Ilkom",
            "jenjangPendidikan": "user123"  
        }] }
    return result
}

exports.getProdiById = async(user, idProdi) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const resultAll = await network.contract.evaluateTransaction("GetSmsById", idProdi)
    network.gateway.disconnect()

    result = { 
        "PT": "UI",
        "listProdi": [{ 
            "id": "123",
            "nama": "Ilkom",
            "jenjangPendidikan": "user123"  
        }] }
    return result
}

//dosen
exports.createDosen = async(user,idPT,idProdi,nama,nomorST, email) => {
    // Add 'dosen' data to blockchain
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const idDosen = uuidv4()
    const result = await network.contract.submitTransaction("CreatePtk", idDosen, idPT, idProdi,nama,nomorST)
    network.gateway.disconnect()

    // Register dosen identity to CA
    const registerResult = await user.registerUser(email, 'he1', "dosen")
    return result;
}

exports.updateDosen = async(user,idDosen, idPT,idProdi,nama,nomorST) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.submitTransaction("UpdatePtk",idDosen, idPT,idProdi,nama,nomorST )
    network.gateway.disconnect()
    return result;
}

exports.deleteDosen = async(user, idDosen) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.submitTransaction("DeletePtk", idDosen)
    network.gateway.disconnect()
    return result;}

exports.getAllDosen = async(user) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.evaluateTransaction("GetAllPtk")
    network.gateway.disconnect()
    result = [{ 
        "id": "123",
        "PT":"UI",
        "Prodi":"Ilmu Komputer",
        "nidn": "12344",
        "nama": "Petrus Mursanto",
        "nomorST":"234",
        "jabatan":"dekan",
        "nomorSK":"1334",
        "sign":"hash",
        "signJab":"hash" 
    }]
    return result
}

exports.getDosenByPT = async(user, idPT) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const resultAll = await network.contract.evaluateTransaction("GetAllPtk")
    network.gateway.disconnect()

    //TODO: Filter by  PT 
    result = {
        "PT":"UI",
        "listDosen":[
        { 
        "id": "123",
        "Prodi":"Ilmu Komputer",
        "nidn": "12344",
        "nama": "Petrus Mursanto",
        "nomorST":"234",
        "jabatan":"dekan",
        "nomorSK":"1334",
        "sign":"hash",
        "signJab":"hash" 
    }]}
    return result
}


exports.getDosenById = async(user, idDosen) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const resultAll = await network.contract.evaluateTransaction("GetPtkById", idDosen)
    network.gateway.disconnect()

    result = {
        "PT":"UI",
        "listDosen":[
        { 
        "id": "123",
        "Prodi":"Ilmu Komputer",
        "nidn": "12344",
        "nama": "Petrus Mursanto",
        "nomorST":"234",
        "jabatan":"dekan",
        "nomorSK":"1334",
        "sign":"hash",
        "signJab":"hash" 
    }]}
    return result
}

//mahasiswa
exports.createMahasiswa = async(user, idPT, idProdi, nama, nipd, email) => {
    // Add 'mahasiswa' data to blockchain
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const idMahasiswa = uuidv4()
    const result = await network.contract.submitTransaction("CreatePd", idMahasiswa, idPT, idProdi, nama, nipd)
    network.gateway.disconnect()

    // Register mahasiswa identity to CA
    const registerResult = await user.registerUser(email, 'he1', "mahasiswa")
    return result;
}

exports.updateMahasiswa = async(user, idMahasiswa, idPT, idProdi, nama, nipd) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.submitTransaction("UpdatePd", idMahasiswa, idPT, idProdi, nama, nipd)
    network.gateway.disconnect()
    return result;
}

exports.deleteMahasiswa = async(user, idMahasiswa) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.submitTransaction("DeletePd", idMahasiswa)
    network.gateway.disconnect()
    return result;}

exports.getAllMahasiswa = async(user) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.evaluateTransaction("GetAllPd")
    network.gateway.disconnect()
    result = [
        { 
            "id": 123,
            "npm": "14567889",
            "nama": "Univ ABC", 
        },
        { 
            "id": 123,
            "npm": "14567889",
            "nama": "Univ ABC", 
        }
    ]
    return result
}

exports.getMahasiswaById = async(user, idMahasiswa) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.evaluateTransaction("GetPdById", idMahasiswa)
    network.gateway.disconnect()

    result = { 
        "id": 123,
        "npm": "14567889",
        "PT":"UI",
        "Prodi":"Ilmu Komputer",
        "nama": "Farzana", 
        "jenjangPendidikan": "S1",
        "status": "Lulus",
        "nomorIjazah": "N123",
        "totalMutu":120,
        "totalSks": 140,
        "ipk": 3.7
    }
    return result
}

exports.getMahasiswaByPT = async(user) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.evaluateTransaction("GetAllPd")
    network.gateway.disconnect()

    // Filter by PT
    result = {
        "PT":"UI",
        "listMahasiswa":[{ 
        "id": 123,
        "npm": "14567889",
        "Prodi":"Ilmu Komputer",
        "nama": "Farzana", 
        "jenjangPendidikan": "S1",
        "status": "Lulus",
        "nomorIjazah": "N123",
        "totalMutu":120,
        "totalSks": 140,
        "ipk": 3.7
    }]}
    return result
}

exports.getMahasiswaByKelas = async(user) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.evaluateTransaction("GetAllPd")
    network.gateway.disconnect()

    // Filter by Kelas
    result = {
        "kelas":"basdat A",
        "mahasiswa":[{ 
        "id": 123,
        "npm": "14567889",
        "pt":"UI",
        "prodi":"Ilmu Komputer",
        "nama": "Farzana", 
        "totalMutu":120,
        "totalSks": 140,
        "ipk": 3.7
    }]}
    return result
}

//mata kuliah
exports.createMataKuliah = async(user, idProdi, nama, sks, jenjangPendidikan) => {
    const idMK = uuidv4()
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.submitTransaction("CreateMk", idMK, idProdi, nama, sks, jenjangPendidikan)
    network.gateway.disconnect()
    return result;
}

exports.updateMataKuliah = async(user, idMK, idProdi, nama, sks, jenjangPendidikan) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.submitTransaction("UpdateMk", idMK, idProdi, nama, sks, jenjangPendidikan)
    network.gateway.disconnect()
    return result;
}

exports.deleteMataKuliah = async(user, idMK) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.submitTransaction("DeleteMk", idMK)
    network.gateway.disconnect()
    return result;}

exports.getAllMataKuliah = async(user) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.evaluateTransaction("GetAllMk")
    network.gateway.disconnect()
    result = [{ 
        "id": 123,
        "namaProdi":"12334",
        "nama": "Univ ABC",
        "kodeMatkul": "user123",
        "sks": 4,
        "jenjangPendidikan":"sarjana"  
    }]
    return result
}


exports.getMataKuliahById = async(user, idMk) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const resultAll = await network.contract.evaluateTransaction("GetMkById", idMk)
    network.gateway.disconnect()

    //TODO: Filter by  PT 
    result = {
        "PT":"UI",
        "listDosen":[
        { 
        "id": "123",
        "Prodi":"Ilmu Komputer",
        "nidn": "12344",
        "nama": "Petrus Mursanto",
        "nomorST":"234",
        "jabatan":"dekan",
        "nomorSK":"1334",
        "sign":"hash",
        "signJab":"hash" 
    }]}
    return result
}

//kelas
exports.createKelas = async(user, idProdi, idMk, nama, semeter, sks) => {
    const idKelas = uuidv4()
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.submitTransaction("CreateKls", idKelas, idProdi, idMk, nama, semeter, sks)
    network.gateway.disconnect()
    return result; 
}

exports.updateKelas = async(user, idKelas, idProdi, idMk, nama, semeter, sks) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.submitTransaction("UpdateKls", idKelas, idProdi, idMk, nama, semeter, sks)
    network.gateway.disconnect()
    return result;
}

exports.deleteKelas = async(user, idKelas) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.submitTransaction("DeleteKls", idKelas)
    network.gateway.disconnect()
    return result;}

exports.assignDosen = async(user, idKelas, idDosen) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.submitTransaction("AddPtkKls", idKelas, idDosen)
    network.gateway.disconnect()

}

exports.assignMahasiswa = async(user, idKelas, idMahasiswa) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.submitTransaction("AddPdKls", idKelas, idMahasiswa)
    network.gateway.disconnect()

}

exports.getAllKelas = async(user) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.evaluateTransaction("GetAllKls")
    network.gateway.disconnect()
    result = [{ 
        "id": 123,
        "Prodi":"Ilmu Komputer",
        "matkul":"Basis Data",
        "kelas": "Basis Data A",
        "sks": 3,
        "semester": "Gasal 2018/2019",
        "listDosen": [],
        "listMahasiswa": []
    }]
    return result
}


exports.getKelasById = async(user, idKelas) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const resultAll = await network.contract.evaluateTransaction("GetKlsById", idKelas)
    network.gateway.disconnect()

    result = {
        "PT":"UI",
        "listDosen":[
        { 
        "id": "123",
        "Prodi":"Ilmu Komputer",
        "nidn": "12344",
        "nama": "Petrus Mursanto",
        "nomorST":"234",
        "jabatan":"dekan",
        "nomorSK":"1334",
        "sign":"hash",
        "signJab":"hash" 
    }]}
    return result
}

//verifier
exports.createVerifier = async(user, nama) => {
    return true;
}

exports.updateVerifier = async(user, nama) => {
    return true;
}

exports.deleteVerifier = async(user) => {
    return true;
}

exports.getAllVerifier = async(user) => {
    result = { 
        "id": 123,
        "nama": "LPDP",
    }
    return result
}

