const { Gateway, Wallets } = require('fabric-network');

exports.createPT = async(user, nama) => {
    return true;
}

exports.updatePT = async(user, nama) => {
    return true;
}

exports.deletePT = async(user) => {
    return true
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
    return true;
}

exports.updateProdi = async(user, nama) => {
    return true;
}

exports.deleteProdi = async(user) => {
    return true
}

exports.getAllProdi = async(user) => {
    result = [
        { 
            "id": "123",
            "PT": "UI",
            "nama": "Ilkom",
            "jenjangPendidikan": "user123"  
        }
    ]
    return result
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
    return true;
}

exports.updateDosen = async(user, nama) => {
    return true;
}

exports.deleteDosen = async(user) => {
    return true
}

exports.getAllDosen = async(user) => {
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
    return true;
}

exports.updateMahasiswa = async(user, nama) => {
    return true;
}

exports.deleteMahasiswa = async(user) => {
    return true
}

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
    result = [{ 
        "id": 123,
        "npm": "14567889",
        "PT":"UI",
        "Prodi":"Ilmu Komputer",
        "nama": "Farzana", 
        "totalMutu":120,
        "totalSks": 140,
        "ipk": 3.7
    }]
    return result
}

//mata kuliah
exports.createMataKuliah = async(user, nama) => {
    return true;
}

exports.updateMataKuliah = async(user, nama) => {
    return true;
}

exports.deleteMataKuliah = async(user) => {
    return true
}

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
    return true; 
}

exports.updateKelas = async(user, nama) => {
    return true;
}

exports.deleteKelas = async(user) => {
    return true
}

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
    return true
}

exports.getAllVerifier = async(user) => {
    result = { 
        "id": 123,
        "nama": "LPDP",
    }
    return result
}

