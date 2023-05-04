
const fabric = require("../utils/fabric.js")

exports.createPT = async(user, args) => {
    const network = await fabric.connectToNetwork("he1.gradechain.com", "he-channel", "he", user)
    const result = await fabric.interactWithChaincode(true, network, "CreateSp", "args" )
    return result;
}

exports.updatePT = async(user, args) => {
    const network = await fabric.connectToNetwork("he1.gradechain.com", "he-channel", "he", user)
    const result = await fabric.interactWithChaincode(true, network, "UpdateSp", "args" )
    return result;
}

exports.deletePT = async(user) => {
    const network = await fabric.connectToNetwork("he1.gradechain.com", "he-channel", "he", user)
    const result = await fabric.interactWithChaincode(true, network, "DeleteSp", "args" )
    return result;
}

exports.getAllPT = async(user) => {

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
exports.createProdi = async(user, nama) => {
    const network = await fabric.connectToNetwork("he1.gradechain.com", "he-channel", "he", user)
    const result = await fabric.interactWithChaincode(true, network, "CreateSms", "args" )
    return result;
}

exports.updateProdi = async(user, nama) => {
    const network = await fabric.connectToNetwork("he1.gradechain.com", "he-channel", "he", user)
    const result = await fabric.interactWithChaincode(true, network, "CreateSms", "args" )
    return result;
}

exports.deleteProdi = async(user) => {
    const network = await fabric.connectToNetwork("he1.gradechain.com", "he-channel", "he", user)
    const result = await fabric.interactWithChaincode(true, network, "CreateSms", "args" )
    return result;}

exports.getAllProdi = async(user) => {
    const network = await fabric.connectToNetwork("he1.gradechain.com", "he-channel", "he", user)
    const result = await fabric.interactWithChaincode(true, network, "GetAllSms", "args" )
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

exports.getProdiByPT = async(user) => {
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
exports.createDosen = async(user, nama) => {
    const network = await fabric.connectToNetwork("he1.gradechain.com", "he-channel", "he", user)
    const result = await fabric.interactWithChaincode(true, network, "CreatePtk", "args" )
    return result;
}

exports.updateDosen = async(user, nama) => {
    const network = await fabric.connectToNetwork("he1.gradechain.com", "he-channel", "he", user)
    const result = await fabric.interactWithChaincode(true, network, "UpdatePtk", "args" )
    return result;
}

exports.deleteDosen = async(user) => {
    const network = await fabric.connectToNetwork("he1.gradechain.com", "he-channel", "he", user)
    const result = await fabric.interactWithChaincode(true, network, "DeletePtk", "args" )
    return result;}

exports.getAllDosen = async(user) => {
    const network = await fabric.connectToNetwork("he1.gradechain.com", "he-channel", "he", user)
    const result = await fabric.interactWithChaincode(true, network, "DeleteSp", "args" )
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

exports.getDosenByPT = async(user) => {
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
exports.createMahasiswa = async(user, nama) => {
    const network = await fabric.connectToNetwork("he1.gradechain.com", "he-channel", "he", user)
    const result = await fabric.interactWithChaincode(true, network, "CreatePd", "args" )
    return result;
}

exports.updateMahasiswa = async(user, nama) => {
    const network = await fabric.connectToNetwork("he1.gradechain.com", "he-channel", "he", user)
    const result = await fabric.interactWithChaincode(true, network, "UpdatePd", "args" )
    return result;
}

exports.deleteMahasiswa = async(user) => {
    const network = await fabric.connectToNetwork("he1.gradechain.com", "he-channel", "he", user)
    const result = await fabric.interactWithChaincode(true, network, "DeletePd", "args" )
    return result;}

exports.getAllMahasiswa = async(user) => {
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

exports.getMahasiswaById = async(user) => {
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
exports.createMataKuliah = async(user, nama) => {
    const network = await fabric.connectToNetwork("he1.gradechain.com", "he-channel", "he", user)
    const result = await fabric.interactWithChaincode(true, network, "CreateMk", "args" )
    return result;
}

exports.updateMataKuliah = async(user, nama) => {
    const network = await fabric.connectToNetwork("he1.gradechain.com", "he-channel", "he", user)
    const result = await fabric.interactWithChaincode(true, network, "UpdateMk", "args" )
    return result;
}

exports.deleteMataKuliah = async(user) => {
    const network = await fabric.connectToNetwork("he1.gradechain.com", "he-channel", "he", user)
    const result = await fabric.interactWithChaincode(true, network, "DeleteMk", "args" )
    return result;}

exports.getAllMataKuliah = async(user) => {
    result = [{ 
        "id": 123,
        "idProdi":"12334",
        "nama": "Univ ABC",
        "kodeMatkul": "user123",
        "sks": 4,
        "jenjangPendidikan":"sarjana"  
    }]
    return result
}

//kelas
exports.createKelas = async(user, nama) => {
    const network = await fabric.connectToNetwork("he1.gradechain.com", "he-channel", "he", user)
    const result = await fabric.interactWithChaincode(true, network, "CreateKls", "args" )
    return result; 
}

exports.updateKelas = async(user, nama) => {
    const network = await fabric.connectToNetwork("he1.gradechain.com", "he-channel", "he", user)
    const result = await fabric.interactWithChaincode(true, network, "UpdateKls", "args" )
    return result;
}

exports.deleteKelas = async(user) => {
    const network = await fabric.connectToNetwork("he1.gradechain.com", "he-channel", "he", user)
    const result = await fabric.interactWithChaincode(true, network, "DeleteKls", "args" )
    return result;}

exports.assignDosen = async(user, idDosen) => {
    var listDosen = [];
    var dosen = idDosen;
    listDosen.push(dosen)

}

exports.assignMahasiswa = async(user, idMahasiswa) => {
    var listMahasiswa = [];
    var mahasiswa = idMahasiswa;
    listMahasiswa.push(mahasiswa)
}

exports.getAllKelas = async(user) => {
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

