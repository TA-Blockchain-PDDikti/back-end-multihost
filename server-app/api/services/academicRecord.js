const fabric = require("../utils/fabric.js")
const sign = require("../utils/sign.js")
const { getAllParser, getParser } = require('../utils/converter.js')

exports.createAcademicRecord = async(user, idNilai, idKls, idDosen, idMahasiswa, nilaiAngka, nilaiHuruf, nilaiIndex) => {
    
    // Sign Nilai
    const nilaiToSign = [nilaiAngka, nilaiHuruf, nilaiIndex]
    const signature = await sign.createDigitalSignature(nilaiToSign, user)
    console.log("signature",signature)
    const network = await fabric.connectToNetwork("he1", "npdcontract", user)
    const result = await network.contract.submitTransaction("CreateNpd", idNilai, idKls, idDosen, idMahasiswa, nilaiAngka, nilaiHuruf, nilaiIndex)
    network.gateway.disconnect()
    return result;
}

exports.updateAcademicRecord = async(user, idNilai, idKls, idDosen, idMahasiswa, nilaiAngka, nilaiHuruf, nilaiIndex) => {
    const network = await fabric.connectToNetwork("he1", "npdcontract", user)
    const result = await network.contract.submitTransaction("UpdateNpd", idNilai, idKls, idDosen, idMahasiswa, nilaiAngka, nilaiHuruf, nilaiIndex)
    network.gateway.disconnect()
    return result;
}

exports.signAcademicRecord = async(user, idNilai) => {
    const signature = ""

    const network = await fabric.connectToNetwork("he1", "npdcontract", user)
    const result = await network.contract.submitTransaction("UpdateNpdSignature", idNilai, signature, user)
    network.gateway.disconnect()
    return result;
}

exports.deleteAcademicRecord = async(user, idNilai) => {
    const network = await fabric.connectToNetwork("he1", "npdcontract", user)
    const result = await network.contract.submitTransaction("DeleteNpd", idNilai)
    network.gateway.disconnect()
    return result;
}

exports.getAllAcademicRecord = async(user) => {
    const network = await fabric.connectToNetwork("he1", "npdcontract", user)
    const queryData = await network.contract.evaluateTransaction("GetAllNpd")
    network.gateway.disconnect()
    try {
        const result = getAllParser(queryData)
        return result
    } catch (error) {
        return []
    }
}

exports.getAcademicRecordById = async(user, id) => {
    const network = await fabric.connectToNetwork("he1", "npdcontract", user)
    const result = await network.contract.evaluateTransaction("GetNpdById", id)
    network.gateway.disconnect()
    return getParser(result)
}

exports.getAcademicRecordByIdMhsw = async(user, id) => {
    const network = await fabric.connectToNetwork("he1", "npdcontract", user)
    const result = await network.contract.evaluateTransaction("GetNpdByIdPd", id)
    network.gateway.disconnect()
    try {
        const result = getAllParser(queryData)
        return result
    } catch (error) {
        return []
    }
}

exports.getAcademicRecordByIdKls = async(user, id) => {
    const network = await fabric.connectToNetwork("he1", "npdcontract", user)
    const result = await network.contract.evaluateTransaction("GetNpdByIdKls", id)
    network.gateway.disconnect()
    try {
        const result = getAllParser(queryData)
        return result
    } catch (error) {
        return []
    }
}

exports.setGrade = async(user) => {
    return true
}
