const { Gateway, Wallets } = require('fabric-network');

exports.createIjazah = async(user, nama) => {
    const network = await fabric.connectToNetwork("he1.gradechain.com", "he-channel", "he", user)
    const result = await fabric.interactWithChaincode(true, network, "CreateIjz", "args" )
    return result;
}

exports.updateIjazah = async(user, nama) => {
    const network = await fabric.connectToNetwork("he1.gradechain.com", "he-channel", "he", user)
    const result = await fabric.interactWithChaincode(true, network, "UpdateIjz", "args" )
    return result;
}

exports.signIjazah = async(user, nama) => {
    const network = await fabric.connectToNetwork("he1.gradechain.com", "he-channel", "he", user)
    const result = await fabric.interactWithChaincode(true, network, "DeleteIjz", "args" )
    return result;
}

exports.getIdentifier = async(user, nama) => {
    result = {
        "identifier": "QBVDnkaoGGF12"
    }
    return result;
}

exports.generateIdentifier = async(user, nama) => {
    return true;
}

exports.addSigner = async(user, nama) => {
    return true;
}

exports.verify = async(user, nama) => {
    return true;
}

exports.getIjazah = async(user, nama) => {
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
