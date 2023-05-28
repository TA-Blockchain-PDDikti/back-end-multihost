
const fabric = require("../utils/fabric.js")
const { getAllParser, getParser } = require('../utils/converter.js')
const { BlockDecoder} = require('fabric-common');
const fs = require('fs');
const path = require('path');
const date = require('date-and-time')

var sha = require('js-sha256');
var asn = require('asn1.js');

var calculateBlockHash = function(header) {
  let headerAsn = asn.define('headerAsn', function() {
    this.seq().obj(
      this.key('Number').int(),
      this.key('PreviousHash').octstr(),
     this.key('DataHash').octstr()
   );
 });

  let output = headerAsn.encode({
      Number: parseInt(header.number),
      PreviousHash: Buffer.from(header.previous_hash, 'hex'),
      DataHash: Buffer.from(header.data_hash, 'hex')
    }, 'der');
console.log('output',output)
  let hash = sha.sha256(output);
  console.log('hash',hash)
  return hash;
};


exports.createPT = async(user, args) => {
    // Add 'pendidikan tinggi' data to blockchain
    const network = await fabric.connectToNetwork("Kemdikbud", "spcontract", user)
    await network.contract.submitTransaction("CreateSp", ...args)
    network.gateway.disconnect()
}

exports.updatePT = async(user, args) => {
    const network = await fabric.connectToNetwork("Kemdikbud", "spcontract", user)
    const result = await network.contract.submitTransaction("UpdateSp", ...args)
    network.gateway.disconnect()
    return result;
}

exports.deletePT = async(user, idPT) => {
    const network = await fabric.connectToNetwork("Kemdikbud", "spcontract", user)
    const result = await network.contract.submitTransaction("DeleteSp", idPT)
    network.gateway.disconnect()
    return result;
}

exports.getAllPT = async(user) => {
    const network = await fabric.connectToNetwork("Kemdikbud", "spcontract", user)
    const queryData = await network.contract.evaluateTransaction("GetAllSp")
    network.gateway.disconnect()
    const block = await fabric.connectToNetwork("HE1", "qscc", 'admin')
    

    const blockHasil1 = await block.contract.evaluateTransaction('GetTransactionByID', 'academicchannel', 'b0f410404319f58b5b139244bb93669a142426e158944ab42171b6a6d0c92830')
    const blockHasil2 = await block.contract.evaluateTransaction('GetBlockByNumber', 'academicchannel', '34')
    
    //onst decoder = new BlockDecoder()
    const blockDecoder = "l"
    //console.log("HALO", blockHasil1.transactionEnvelope)

    
    const blockDecode1 = BlockDecoder.decodeTransaction(blockHasil1)
    console.log("SIGNATURE",Buffer.from(blockDecode1.transactionEnvelope.signature).toString('base64'))
    const time = new Date(blockDecode1.transactionEnvelope.payload.header.channel_header.timestamp)
    console.log("TIME", date.format(time,'YYYY/MM/DD HH:mm:ss'))
    //console.log("decode txr", Buffer.from(blockDecode1.transactionEnvelope.payload.data.actions[0].header.creator.id_bytes).toString('hex') )
   const blockDecode2 = BlockDecoder.decode(blockHasil2)
   const dataArg = blockDecode1.transactionEnvelope.payload.data.actions[0].payload.chaincode_proposal_payload.input.chaincode_spec.input.args
   console.log("get data A", Buffer.from(dataArg[0]).toString(), Buffer.from(dataArg[1]).toString(), Buffer.from(dataArg[3]).toString())
  
   const dataArg1 = blockDecode1.transactionEnvelope.payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[1].rwset.writes[0].value
   console.log("YAA", Buffer.from(dataArg1).toString('ascii'))
   //console.log("get data A res", Buffer.from(dataArg1[1]).toString(), Buffer.from(dataArg1[1]).toString(), Buffer.from(dataArg1[3]).toString())
  

   // console.log(blockDecode)
    //const ha = Buffer.from(blockDecode.metadata)
   // console.log('blockHasil', Buffer.from(blockDecode.metadata.metadata[0].signatures[0].signature).toString('base64'))
    //fs.writeFile(path.join(process.cwd(), 'wallet', 'user.txt'), `${ha}`, err => {});
    //const res = blockDecode.data.data[0].payload.data.actions[0].payload.action.proposal_response_payload.extension
    //console.log(res)
    // console.log("BLOCK", Buffer.from(blockDecode.data.data[0].payload.data.actions[0].payload.chaincode_proposal_payload.input.chaincode_spec.input.args[0]).toString())
    // console.log('blockHasil2',blockDecode.data.data[0].payload.data.actions[0])
    //console.log('blockHasil3', Buffer.from(blockDecode.metadata.metadata[0].value).toJSON())
    // const tes = blockDecode.data.data[0].payload.data.actions[0].payload.chaincode_proposal_payload.input.chaincode_spec.input.args
    console.log('tes',Buffer.from(blockDecode2.header.previous_hash).toString('hex'))
    // console.log('prev',Buffer.from(blockDecode.header.previous_hash).toString('base64'))
    //data.data[0].payload.data.actions[0].payload
    const hash1 = calculateBlockHash(blockDecode2.header)
    const hash = Buffer.from(hash1, 'hex')
    const blockHasil3 = await block.contract.evaluateTransaction('GetBlockByHash', 'academicchannel', hash)
    const decode = BlockDecoder.decode(blockHasil3)
    const arg = decode.data.data[0].payload.data.actions[0].payload.chaincode_proposal_payload.input.chaincode_spec.input.args
    console.log("get data", Buffer.from(arg[0]).toString(), Buffer.from(arg[2]).toString(), Buffer.from(arg[3]).toString())
    return BlockDecoder.decode(blockHasil2)
}

exports.getPTById = async(user, idPT) => {
    const network = await fabric.connectToNetwork("Kemdikbud", "spcontract", user)
    const queryData = await network.contract.evaluateTransaction("GetSpById", idPT)
    network.gateway.disconnect()
    return getParser(queryData)
}

//Prodi
exports.createProdi = async(user, args) => {
    console.log("args", ...args)
    const network = await fabric.connectToNetwork("HE1", "smscontract", user)
    const result = await network.contract.submitTransaction("CreateSms", ...args)
    network.gateway.disconnect()
    return result;
}

exports.updateProdi = async(user, args) => {
    const network = await fabric.connectToNetwork("HE1", "smscontract", user)
    const result = await network.contract.submitTransaction("UpdateSms", ...args)
    network.gateway.disconnect()
    return result;
}

exports.deleteProdi = async(user, idProdi) => {
    const network = await fabric.connectToNetwork("HE1", "smscontract", user)
    const result = await network.contract.submitTransaction("DeleteSms", idProdi)
    network.gateway.disconnect()
    return result;}

exports.getAllProdi = async(user) => {
    const network = await fabric.connectToNetwork("HE1", "smscontract", user)
    const queryData = await network.contract.evaluateTransaction("GetAllSms")

    network.gateway.disconnect()
    return getAllParser(queryData)

}

exports.getProdiByPT = async(user, idPT) => {
    const network = await fabric.connectToNetwork("HE1", "smscontract", user)
    const queryData = await network.contract.evaluateTransaction("GetSmsByIdSp", idPT)
    network.gateway.disconnect()
    return getAllParser(queryData)
}

exports.getProdiById = async(user, idProdi) => {
    const network = await fabric.connectToNetwork("HE1", "smscontract", user)
    const result = await network.contract.evaluateTransaction("GetSmsById", idProdi)
    network.gateway.disconnect()
    return getParser(result)
}

//dosen
exports.createDosen = async(user, args) => {
    // Add 'dosen' data to blockchain
    const network = await fabric.connectToNetwork("HE1", "ptkcontract", user)
    const result = await network.contract.submitTransaction("CreatePtk", ...args)
    network.gateway.disconnect()
    return result;
}

exports.updateDosen = async(user, args) => {
    const network = await fabric.connectToNetwork("HE1", "ptkcontract", user)
    const result = await network.contract.submitTransaction("UpdatePtk", ...args)
    network.gateway.disconnect()
    return result;
}

exports.signDosen = async(user,idDosen, nidn) => {
    const signature = ""
    const network = await fabric.connectToNetwork("HE1", "ptkcontract", user)
    const result = await network.contract.submitTransaction("UpdatePtkNidnAndSign",idDosen, nidn, signature )
    network.gateway.disconnect()
    return result;
}

exports.deleteDosen = async(user, idDosen) => {
    const network = await fabric.connectToNetwork("HE1", "ptkcontract", user)
    const result = await network.contract.submitTransaction("DeletePtk", idDosen)
    network.gateway.disconnect()
    return result;}

exports.getAllDosen = async(user) => {
    const network = await fabric.connectToNetwork("HE1", "ptkcontract", user)
    const queryData = await network.contract.evaluateTransaction("GetAllPtk")
    network.gateway.disconnect()
    return getAllParser(queryData)
}

exports.getDosenByPT = async(user, idPT) => {
    const network = await fabric.connectToNetwork("HE1", "ptkcontract", user)
    const queryData = await network.contract.evaluateTransaction("GetPtkByIdSp", idPT)
    network.gateway.disconnect()
    return getAllParser(queryData)
}


exports.getDosenById = async(user, idDosen) => {
    const network = await fabric.connectToNetwork("HE1", "ptkcontract", user)
    const result = await network.contract.evaluateTransaction("GetPtkById", idDosen)
    network.gateway.disconnect()
    return getParser(result)
}

//mahasiswa
exports.createMahasiswa = async(user, args) => {
    // Add 'mahasiswa' data to blockchain
    const network = await fabric.connectToNetwork("HE1", "pdcontract", user)
    const result = await network.contract.submitTransaction("CreatePd", ...args)
    network.gateway.disconnect()
    return result;
}

exports.updateMahasiswa = async(user, args) => {
    const network = await fabric.connectToNetwork("HE1", "pdcontract", user)
    const result = await network.contract.submitTransaction("UpdatePd", ...args)
    network.gateway.disconnect()
    return result;
}

exports.deleteMahasiswa = async(user, idMahasiswa) => {
    const network = await fabric.connectToNetwork("HE1", "pdcontract", user)
    const result = await network.contract.submitTransaction("DeletePd", idMahasiswa)
    network.gateway.disconnect()
    return result;}

exports.getAllMahasiswa = async(user) => {
    const network = await fabric.connectToNetwork("HE1", "pdcontract", user)
    const queryData = await network.contract.evaluateTransaction("GetAllPd")
    network.gateway.disconnect()
    return getAllParser(queryData)
}

exports.getMahasiswaById = async(user, idMahasiswa) => {
    const network = await fabric.connectToNetwork("HE1", "pdcontract", user)
    const result = await network.contract.evaluateTransaction("GetPdById", idMahasiswa)
    network.gateway.disconnect()
    return getParser(result)
}

exports.getMahasiswaByPT = async(user, idPt) => {
    const network = await fabric.connectToNetwork("HE1", "pdcontract", user)
    const queryData = await network.contract.evaluateTransaction("GetPdByIdSp", idPt)
    network.gateway.disconnect()
    return getAllParser(queryData)
}

exports.getMahasiswaByKelas = async(user, idKelas) => {
    const network = await fabric.connectToNetwork("HE1", "pdcontract", user)
    const queryData = await network.contract.evaluateTransaction("GetPdByIdKls", idKelas)
    network.gateway.disconnect()
    return getAllParser(queryData)
}

exports.setGraduated = async(user, calonLulusan) => {
    await Promise.all(calonLulusan.map( async(item, index) => {
        const network = await fabric.connectToNetwork("HE1", "pdcontract", user)
        await network.contract.submitTransaction("SetPdGraduated", item)
        network.gateway.disconnect()
    }))
}

//mata kuliah
exports.createMataKuliah = async(user, args) => {
    const network = await fabric.connectToNetwork("HE1", "mkcontract", user)
    const result = await network.contract.submitTransaction("CreateMk", ...args)
    network.gateway.disconnect()
    return result;
}

exports.updateMataKuliah = async(user, args) => {
    console.log(idProdi, idPt)
    const network = await fabric.connectToNetwork("HE1", "mkcontract", user)
    const result = await network.contract.submitTransaction("UpdateMk", ...args)
    network.gateway.disconnect()
    return result;
}

exports.deleteMataKuliah = async(user, idMK) => {
    const network = await fabric.connectToNetwork("HE1", "mkcontract", user)
    const result = await network.contract.submitTransaction("DeleteMk", idMK)
    network.gateway.disconnect()
    return result;}

exports.getAllMataKuliah = async(user) => {
    const network = await fabric.connectToNetwork("HE1", "mkcontract", user)
    const queryData = await network.contract.evaluateTransaction("GetAllMk")
    network.gateway.disconnect()
    return getAllParser(queryData)
}


exports.getMataKuliahById = async(user, idMk) => {
    const network = await fabric.connectToNetwork("HE1", "mkcontract", user)
    const result = await network.contract.evaluateTransaction("GetMkById", idMk)
    network.gateway.disconnect()
    return getParser(result)
}

exports.getMataKuliahByIdPt = async(user, idPt) => {
    const network = await fabric.connectToNetwork("HE1", "mkcontract", user)
    const result = await network.contract.evaluateTransaction("GetMkByIdSp", idPt)
    network.gateway.disconnect()
    return getAllParser(result)
}

//kelas
exports.createKelas = async(user, args) => {
    const network = await fabric.connectToNetwork("HE1", "klscontract", user)
    const result = await network.contract.submitTransaction("CreateKls", ...args)
    network.gateway.disconnect()
    return result; 
}

exports.updateKelas = async(user, args) => {
    const network = await fabric.connectToNetwork("HE1", "klscontract", user)
    const result = await network.contract.submitTransaction("UpdateKls", ...args)
    network.gateway.disconnect()
    return result;
}

exports.deleteKelas = async(user, idKelas) => {
    const network = await fabric.connectToNetwork("HE1", "klscontract", user)
    const result = await network.contract.submitTransaction("DeleteKls", idKelas)
    network.gateway.disconnect()
    return result;}

exports.assignDosen = async(user, args) => {
    const network = await fabric.connectToNetwork("HE1", "klscontract", user)
    const result = await network.contract.submitTransaction("UpdateKlsListPtk", ...args)
    network.gateway.disconnect()

}

exports.assignMahasiswa = async(user, args) => {
    const network = await fabric.connectToNetwork("HE1", "klscontract", user)
    const result = await network.contract.submitTransaction("UpdateKlsListPd", ...args)
    network.gateway.disconnect()

}

exports.getAllKelas = async(user) => {
    const network = await fabric.connectToNetwork("HE1", "klscontract", user)
    const queryData = await network.contract.evaluateTransaction("GetAllKls")
    network.gateway.disconnect()
    return getAllParser(queryData)
}


exports.getKelasById = async(user, idKelas) => {
    const network = await fabric.connectToNetwork("HE1", "klscontract", user)
    const result = await network.contract.evaluateTransaction("GetKlsById", idKelas)
    network.gateway.disconnect()
    return getParser(result)
}


