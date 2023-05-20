
const fabric = require("../utils/fabric.js")
const { getAllParser, getParser } = require('../utils/converter.js')

exports.createPT = async(user, idPt, namaPT, adminPT) => {
    // Add 'pendidikan tinggi' data to blockchain
    const network = await fabric.connectToNetwork("he1", "academicchannel", "spcontract", user)
    await network.contract.submitTransaction("CreateSp", idPt, 'HE1MSP', namaPT)
    network.gateway.disconnect()
    return idPt;
}

exports.updatePT = async(user, idPT, namaPT, adminPT) => {
    const network = await fabric.connectToNetwork("he1", "academicchannel", "spcontract", user)
    const result = await network.contract.submitTransaction("UpdateSp", idPT, 'HE1MSP', namaPT)
    network.gateway.disconnect()
    return result;
}

exports.deletePT = async(user, idPT) => {
    const network = await fabric.connectToNetwork("he1", "academicchannel", "spcontract", user)
    const result = await network.contract.submitTransaction("DeleteSp", idPT)
    network.gateway.disconnect()
    return result;
}

exports.getAllPT = async(user) => {
    const network = await fabric.connectToNetwork("he1", "academicchannel", "spcontract", user)
    const queryData = await network.contract.evaluateTransaction("GetAllSp")
    network.gateway.disconnect()
    try {
        const result = JSON.parse(queryData)
        return result
    } catch (error) {
        return []
    }
    
}

exports.getPTById = async(user, idPT) => {
    const network = await fabric.connectToNetwork("he1", "academicchannel", "spcontract", user)
    const queryData = await network.contract.evaluateTransaction("GetSpById", idPT)
    network.gateway.disconnect()
    return JSON.parse(queryData)
}

//Prodi
exports.createProdi = async(user, idProdi, idPT, nama, jenjangPendidikan) => {
    const network = await fabric.connectToNetwork("he1", "academicchannel", "smscontract", user)
    const result = await network.contract.submitTransaction("CreateSms", idProdi, idPT, nama, jenjangPendidikan)
    network.gateway.disconnect()
    return result;
}

exports.updateProdi = async(user, idProdi, idPT, nama, jenjangPendidikan) => {
    const network = await fabric.connectToNetwork("he1", "academicchannel", "smscontract", user)
    const result = await network.contract.submitTransaction("UpdateSms", idProdi, idPT, nama, jenjangPendidikan)
    network.gateway.disconnect()
    return result;
}

exports.deleteProdi = async(user, idProdi) => {
    const network = await fabric.connectToNetwork("he1", "academicchannel", "smscontract", user)
    const result = await network.contract.submitTransaction("DeleteSms", idProdi)
    network.gateway.disconnect()
    return result;}

exports.getAllProdi = async(user) => {
    const network = await fabric.connectToNetwork("he1", "academicchannel", "smscontract", user)
    const queryData = await network.contract.evaluateTransaction("GetAllSms")
    network.gateway.disconnect()
    try {
        const result = getAllParser(queryData)
        return result
    } catch (error) {
        return []
    }
}

exports.getProdiByPT = async(user, idPT) => {
    const network = await fabric.connectToNetwork("he1", "academicchannel", "smscontract", user)
    const queryData = await network.contract.evaluateTransaction("GetSmsByIdSp", idPT)
    network.gateway.disconnect()
    try {
        const result = await getAllParser(queryData)
        return result
    } catch (error) {
        return []
    }
}

exports.getProdiById = async(user, idProdi) => {
    const network = await fabric.connectToNetwork("he1", "academicchannel", "smscontract", user)
    const result = await network.contract.evaluateTransaction("GetSmsById", idProdi)
    network.gateway.disconnect()
    return getParser(result)
}

//dosen
exports.createDosen = async(user,idDosen, idPT,idProdi,nama) => {
    // Add 'dosen' data to blockchain
    const network = await fabric.connectToNetwork("he1", "academicchannel", "ptkcontract", user)
    const result = await network.contract.submitTransaction("CreatePtk", idDosen, idPT, idProdi,nama)
    network.gateway.disconnect()

    return result;
}

exports.updateDosen = async(user,idDosen, idPT,idProdi,nama) => {
    const network = await fabric.connectToNetwork("he1", "academicchannel", "ptkcontract", user)
    const result = await network.contract.submitTransaction("UpdatePtk",idDosen, idPT,idProdi,nama )
    network.gateway.disconnect()
    return result;
}

exports.signDosen = async(user,idDosen, nidn) => {
    const signature = ""
    const network = await fabric.connectToNetwork("he1", "academicchannel", "ptkcontract", user)
    const result = await network.contract.submitTransaction("UpdatePtkNidnAndSign",idDosen, nidn, signature )
    network.gateway.disconnect()
    return result;
}

exports.deleteDosen = async(user, idDosen) => {
    const network = await fabric.connectToNetwork("he1", "academicchannel", "ptkcontract", user)
    const result = await network.contract.submitTransaction("DeletePtk", idDosen)
    network.gateway.disconnect()
    return result;}

exports.getAllDosen = async(user) => {
    const network = await fabric.connectToNetwork("he1", "academicchannel", "ptkcontract", user)
    const queryData = await network.contract.evaluateTransaction("GetAllPtk")
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
    try {
        const result = getAllParser(queryData)
        return result
    } catch (error) {
        return []
    }
}

exports.getDosenByPT = async(user, idPT) => {
    const network = await fabric.connectToNetwork("he1", "academicchannel", "ptkcontract", user)
    const queryData = await network.contract.evaluateTransaction("GetPtkByIdSp", idPT)
    network.gateway.disconnect()

    // //TODO: Filter by  PT 
    // result = {
    //     "PT":"UI",
    //     "listDosen":[
    //     { 
    //     "id": "123",
    //     "Prodi":"Ilmu Komputer",
    //     "nidn": "12344",
    //     "nama": "Petrus Mursanto",
    //     "nomorST":"234",
    //     "jabatan":"dekan",
    //     "nomorSK":"1334",
    //     "sign":"hash",
    //     "signJab":"hash" 
    // }]}
    try {
        const result = getAllParser(queryData)
        return result
    } catch (error) {
        return []
    }
}


exports.getDosenById = async(user, idDosen) => {
    const network = await fabric.connectToNetwork("he1", "academicchannel", "ptkcontract", user)
    const result = await network.contract.evaluateTransaction("GetPtkById", idDosen)
    network.gateway.disconnect()
    return getParser(result)
}

//mahasiswa
exports.createMahasiswa = async(user, idMahasiswa, idPT, idProdi, nama, nipd) => {
    // Add 'mahasiswa' data to blockchain
    const network = await fabric.connectToNetwork("he1", "academicchannel", "pdcontract", user)
    const result = await network.contract.submitTransaction("CreatePd", idMahasiswa, idPT, idProdi, nama, nipd)
    network.gateway.disconnect()
    return result;
}

exports.updateMahasiswa = async(user, idMahasiswa, idPT, idProdi, nama, nipd) => {
    const network = await fabric.connectToNetwork("he1", "academicchannel", "pdcontract", user)
    const result = await network.contract.submitTransaction("UpdatePd", idMahasiswa, idPT, idProdi, nama, nipd)
    network.gateway.disconnect()
    return result;
}

exports.deleteMahasiswa = async(user, idMahasiswa) => {
    const network = await fabric.connectToNetwork("he1", "academicchannel", "pdcontract", user)
    const result = await network.contract.submitTransaction("DeletePd", idMahasiswa)
    network.gateway.disconnect()
    return result;}

exports.getAllMahasiswa = async(user) => {
    const network = await fabric.connectToNetwork("he1", "academicchannel", "pdcontract", user)
    const queryData = await network.contract.evaluateTransaction("GetAllPd")
    network.gateway.disconnect()
    try {
        const result = getAllParser(queryData)
        return result
    } catch (error) {
        return []
    }
}

exports.getMahasiswaById = async(user, idMahasiswa) => {
    const network = await fabric.connectToNetwork("he1", "academicchannel", "pdcontract", user)
    const result = await network.contract.evaluateTransaction("GetPdById", idMahasiswa)
    network.gateway.disconnect()
    console.log(getAllParser(result))
    return getParser(result)
}

exports.getMahasiswaByPT = async(user, idPt) => {
    const network = await fabric.connectToNetwork("he1", "academicchannel", "pdcontract", user)
    const queryData = await network.contract.evaluateTransaction("GetPdByIdSp", idPt)
    network.gateway.disconnect()

    // Filter by PT
    // result = {
    //     "PT":"UI",
    //     "listMahasiswa":[{ 
    //     "id": 123,
    //     "npm": "14567889",
    //     "Prodi":"Ilmu Komputer",
    //     "nama": "Farzana", 
    //     "jenjangPendidikan": "S1",
    //     "status": "Lulus",
    //     "nomorIjazah": "N123",
    //     "totalMutu":120,
    //     "totalSks": 140,
    //     "ipk": 3.7
    // }]}
    try {
        const result = getAllParser(queryData)
        return result
    } catch (error) {
        return []
    }
}

exports.getMahasiswaByKelas = async(user, idKelas) => {
    const network = await fabric.connectToNetwork("he1", "academicchannel", "pdcontract", user)
    const queryData = await network.contract.evaluateTransaction("GetPdByIdKls", idKelas)
    network.gateway.disconnect()

    // Filter by Kelas
    // result = {
    //     "kelas":"basdat A",
    //     "mahasiswa":[{ 
    //     "id": 123,
    //     "npm": "14567889",
    //     "pt":"UI",
    //     "prodi":"Ilmu Komputer",
    //     "nama": "Farzana", 
    //     "totalMutu":120,
    //     "totalSks": 140,
    //     "ipk": 3.7
    // }]}
    try {
        const result = getAllParser(queryData)
        return result
    } catch (error) {
        return []
    }
}

//mata kuliah
exports.createMataKuliah = async(user, idMk,  idPt, idProdi,  nama, sks, jenjangPendidikan) => {
    const network = await fabric.connectToNetwork("he1", "academicchannel", "mkcontract", user)
    const result = await network.contract.submitTransaction("CreateMk", idMk, idPt, idProdi, nama, sks, jenjangPendidikan)
    network.gateway.disconnect()
    return result;
}

exports.updateMataKuliah = async(user, idMK, idPt, idProdi,  nama, sks, jenjangPendidikan) => {
    console.log(idProdi, idPt)
    const network = await fabric.connectToNetwork("he1", "academicchannel", "mkcontract", user)
    const result = await network.contract.submitTransaction("UpdateMk", idMK, idPt, idProdi, nama, sks, jenjangPendidikan)
    network.gateway.disconnect()
    return result;
}

exports.deleteMataKuliah = async(user, idMK) => {
    const network = await fabric.connectToNetwork("he1", "academicchannel", "mkcontract", user)
    const result = await network.contract.submitTransaction("DeleteMk", idMK)
    network.gateway.disconnect()
    return result;}

exports.getAllMataKuliah = async(user) => {
    const network = await fabric.connectToNetwork("he1", "academicchannel", "mkcontract", user)
    const queryData = await network.contract.evaluateTransaction("GetAllMk")
    network.gateway.disconnect()
    // result = [{ 
    //     "id": 123,
    //     "namaProdi":"12334",
    //     "nama": "Univ ABC",
    //     "kodeMatkul": "user123",
    //     "sks": 4,
    //     "jenjangPendidikan":"sarjana"  
    // }]
    try {
        const result = getAllParser(queryData)
        return result
    } catch (error) {
        return []
    }
}


exports.getMataKuliahById = async(user, idMk) => {
    const network = await fabric.connectToNetwork("he1", "academicchannel", "mkcontract", user)
    const result = await network.contract.evaluateTransaction("GetMkById", idMk)
    network.gateway.disconnect()

    //TODO: Filter by  PT 
    // result = {
    //     "PT":"UI",
    //     "listDosen":[
    //     { 
    //     "id": "123",
    //     "Prodi":"Ilmu Komputer",
    //     "nidn": "12344",
    //     "nama": "Petrus Mursanto",
    //     "nomorST":"234",
    //     "jabatan":"dekan",
    //     "nomorSK":"1334",
    //     "sign":"hash",
    //     "signJab":"hash" 
    // }]}
    return getParser(result)
}

exports.getMataKuliahByIdPt = async(user, idPt) => {
    const network = await fabric.connectToNetwork("he1", "academicchannel", "mkcontract", user)
    const result = await network.contract.evaluateTransaction("GetMkByIdSp", idPt)
    network.gateway.disconnect()

    //TODO: Filter by  PT 
    // result = {
    //     "PT":"UI",
    //     "listDosen":[
    //     { 
    //     "id": "123",
    //     "Prodi":"Ilmu Komputer",
    //     "nidn": "12344",
    //     "nama": "Petrus Mursanto",
    //     "nomorST":"234",
    //     "jabatan":"dekan",
    //     "nomorSK":"1334",
    //     "sign":"hash",
    //     "signJab":"hash" 
    // }]}
    return getAllParser(result)
}

//kelas
exports.createKelas = async(user, idKelas, idProdi, idMk, nama, semester, sks) => {
    const network = await fabric.connectToNetwork("he1", "academicchannel", "klscontract", user)
    console.log("haloo", idKelas, idProdi, idMk, nama, semester, sks)
    const result = await network.contract.submitTransaction("CreateKls", idKelas, idProdi, idMk, nama, semester, sks)
    network.gateway.disconnect()
    return result; 
}

exports.updateKelas = async(user, idKelas, idProdi, idMk, nama, semester, sks) => {
    const network = await fabric.connectToNetwork("he1", "academicchannel", "klscontract", user)
    const result = await network.contract.submitTransaction("UpdateKls", idKelas, idProdi, idMk, nama, semester, sks)
    network.gateway.disconnect()
    return result;
}

exports.deleteKelas = async(user, idKelas) => {
    const network = await fabric.connectToNetwork("he1", "academicchannel", "klscontract", user)
    const result = await network.contract.submitTransaction("DeleteKls", idKelas)
    network.gateway.disconnect()
    return result;}

exports.assignDosen = async(user, idKelas, idDosen) => {
    const network = await fabric.connectToNetwork("he1", "academicchannel", "klscontract", user)
    const result = await network.contract.submitTransaction("UpdateKlsListPtk", idKelas, idDosen)
    network.gateway.disconnect()

}

exports.assignMahasiswa = async(user, idKelas, idMahasiswa) => {
    const network = await fabric.connectToNetwork("he1", "academicchannel", "klscontract", user)
    const result = await network.contract.submitTransaction("UpdateKlsListPd", idKelas, idMahasiswa)
    network.gateway.disconnect()

}

exports.getAllKelas = async(user) => {
    const network = await fabric.connectToNetwork("he1", "academicchannel", "klscontract", user)
    const queryData = await network.contract.evaluateTransaction("GetAllKls")
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
    try {
        const result = getAllParser(queryData)
        return result
    } catch (error) {
        return []
    }
}


exports.getKelasById = async(user, idKelas) => {
    const network = await fabric.connectToNetwork("he1", "academicchannel", "klscontract", user)
    const result = await network.contract.evaluateTransaction("GetKlsById", idKelas)
    network.gateway.disconnect()
    return getParser(result)
}


exports.getAllVerifier = async(user) => {
    result = { 
        "id": 123,
        "nama": "LPDP",
    }
    return result
}

