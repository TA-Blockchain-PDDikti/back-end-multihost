const { Gateway, Wallets } = require('fabric-network');
const { randomUUID } = require('crypto');

exports.createAcademicRecord = async(user, idKls, idDosen, idMahasiswa, nilaiAngka, nilaiHuruf, nilaiIndex) => {
    const idNilai = randomUUID()
    const network = await fabric.connectToNetwork("he1.gradechain.com", "he-channel", "he", user)
    const result = await network.contract.submitTransaction("CreateNmhs", idNilai, idKls, idDosen, idMahasiswa, nilaiAngka, nilaiHuruf, nilaiIndex, new Date())
    network.gateway.disconnect()
    return result;
}

exports.updateAcademicRecord = async(user, idNilai, idKls, idDosen, idMahasiswa, nilaiAngka, nilaiHuruf, nilaiIndex) => {
    const network = await fabric.connectToNetwork("he1.gradechain.com", "he-channel", "he", user)
    const result = await network.contract.submitTransaction("UpdateNmhs", idNilai, idKls, idDosen, idMahasiswa, nilaiAngka, nilaiHuruf, nilaiIndex)
    network.gateway.disconnect()
    return result;
}

exports.deleteAcademicRecord = async(user, idNilai) => {
    const network = await fabric.connectToNetwork("he1.gradechain.com", "he-channel", "he", user)
    const result = await network.contract.submitTransaction("DeleteNmhs", idNilai)
    network.gateway.disconnect()
    return result;
}

exports.getAcademicRecordById = async(user, idNilai) => {
    const network = await fabric.connectToNetwork("he1.gradechain.com", "he-channel", "he", user)
    const result = await network.contract.evaluateTransaction("GetNmhsById", idNilai)
    network.gateway.disconnect()
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
