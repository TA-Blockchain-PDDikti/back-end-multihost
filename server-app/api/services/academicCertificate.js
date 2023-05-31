const fabric = require("../utils/fabric.js")
const { v4: uuidv4 } = require('uuid')
const { getAllParser, getParser } = require('../utils/converter.js')
const { BlockDecoder } = require('fabric-common');
const { getAcademicRecordByIdMhsw } = require('./academicRecord.js')

const getIjzTxIds = async(user, id) => {
    const network = await fabric.connectToNetwork("HE1", "ijzcontract", user)
    const txIds = await network.contract.evaluateTransaction("GetIjzAddApprovalTxIdById", id)
    console.log("IJZ TX ID",txIds)
    return txIds
}

const getTskTxIds = async(user, id) => {
    const network = await fabric.connectToNetwork("HE1", "tskcontract", user)
    const txIds = await network.contract.evaluateTransaction("GetTskAddApprovalTxIdById", id)
    console.log("Tsk TX ID",txIds)
    return txIds
}


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

    const data =  await getParser(result)
    const txIds = await getIjzTxIds(user, data.id)
    data.signature =  await fabric.getAllSignature(txIds)
    return data
}

exports.getIjazahByIdPt = async(user, idPt) => {
    const network = await fabric.connectToNetwork("HE1", "ijzcontract", user)
    const queryData = await network.contract.evaluateTransaction( "GetIjzByIdSp", idPt)
    network.gateway.disconnect()
    
    const allData =  await getAllParser(queryData)
    await Promise.all(allData.map( async(item, index) => {
        const txIds = await getIjzTxIds(user, item.id)
        const signatures = await fabric.getAllSignature(txIds)
        allData[index].signatures = signatures
    }))
    return allData
}

exports.getIjazahByIdProdi = async(user, idProdi) => {
    const network = await fabric.connectToNetwork("HE1", "ijzcontract", user)
    const queryData = await network.contract.evaluateTransaction( "GetIjzByIdSms", idProdi)
    network.gateway.disconnect()
    
    const allData =  await getAllParser(queryData)
    await Promise.all(allData.map( async(item, index) => {
        const txIds = await getIjzTxIds(user, item.id)
        const signatures = await fabric.getAllSignature(txIds)
        allData[index].signatures = signatures
    }))
    return allData
}

exports.getIjazahByIdMahasiswa = async(user, idMahasiswa) => {
    const network = await fabric.connectToNetwork("HE1", "ijzcontract", user)
    const queryData = await network.contract.evaluateTransaction( "GetIjzByIdPd", idMahasiswa)
    network.gateway.disconnect()
    
    const allData =  await getAllParser(queryData)
    await Promise.all(allData.map( async(item, index) => {
        const txIds = await getIjzTxIds(user, item.id)
        const signatures = await fabric.getAllSignature(txIds)
        allData[index].signatures = signatures
    }))
    return allData
}

exports.getAllIjazah = async(user) => {
    const network = await fabric.connectToNetwork("HE1", "ijzcontract", user)
    const queryData = await network.contract.evaluateTransaction( "GetAllIjz")
    network.gateway.disconnect()
    
    const allData =  await getAllParser(queryData)
    await Promise.all(allData.map( async(item, index) => {
        const txIds = await getIjzTxIds(user, item.id)
        const signatures = await fabric.getAllSignature(txIds)
        allData[index].signatures = signatures
    }))
    return allData
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
    
    const allData =  await getAllParser(queryData)
    await Promise.all(allData.map( async(item, index) => {
        const txIds = await getTskTxIds(user, item.id)
        const signature = await fabric.getAllSignature(txIds)
        allData[index].signature = signature
    }))
    return allData
}

exports.getTranskripById = async(user, idTsk) => {
    const network = await fabric.connectToNetwork("HE1", "tskcontract", user)
    const result = await network.contract.evaluateTransaction( "GetTskById", idTsk)
    network.gateway.disconnect()

    const data =  await getParser(result)
    const txIds = await getTskTxIds(user, data.id)
    data.signatures =  await fabric.getAllSignature(txIds)
    return data
}

exports.getTranskripByIdPt = async(user, idTsk) => {
    const network = await fabric.connectToNetwork("HE1", "tskcontract", user)
    const queryData = await network.contract.evaluateTransaction( "GetTskByIdSp", idTsk)
    network.gateway.disconnect()
    
    const allData =  await getAllParser(queryData)
    await Promise.all(allData.map( async(item, index) => {
        const txIds = await getTskTxIds(user, item.id)
        const signatures = await fabric.getAllSignature(txIds)
        allData[index].signatures = signatures
    }))
    return allData
}

exports.getTranskripByIdProdi = async(user, idTsk) => {
    const network = await fabric.connectToNetwork("HE1", "tskcontract", user)
    const queryData = await network.contract.evaluateTransaction( "GetTskByIdSms", idTsk)
    network.gateway.disconnect()
    
    const allData =  await getAllParser(queryData)
    await Promise.all(allData.map( async(item, index) => {
        const txIds = await getTskTxIds(user, item.id)
        const signatures = await fabric.getAllSignature(txIds)
        allData[index].signatures = signatures
    }))
    return allData
}

exports.getTranskripByIdMahasiswa = async(user, idTsk) => {
    const network = await fabric.connectToNetwork("HE1", "tskcontract", user)
    const queryData = await network.contract.evaluateTransaction( "GetTskByIdPd", idTsk)
    network.gateway.disconnect()
    
    const allData =  await getAllParser(queryData)
    await Promise.all(allData.map( async(item, index) => {
        const txIds = await getTskTxIds(user, item.id)
        const signatures = await fabric.getAllSignature(txIds)
        allData[index].signatures = signatures
    }))
    return allData
}


// Sign and Verify----------------------------------------------------------
exports.setGraduated = async(user, lstMahasiswa) => {
    const network = await fabric.connectToNetwork("HE1", "pdcontract", user)
    await network.contract.submitTransaction("SetPdGraduatedBatch", lstMahasiswa)
    network.gateway.disconnect()
}

exports.approveIjazah = async(user, args) => {
    const network = await fabric.connectToNetwork("HE1", "ijzcontract", user)
    const result = await network.contract.submitTransaction( "AddIjzApproval", ...args)
    network.gateway.disconnect()
    return result;
}

exports.approveTranskrip = async(user, args) => {
    const network = await fabric.connectToNetwork("HE1", "tskcontract", user)
    const result = await network.contract.submitTransaction( "AddTskApproval", ...args)
    network.gateway.disconnect()
    return result;
}

exports.addApproverIjazah = async(user, args) => {
    const network = await fabric.connectToNetwork("HE1", "smscontract", user)
    const result = await network.contract.submitTransaction( "UpdateSmsSignersIjz", ...args)
    network.gateway.disconnect()
    return result;
}

exports.addApproverTranskrip = async(user, args) => {
    const network = await fabric.connectToNetwork("HE1", "smscontract", user)
    const result = await network.contract.submitTransaction( "UpdateSmsSignersTsk", ...args)
    network.gateway.disconnect()
    return result;
}

exports.generateIdentifier = async(user, idIjazah, idTranskrip) => {
    const txIdsIjz = await getIjzTxIds(user, idIjazah)
    const listTxIdIjz = JSON.parse(txIdsIjz)

    const txIdsTsk = await  getTskTxIds(user, idTranskrip)
    const listTxIdTsk = JSON.parse(txIdsTsk)


    // listTxIdIjzlength !== length dari signer ijazah
    if (listTxIdIjz.length === 0) {
        throw "Ijazah belum disetujui"
    }

      // listTxIdTsklength !== length dari signer Transkrip
    if (listTxIdTsk.length === 0) {
        throw "Transkrip belum disetujui"
    }


    const network = await fabric.connectToNetwork("Kemdikbud", "qscc", 'admin')
    const block = await network.contract.evaluateTransaction('GetBlockByTxID', 'academicchannel', listTxIdIjz[listTxIdIjz.length - 1])
    network.gateway.disconnect()

    const blockDecode = BlockDecoder.decode(block)
    const identifier = fabric.calculateBlockHash(blockDecode.header)
    
    return identifier;
}

exports.verify = async(identifier) => {
    try {
        // match identifier with block
        console.log(identifier)
        const network = await fabric.connectToNetwork("Kemdikbud", "qscc", 'admin')
        const blockIjazah = await network.contract.evaluateTransaction('GetBlockByHash', 'academicchannel', Buffer.from(identifier, 'hex'))
        const blockIjazahDecode = BlockDecoder.decode(blockIjazah)
        const args = blockIjazahDecode.data.data[0].payload.data.actions[0].payload.chaincode_proposal_payload.input.chaincode_spec.input.args
        console.log("args", Buffer.from(args[1]).toString())
        const idIjazah = Buffer.from(args[1]).toString()

        console.log("ID Ijazah",idIjazah)
        //query data ijazah, transkrip, nilai
        const ijazah = await this.getIjazahById("admin", idIjazah)
        const idMahasiswa = ijazah.pd.id 
        const transkrip = await this.getTranskripByIdMahasiswa("admin",idMahasiswa)
        const nilai = await getAcademicRecordByIdMhsw("admin",idMahasiswa)
        const data = {
            "ijazah": ijazah,
            "transkrip": transkrip[0],
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
        console.log("ERROR", error)
        result = {
            "success": true,
            "message": "Ijazah palsu",
        }
        return result
    }

}

