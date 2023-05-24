const fabric = require("../utils/fabric.js")
const { v4: uuidv4 } = require('uuid')
const { getAllParser, getParser } = require('../utils/converter.js')

// Ijazah
exports.createIjazah = async(user, args) => {
    const idIjazah = uuidv4()
    const network = await fabric.connectToNetwork("he1", "ijzcontract", user)
    const result = await network.contract.submitTransaction( "CreateIjz", idIjazah, ...args)

    network.gateway.disconnect()
    return result;
}


exports.updateIjazah = async(user, args) => {
    const network = await fabric.connectToNetwork("he1", "ijzcontract", user)
    const result = await network.contract.submitTransaction( "UpdateIjz", ...args)
    network.gateway.disconnect()
    return result;
}

exports.getIjazahById = async(user, idIjazah) => {
    const network = await fabric.connectToNetwork("he1", "ijzcontract", user)
    const result = await network.contract.evaluateTransaction( "GetIjzById", idIjazah)
    network.gateway.disconnect()
    return getParser(result);
}

exports.getIjazahByIdPt = async(user, idPt) => {
    const network = await fabric.connectToNetwork("he1", "ijzcontract", user)
    const queryData = await network.contract.evaluateTransaction( "GetIjzByIdSp", idPt)
    network.gateway.disconnect()
    try {
        const result = getAllParser(queryData)
        return result
    } catch (error) {
        return []
    }
}

exports.getIjazahByIdProdi = async(user, idProdi) => {
    const network = await fabric.connectToNetwork("he1", "ijzcontract", user)
    const queryData = await network.contract.evaluateTransaction( "GetIjzByIdSms", idProdi)
    network.gateway.disconnect()
    try {
        const result = getAllParser(queryData)
        return result
    } catch (error) {
        return []
    }
}

exports.getIjazahByIdMahasiswa = async(user, idMahasiswa) => {
    const network = await fabric.connectToNetwork("he1", "ijzcontract", user)
    const queryData = await network.contract.evaluateTransaction( "GetIjzByIdPd", idMahasiswa)
    network.gateway.disconnect()
    try {
        const result = getAllParser(queryData)
        return result
    } catch (error) {
        return []
    }
}

exports.getAllIjazah = async(user) => {
    const network = await fabric.connectToNetwork("he1", "ijzcontract", user)
    const queryData = await network.contract.evaluateTransaction( "GetAllIjz")
    network.gateway.disconnect()
    try {
        const result = getAllParser(queryData)
        return result
    } catch (error) {
        return []
    }
}

// Transkrip
exports.createTranskrip = async(user, args) => {
    const idTranskrip = uuidv4()
    const network = await fabric.connectToNetwork("he1", "tskcontract", user)
    const result = await network.contract.submitTransaction( "CreateTsk", idTranskrip, ...args)
    network.gateway.disconnect()
    return result;
}

exports.updateTranskrip = async(user, idranskrip, args) => {
    const network = await fabric.connectToNetwork("he1", "tskcontract", user)
    const result = await network.contract.submitTransaction( "UpdateTsk", idranskrip, ...args)
    network.gateway.disconnect()
    return result;
}

exports.getAllTranskrip = async(user) => {
    const network = await fabric.connectToNetwork("he1", "tskcontract", user)
    const queryData = await network.contract.evaluateTransaction( "GetAllTsk")
    network.gateway.disconnect()
    try {
        const result = getAllParser(queryData)
        return result
    } catch (error) {
        return []
    }
}

exports.getTranskripById = async(user, idTsk) => {
    const network = await fabric.connectToNetwork("he1", "tskcontract", user)
    const result = await network.contract.evaluateTransaction( "GetTskById", idTsk)
    network.gateway.disconnect()
    return getParser(result);
}

exports.getTranskripByIdPt = async(user, idTsk) => {
    const network = await fabric.connectToNetwork("he1", "tskcontract", user)
    const queryData = await network.contract.evaluateTransaction( "GetTskByIdSp", idTsk)
    network.gateway.disconnect()
    try {
        const result = getAllParser(queryData)
        return result
    } catch (error) {
        return []
    }
}

exports.getTranskripByIdProdi = async(user, idTsk) => {
    const network = await fabric.connectToNetwork("he1", "tskcontract", user)
    const queryData = await network.contract.evaluateTransaction( "GetTskByIdSms", idTsk)
    network.gateway.disconnect()
    try {
        const result = getAllParser(queryData)
        return result
    } catch (error) {
        return []
    }
}

exports.getTranskripByIdMahasiswa = async(user, idTsk) => {
    const network = await fabric.connectToNetwork("he1", "tskcontract", user)
    const queryData = await network.contract.evaluateTransaction( "GetTskByIdPd", idTsk)
    network.gateway.disconnect()
    try {
        const result = getAllParser(queryData)
        return result
    } catch (error) {
        return []
    }
}


// Sign and Verify----------------------------------------------------------

exports.signIjazah = async(user, nama) => {
    const network = await fabric.connectToNetwork("he1", "ijzcontract", user)
    const result = await network.contract.submitTransaction( "DeleteIjz", "args" )
    network.gateway.disconnect()
    return result;
}

exports.getIdentifier = async(user, nama) => {
    const network = await fabric.connectToNetwork("he1", "he", user)
    const result = await network.contract.submitTransaction( "DeleteIjz", "args" )
    network.gateway.disconnect()
    result = {
        "identifier": "QBVDnkaoGGF12"
    }
    return result;
}

exports.generateIdentifier = async(user, idMahasiswa) => {
    const transkrip = await getTranskripByIdMahasiswa(idMahasiswa)
    const ijazah = await this.getIjazahByIdMahasiswa(idMahasiswa)

    var academicCertificate = {
        "ijazah": ijazah,
        "transkrip": transkrip
    }


    const network = await fabric.connectToNetwork("he1", "he", user)
    const result = await network.contract.evaluateTransaction( "DeleteIjz", "args" )
    network.gateway.disconnect()
    return true;
}

exports.addSigner = async(user, nama) => {
    const network = await fabric.connectToNetwork("he1", "he", user)
    const result = await network.contract.submitTransaction( "DeleteIjz", "args" )
    network.gateway.disconnect()
    return true;
}

exports.verify = async(user, identifier) => {
    const transkrip = await getTranskripByIdMahasiswa(idMahasiswa)
    const ijazah = await this.getIjazahByIdMahasiswa(idMahasiswa)

    const network = await fabric.connectToNetwork("he1", "he", user)
    const result = await network.contract.submitTransaction( "DeleteIjz", "args" )
    network.gateway.disconnect()
    return true;
}

