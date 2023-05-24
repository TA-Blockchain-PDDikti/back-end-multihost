const dataService = require('../services/data.js')
const fabric = require("../utils/fabric.js")

const parser = async(result) => {
    if (result.idSp){
        console.log("parse")
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
            "nama": data.namaSms
        }
        delete result.idSms
    }

    if (result.idMk){
        const id = result.idMk
        const data = await dataService.getMataKuliahById('admin', id)
        result.mk = {
            "id": id,
            "nama": data.namaMk
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
            "nama": data.namaPtk
        }
        delete result.idPtk
    }

    if (result.idPd){
        const id = result.idPd
        const data = await dataService.getMahasiswaById('admin', id)
        result.pd = {
            "id": id,
            "nama": data.namaPd
        }
        delete result.idPd
    }

    return result;
}

const getAllParser = async (queryData) => {
    let result = JSON.parse(queryData)
    await Promise.all(result.map( async(item, index) => {
        result[index] = await parser(item)
    }))
    return result;
}

const getParser = (queryData) => {
    const jsonParse = JSON.parse(queryData)
    return parser(jsonParse)
}



module.exports = { getAllParser, getParser };