const fabric = require("../utils/fabric.js")

exports.createAcademicRecord = async(user, args) => {
    const network = await fabric.connectToNetwork("HE1", "npdcontract", user)
    const result = await network.contract.submitTransaction("CreateNpd", ...args)
    network.gateway.disconnect()
    return result;
}

exports.updateAcademicRecord = async(user, args) => {
    const network = await fabric.connectToNetwork("HE1", "npdcontract", user)
    const result = await network.contract.submitTransaction("UpdateNpd", ...args)
    network.gateway.disconnect()
    return result;
}


exports.deleteAcademicRecord = async(user, idNilai) => {
    const network = await fabric.connectToNetwork("HE1", "npdcontract", user)
    const result = await network.contract.submitTransaction("DeleteNpd", idNilai)
    network.gateway.disconnect()
    return result;
}

exports.getAllAcademicRecord = async(user) => {
    const network = await fabric.connectToNetwork("HE1", "npdcontract", user)
    const queryData = await network.contract.evaluateTransaction("GetAllNpd")
    network.gateway.disconnect()
    try {
        var allData  =  JSON.parse(queryData)
    } catch(error){
        return []
    }
    return allData
    
}

exports.getAcademicRecordById = async(user, id) => {
    const network = await fabric.connectToNetwork("HE1", "npdcontract", user)
    const result = await network.contract.evaluateTransaction("GetNpdById", id)
    network.gateway.disconnect()

    const data = JSON.parse(result)
    return data
}

exports.getAcademicRecordByIdMhsw = async(user, id) => {
    const network = await fabric.connectToNetwork("HE1", "npdcontract", user)
    const queryData = await network.contract.evaluateTransaction("GetNpdByIdPd", id)
    network.gateway.disconnect()

    try {
        var allData  =  JSON.parse(queryData)
    } catch(error){
        return []
    }

    await Promise.all(allData.map( async(item, index) => {
        const signature =  await fabric.getSignature(item.lastTxId)
        allData[index].signature = signature
    }))
    return allData


}

exports.getAcademicRecordByIdKls = async(user, id) => {
    const network = await fabric.connectToNetwork("HE1", "npdcontract", user)
    const queryData = await network.contract.evaluateTransaction("GetNpdByIdKls", id)
    network.gateway.disconnect()

    try {
        var allData  =  JSON.parse(queryData)
    } catch(error){
        return []
    }
    await Promise.all(allData.map( async(item, index) => {
        const signature =  await fabric.getSignature(item.lastTxId)
        allData[index].signature = signature
    }))
    return allData
}


