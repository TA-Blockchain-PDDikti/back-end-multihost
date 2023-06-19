const dataService = require('../services/data.js')

const getParser = async(result, query = [true, true, true, true, true, true, true, true, true]) => {
    if (query[0] && result.idSp){
        const id = result.idSp
        const data = await dataService.getPTById('admin', id)
        result.sp = {
            "id": id,
            "nama": data.namaSp
        }
        delete result.idSp
    }

    if (query[1] && result.idSms){
        const id = result.idSms
        const data = await dataService.getProdiById('admin', id)
        result.sms = {
            "id": id,
            "nama": data.namaSms,
            "jenjangPendidikan": data.jenjangPendidikan
        }
        delete result.idSms
    }

    if (query[2] && result.idMk){
        const id = result.idMk
        const data = await dataService.getMataKuliahById('admin', id)
        result.mk = {
            "id": id,
            "nama": data.namaMk,
            "kodeMk": data.kodeMk,
        }
        delete result.idMk
    }

    if (query[3] && result.idKls){
        const id = result.idKls
        const data = await dataService.getKelasById('admin', id)
        result.kls = {
            "id": id,
            "sks": data.sks,
            "namaKls": data.namaKls,
            "semester": data.semester,
            "mk": data.mk,
        }
        delete result.idKls
    }

    if (query[4] && result.idPtk){
        const id = result.idPtk
        const data = await dataService.getDosenById('admin', id)
        result.ptk = {
            "id": id,
            "nama": data.namaPtk,
            "nidn": data.nidn
        }
        delete result.idPtk
    }

    if (query[5] && result.idPd){
        const id = result.idPd
        const data = await dataService.getMahasiswaById('admin', id)
        result.pd = {
            "id": id,
            "nama": data.namaPd,
            "nipd": data.nipd
        }
        delete result.idPd
    }

    if (query[6] && result.listPd) {
        const list = result.listPd
        await Promise.all(list.map( async(item, index) => {
            const data = await dataService.getMahasiswaById('admin', item, false)
            result.listPd[index] = data
        }))
    }

    if (query[7] && result.listPtk) {
        const list = result.listPtk
        const listIdPtk = []
        await Promise.all(list.map( async(item, index) => {
            const data = await dataService.getDosenById('admin', item, false)
            listIdPtk[index] = item
            list[index] = data
        }))
        result.listIdPtk = listIdPtk
    }


    if (query[8] && result.Approvers) {
        const approvers = result.Approvers
        await Promise.all(approvers.map( async(item, index) => {
            const id = item
            const data = await dataService.getDosenById('admin', id, false)  
            result.Approvers[index] = item
        }))
    }

    return result;
}

const getAllParser = async (queryData, query = [true, true, true, true, true, true, true, true, true]) => {
    try {
        let result = JSON.parse(queryData)
        await Promise.all(result.map( async(item, index) => {
            result[index] = await getParser(item, query)
        }))
        return result;
    } catch(error) {
        return []
    }
}


module.exports = { getAllParser, getParser };