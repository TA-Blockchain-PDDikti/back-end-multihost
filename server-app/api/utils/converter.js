const dataService = require('../services/data.js')
const fabric = require("../utils/fabric.js")

const parser = async(result) => {
    if (result.idSp){
        const id = result.idSp
        const data = await dataService.getPTById('admin', id)
        result.sp = {
            "id": id,
            "nama": data.namaSp
        }
        delete result.idSp
    }

    if (result.idSms){
        const id = result.idSms
        const data = await dataService.getProdiById('admin', id)
        console.log("data", data)
        result.sms = {
            "id": id,
            "nama": data.namaSms,
            "jenjangPendidikan": data.jenjangPendidikan
        }
        delete result.idSms
    }

    if (result.idMk){
        const id = result.idMk
        const data = await dataService.getMataKuliahById('admin', id)
        result.mk = {
            "id": id,
            "nama": data.namaMk
            //"kodeMk": data.kodeMk,
        }
        delete result.idMk
    }

    if (result.idKls){
        const id = result.idKls
        const data = await dataService.getKelasById('admin', id)
        result.kls = {
            "id": id,
            "nama": data.namaKls
        }
        delete result.idKls
    }

    if (result.idPtk){
        const id = result.idPtk
        const data = await dataService.getDosenById('admin', id)
        result.ptk = {
            "id": id,
            "nama": data.namaPtk,
            "nidn": data.nidn
        }
        delete result.idPtk
    }

    if (result.idPd){
        const id = result.idPd
        const data = await dataService.getMahasiswaById('admin', id)
        result.pd = {
            "id": id,
            "nama": data.namaPd,
            "nipd": data.nipd
        }
        delete result.idPd
    }

    if (result.listPd) {
        const list = result.listPd
        await Promise.all(list.map( async(item, index) => {
            const data = await dataService.getMahasiswaById('admin', item)
            result.listPd[index] = data
        }))
    }

    if (result.listPtk) {
        const list = result.listPtk
        await Promise.all(list.map( async(item, index) => {
            const data = await dataService.getDosenById('admin', item)
            result.listPtk[index] = data
        }))
    }


    if (result.signatures) {
        const signatures = result.signatures
        await Promise.all(signatures.map( async(item, index) => {
            const id = item.signerId
            const data = await dataService.getDosenById('admin', id)
            item.signer = {
                "id": id,
                "nama": data.namaPtk,
                "nipd": data.nipd,
                "jabatan": data.jabatan
            }
            delete item.signerId
            result.signatures[index] = item
        }))
    }

    if (result.signers) {
        const signers = result.signers
        await Promise.all(signers.map( async(item, index) => {
            const id = item
            const data = await dataService.getDosenById('admin', id)
            item = {
                "id": id,
                "nama": data.namaPtk,
                "nipd": data.nipd,
                "jabatan": data.jabatan
            }
            result.signers[index] = item
        }))
    }

    if (result.txId) {
        result.signature = fabric.getSignature(result.txId)
    }
    
    if (result.txIds) {
        result.signatures = fabric.getAllSignature(result.txIds)
    }

    return result;
}

const getAllParser = async (queryData) => {
    try {
        let result = JSON.parse(queryData)
        await Promise.all(result.map( async(item, index) => {
            result[index] = await parser(item)
        }))
        return result;
    } catch(error) {
        return []
    }
}

const getParser = (queryData) => {
    const jsonParse = JSON.parse(queryData)
    return parser(jsonParse)
}



module.exports = { getAllParser, getParser };