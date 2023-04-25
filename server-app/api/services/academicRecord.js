const { Gateway, Wallets } = require('fabric-network');

exports.createAcademicRecord = async(user, nama) => {
    return true;
}

exports.updateAcademicRecord = async(user, nama) => {
    return true;
}

exports.deleteAcademicRecord = async(user) => {
    return true
}

exports.getAcademicRecordById = async(user) => {
    result = [
        { 
            "id": 123,
            "mataKuliah": "Univ ABC",
            "dosen": "user123",
            "mahasiswa": "far",
            "nilaiAngka": 87,
            "nilaiHuruf": "A",
            "nilaiIndex": 4.0,
            "createdAt": "4-5-2023",
            "signMhsw": "hash"  
        },
    ]
    return result
}

exports.setGrade = async(user) => {
    return true
}
