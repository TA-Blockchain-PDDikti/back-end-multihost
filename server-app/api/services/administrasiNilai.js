const fabric = require("../utils/fabric.js")
const { getAllParser, getParser, parser } = require('../utils/converter.js')


const getNpdTxId = async(user, id) => {
    var network = await fabric.connectToNetwork("HE1", "npdcontract", user)
    const txId = await network.contract.evaluateTransaction("GetNpdLastTxIdById", id)
    return txId
}

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

    const allData  =  JSON.parse(queryData)
    await Promise.all(allData.map( async(item, index) => {
        allData[index] = await parser(item)
        const txId = await getNpdTxId(user, item.id)
        const signature =  await fabric.getSignature(txId)
        allData[index].signature = signature
    }))
    return allData
    
}

exports.getAcademicRecordById = async(user, id) => {
    const network = await fabric.connectToNetwork("HE1", "npdcontract", user)
    const result = await network.contract.evaluateTransaction("GetNpdById", id)
    network.gateway.disconnect()

    const data = await getParser(result)
    const txId = await getNpdTxId(user, data.id)
    console.log(txId)
    data.signature = await fabric.getSignature(txId)
    return data
}

exports.getAcademicRecordByIdMhsw = async(user, id) => {
    const network = await fabric.connectToNetwork("HE1", "npdcontract", user)
    const queryData = await network.contract.evaluateTransaction("GetNpdByIdPd", id)
    network.gateway.disconnect()

    const allData  =  JSON.parse(queryData)
    await Promise.all(allData.map( async(item, index) => {
        allData[index] = await parser(item, [true, true, true, true, true, false])
        const txId = await getNpdTxId(user, item.id)
        const signature =  await fabric.getSignature(txId)
        allData[index].signature = signature
    }))
    return allData
}

exports.getAcademicRecordByIdKls = async(user, id) => {
    const network = await fabric.connectToNetwork("HE1", "npdcontract", user)
    const queryData = await network.contract.evaluateTransaction("GetNpdByIdKls", id)
    network.gateway.disconnect()

    const allData  =  JSON.parse(queryData)
    await Promise.all(allData.map( async(item, index) => {
        allData[index] = await parser(item, [true, true, true, false, true, true])
        const txId = await getNpdTxId(user, item.id)
        const signature =  await fabric.getSignature(txId)
        allData[index].signature = signature
    }))
    return allData
}


