const fabric = require("../utils/fabric.js")
const { v4: uuidv4 } = require('uuid')
const { getAllParser, getParser } = require('../utils/converter.js')
const { BlockDecoder } = require('fabric-common');
const { getAcademicRecordByIdMhsw } = require('./academicRecord.js')

// Ijazah
exports.createIjazah = async(user, args) => {
    const idIjazah = uuidv4()
    const network = await fabric.connectToNetwork("HE1", "ijzcontract", user)
    const result = await network.contract.submitTransaction( "CreateIjz", idIjazah, ...args)

    network.gateway.disconnect()
    return result;
}


exports.updateIjazah = async(user, args) => {
    const network = await fabric.connectToNetwork("HE1", "ijzcontract", user)
    const result = await network.contract.submitTransaction( "UpdateIjz", ...args)
    network.gateway.disconnect()
    return result;
}

exports.getIjazahById = async(user, idIjazah) => {
    const network = await fabric.connectToNetwork("HE1", "ijzcontract", user)
    const result = await network.contract.evaluateTransaction( "GetIjzById", idIjazah)
    network.gateway.disconnect()
    return getParser(result);
}

exports.getIjazahByIdPt = async(user, idPt) => {
    const network = await fabric.connectToNetwork("HE1", "ijzcontract", user)
    const queryData = await network.contract.evaluateTransaction( "GetIjzByIdSp", idPt)
    network.gateway.disconnect()
    return getAllParser(queryData)
}

exports.getIjazahByIdProdi = async(user, idProdi) => {
    const network = await fabric.connectToNetwork("HE1", "ijzcontract", user)
    const queryData = await network.contract.evaluateTransaction( "GetIjzByIdSms", idProdi)
    network.gateway.disconnect()
    return getAllParser(queryData)
}

exports.getIjazahByIdMahasiswa = async(user, idMahasiswa) => {
    const network = await fabric.connectToNetwork("HE1", "ijzcontract", user)
    const queryData = await network.contract.evaluateTransaction( "GetIjzByIdPd", idMahasiswa)
    network.gateway.disconnect()
    return getAllParser(queryData)
}

exports.getAllIjazah = async(user) => {
    const network = await fabric.connectToNetwork("HE1", "ijzcontract", user)
    const queryData = await network.contract.evaluateTransaction( "GetAllIjz")
    network.gateway.disconnect()
    return getAllParser(queryData)
}

// Transkrip
exports.createTranskrip = async(user, args) => {
    const idTranskrip = uuidv4()
    const network = await fabric.connectToNetwork("HE1", "tskcontract", user)
    const result = await network.contract.submitTransaction( "CreateTsk", idTranskrip, ...args)
    network.gateway.disconnect()
    return result;
}

exports.updateTranskrip = async(user, idranskrip, args) => {
    const network = await fabric.connectToNetwork("HE1", "tskcontract", user)
    const result = await network.contract.submitTransaction( "UpdateTsk", idranskrip, ...args)
    network.gateway.disconnect()
    return result;
}

exports.getAllTranskrip = async(user) => {
    const network = await fabric.connectToNetwork("HE1", "tskcontract", user)
    const queryData = await network.contract.evaluateTransaction( "GetAllTsk")
    network.gateway.disconnect()
    return getAllParser(queryData)
}

exports.getTranskripById = async(user, idTsk) => {
    const network = await fabric.connectToNetwork("HE1", "tskcontract", user)
    const result = await network.contract.evaluateTransaction( "GetTskById", idTsk)
    network.gateway.disconnect()
    return getParser(result);
}

exports.getTranskripByIdPt = async(user, idTsk) => {
    const network = await fabric.connectToNetwork("HE1", "tskcontract", user)
    const queryData = await network.contract.evaluateTransaction( "GetTskByIdSp", idTsk)
    network.gateway.disconnect()
    return getAllParser(queryData)
}

exports.getTranskripByIdProdi = async(user, idTsk) => {
    const network = await fabric.connectToNetwork("HE1", "tskcontract", user)
    const queryData = await network.contract.evaluateTransaction( "GetTskByIdSms", idTsk)
    network.gateway.disconnect()
    return getAllParser(queryData)
}

exports.getTranskripByIdMahasiswa = async(user, idTsk) => {
    const network = await fabric.connectToNetwork("HE1", "tskcontract", user)
    const queryData = await network.contract.evaluateTransaction( "GetTskByIdPd", idTsk)
    network.gateway.disconnect()
    return getAllParser(queryData)
}


// Sign and Verify----------------------------------------------------------
exports.setGraduated = async(user, idMahasiswa) => {
    const network = await fabric.connectToNetwork("HE1", "pdcontract", user)
    await network.contract.submitTransaction("SetPdGraduated", idMahasiswa)
    network.gateway.disconnect()
}

exports.approveIjazah = async(user, args) => {
    const network = await fabric.connectToNetwork("HE1", "ijzcontract", user)
    const result = await network.contract.submitTransaction( "AddIjzSignature", ...args)
    network.gateway.disconnect()
    return result;
}

exports.getIdentifier = async(user, idMahasiswa) => {
    var network = await fabric.connectToNetwork("HE1", "ijzcontract", user)
    const result = await network.contract.evaluateTransaction( "GetIjzByIdSp", idMahasiswa)
    const txIds = JSON.parse(result).txIds

    var network = await fabric.connectToNetwork("HE1", "qscc", 'admin')
    const block = await network.contract.evaluateTransaction('GetBlockByTxId', 'academicchannel', txIds[txIds.length - 1])
    network.gateway.disconnect()

    const blockDecode = BlockDecoder.decode(block)
    const identifier = fabric.calculateBlockHash(blockDecode.header)
    
    return identifier;
}

exports.addApprover = async(user, nama) => {
    const network = await fabric.connectToNetwork("HE1", "he", user)
    const result = await network.contract.submitTransaction( "DeleteIjz", "args" )
    network.gateway.disconnect()
    return true;
}

exports.verify = async(identifier) => {
    try {
        // match identifier with block
        const network = await fabric.connectToNetwork("Kemdikbud", "qscc", 'admin')
        const blockIjazah = await network.contract.evaluateTransaction('GetBlockByHash', 'academicchannel', Buffer.from(identifier, 'hex'))
        const blockIjazahDecode = BlockDecoder.decode(blockIjazah)
        const args = blockIjazahDecode.data.data[0].payload.data.actions[0].payload.chaincode_proposal_payload.input.chaincode_spec.input.args
        const idIjazah = Buffer.from(args[1]).toString()

        //query data ijazah, transkrip, nilai
        const ijazah = await getIjazahById(idIjazah)
        const idMahasiswa = ijazah.pd.id 
        const transkrip = await getTranskripByIdMahasiswa(idMahasiswa)
        const nilai = await getAcademicRecordByIdMhsw(idMahasiswa)
        const data = {
            "ijazah": ijazah,
            "transkrip": transkrip,
            "nilai": nilai
        }
    
        network.gateway.disconnect()
        result = {
            "success": true,
            "message": "Ijazah asli",
            "data": data
        }
        return result;
    } catch (error) {
        result = {
            "success": true,
            "message": "Ijazah palsu",
        }
        return result
    }

}

