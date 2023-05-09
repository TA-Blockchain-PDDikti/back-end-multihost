
const { v4: uuidv4 } = require('uuid')

exports.createIjazah = async(user, idPT, idProdi, idMahasiswa, jenjangPendidikan, nomorIjazah, tanggalLulus) => {
    const idIjazah = uuidv4()
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.submitTransaction( "CreateIjz", idIjazah, idPT, idProdi, idMahasiswa, jenjangPendidikan, nomorIjazah, tanggalLulus)

    network.gateway.disconnect()
    return result;
}

exports.createTranskrip = async(user, idPT, idProdi, idMahasiswa, jenjangPendidikan, totalMutu,	totalSks, ipk) => {
    const idTranskrip = uuidv4()
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.submitTransaction( "CreateTsk", idranskrip, idPT, idProdi, idMahasiswa, jenjangPendidikan, totalMutu,	totalSks, ipk)
    network.gateway.disconnect()
    return result;
}

exports.updateIjazah = async(user, idIjazah, idPT, idProdi, idMahasiswa, jenjangPendidikan, nomorIjazah, tanggalLulus) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.submitTransaction( "UpdateIjz", idIjazah, idPT, idProdi, idMahasiswa, jenjangPendidikan, nomorIjazah, tanggalLulus)
    network.gateway.disconnect()
    return result;
}

exports.updateTranskrip = async(user, idranskrip, idPT, idProdi, idMahasiswa, jenjangPendidikan, totalMutu,	totalSks, ipk) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.submitTransaction( "UpdateTsk", idranskrip, idPT, idProdi, idMahasiswa, jenjangPendidikan, totalMutu,	totalSks, ipk)
    network.gateway.disconnect()
    return result;
}

exports.signIjazah = async(user, nama) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.submitTransaction( "DeleteIjz", "args" )
    network.gateway.disconnect()
    return result;
}

exports.getIdentifier = async(user, nama) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.submitTransaction( "DeleteIjz", "args" )
    network.gateway.disconnect()
    result = {
        "identifier": "QBVDnkaoGGF12"
    }
    return result;
}

exports.generateIdentifier = async(user, nama) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.submitTransaction( "DeleteIjz", "args" )
    network.gateway.disconnect()
    return true;
}

exports.addSigner = async(user, nama) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.submitTransaction( "DeleteIjz", "args" )
    network.gateway.disconnect()
    return true;
}

exports.verify = async(user, nama) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.submitTransaction( "DeleteIjz", "args" )
    network.gateway.disconnect()
    return true;
}

exports.getIjazahById = async(user, idIjazah) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.evaluateTransaction( "GetIjzById", idIjazah)
    network.gateway.disconnect()
    result = {
        "pendidikan tinggi": "UI",
        "prodi": "Ilkom",
        "jenjangPendidikan": "S1",
        "nomorIjazah": "173747",
        "tanggalLulus": "12-1-2021",
        "transkrip": {
            "totalMutu": 400,
            "totalSks": 144,
            "ipk": 3.7,
            "nilai":[]
        }
    }
    return result;
}

exports.getITranskripById = async(user, idTsk) => {
    const network = await fabric.connectToNetwork("he1", "he-channel", "he", user)
    const result = await network.contract.evaluateTransaction( "GetTskyId", idTsk)
    network.gateway.disconnect()
    result = {
        "pendidikan tinggi": "UI",
        "prodi": "Ilkom",
        "jenjangPendidikan": "S1",
        "nomorIjazah": "173747",
        "tanggalLulus": "12-1-2021",
        "transkrip": {
            "totalMutu": 400,
            "totalSks": 144,
            "ipk": 3.7,
            "nilai":[]
        }
    }
    return result;
}
