const { Gateway, Wallets } = require('fabric-network');

exports.createAcademicRecord = async(user, nama) => {
    const network = await fabric.connectToNetwork("he1.gradechain.com", "he-channel", "he", user)
    const result = await fabric.interactWithChaincode(true, network, "CreateNmhs", "args" )
    return result;
}

exports.updateAcademicRecord = async(user, nama) => {
    const network = await fabric.connectToNetwork("he1.gradechain.com", "he-channel", "he", user)
    const result = await fabric.interactWithChaincode(true, network, "UpdateNmhs", "args" )
    return result;
}

exports.deleteAcademicRecord = async(user) => {
    const network = await fabric.connectToNetwork("he1.gradechain.com", "he-channel", "he", user)
    const result = await fabric.interactWithChaincode(true, network, "DeleteNmhs", "args" )
    return result;
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
