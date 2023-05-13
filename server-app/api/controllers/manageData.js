const dataService = require('../services/manageData.js')

//Pendidikan Tinggi
exports.createPT = async(req, res) => {
    try{
        const data = req.body;
        const nama = data.nama;
        const adminPT = data.usernameAdmin;

        const result = await dataService.createPT(req.user.username,nama, adminPT)
        res.status(201).send({
            message: "Pendidikan Tinggi is created",
            result
        })
    }
    catch(error){
        
    }
}

exports.updatePT = async(req, res) => {
    try{
        const data = req.body;
        const nama = data.nama;
        const adminPT = data.usernameAdmin;
        const idPT = req.params.id;

        const result = await dataService.updatePT(req.user.username,idPT, nama, adminPT)
        res.status(200).send({
            message: `Pendidikan Tinggi with id ${idPT} is updated`,
            
        })
    }
    catch(error){
        
    }
}

exports.deletePT = async(req, res) => {
    try{
        const idPT  = req.params.id;
        const result = await dataService.deletePT(req.user.username, idPT);
        res.status(200).send({
            message: `Pendidikan Tinggi with id ${idPT} is deleted`,
        })
    }
    catch(error){
        
    }
}

exports.getAllPT = async(req, res) => {
    data = await dataService.getAllPT(1) 
    res.status(200).send({data});
}

exports.getPTById = async(req, res) => {
    const idPT = req.params.id
    data = await dataService.getPTById(req.user.username,idPT) 
    res.status(200).send({data});
}

//Prodi
exports.createProdi = async(req, res) => {
    try{
        const data = req.body;
        const idPT =  data.idPT;
        const nama = data.nama;
        const jenjang = data.jenjangPendidikan;

        const result = await dataService.createProdi(req.user.username,idPT, nama, jenjang)
        res.status(201).send({
            message: "Prodi is created",
            data
        })
    }
    catch(error){
        
    }
}

exports.updateProdi = async(req, res) => {
    try{
        const data = req.body;
        const idPT =  data.idPT;
        const nama = data.nama;
        const jenjang = data.jenjangPendidikan;
        const idProdi = req.params.id

        const result = await dataService.updateProdi(req.user.username, idProdi, idPT, nama, jenjang)
        res.status(200).send({
            message: `Prodi with id ${idProdi} is updated`,
            
        })
    }
    catch(error){
        
    }
}

exports.deleteProdi = async(req, res) => {
    try{
        const idProdi = req.params.id;
        const result = await dataService.deleteProdi(req.user.username, idProdi);
        
        res.status(200).send({
            message: `Prodi with id ${idProdi} is deleted`,
        })
    }
    catch(error){
        
    }
}

exports.getAllProdi = async(req, res) => {
    data = await dataService.getAllProdi(1) 
    res.status(200).send({data});
}

exports.getProdiByPT = async(req, res) => {
    const idPT = req.params.id

    result = await dataService.getProdiByPT(req.user.username, idPT) 
    res.status(200).send({result});
}

exports.getProdiById = async(req, res) => {
    const idProdi = req.params.id

    result = await dataService.getProdiById(req.user.username, idProdi) 
    res.status(200).send({result});
}

// Dosen
exports.createDosen = async(req, res) => {
    try{
        const data = req.body;
        const idPT = data.idPT;
        const idProdi = data.idProdi;
        const nama = data.nama;
        const nomorST = data.nomorST;
        const username = data.username;

        const result = await dataService.createDosen(req.user.username,idPT,idProdi,nama,nomorST, username)
        res.status(201).send({
            message: "Dosen is created",
            data
        })
    }
    catch(error){
        
    }
}

exports.updateDosen = async(req, res) => {
    try{
        const data = req.body;
        const idPT = data.idPT;
        const idProdi = data.idProdi;
        const nama = data.nama;
        const nomorST = data.nomorST;
        const idDosen = req.params.id

        const result = await dataService.updateDosen(req.user.username, idDosen, idPT,idProdi,nama,nomorST)
        res.status(200).send({
            message: `Dosen with id ${idDosen} is updated`,
            
        })
    }
    catch(error){
        
    }
}

exports.deleteDosen = async(req, res) => {
    try{
        const idDosen  = req.params.id;
        const result = await dataService.deleteProdi(req.user.username, idDosen);

        res.status(200).send({
            message: `Dosen with id ${idDosen} is deleted`,
        })
    }
    catch(error){
        
    }
}


exports.getAllDosen = async(req, res) => {
    data = await dataService.getAllDosen(1) 
    res.status(200).send({data});
}

exports.getDosenByPT = async(req, res) => {
    const idPT  = req.params.id;
    data = await dataService.getDosenByPT(req.user.username, idPT) 
    res.status(200).send({data});
}

exports.getDosenById = async(req, res) => {
    const idDosen = req.params.id

    result = await dataService.getDosenById(req.user.username, idDosen) 
    res.status(200).send({result});
}

//Mahasiswa

exports.createMahasiswa = async(req, res) => {
    try{
        const data = req.body;
        const idPT = data.idPT;
        const idProdi = data.idProdi;
        const nama = data.nama;
        const nipd = data.nipd;
        const username = data.username;

        const result = await dataService.createMahasiswa(req.user.username,idPT, idProdi, nama, nipd, username)
        res.status(201).send({
            message: "Mahasiswa is created",
            data
        })
    }
    catch(error){
        
    }
}

exports.updateMahasiswa = async(req, res) => {
    try{
        const data = req.body;
        const idPT = data.idPT;
        const idProdi = data.idProdi;
        const nama = data.nama;
        const nipd = data.nipd;
        const idMahasiswa = req.params.id

        const result = await dataService.updateMahasiswa(req.user.username, idMahasiswa, idPT, idProdi, nama, nipd)
        res.status(200).send({
            message: `Mahasiswa with id ${idMahasiswa} is updated`,
            
        })
    }
    catch(error){
        
    }
}

exports.deleteMahasiswa = async(req, res) => {
    try{
        const idMahasiswa = req.params.id
        const result = await dataService.deleteMahasiswa(req.user.username, idMahasiswa)
        res.status(200).send({
            message: `Mahasiswa with id ${idMahasiswa} is deleted`,
        })
    }
    catch(error){
        
    }
}


exports.getAllMahasiswa = async(req, res) => {
    data = await dataService.getAllMahasiswa(1) 
    res.status(200).send({data});
}

exports.getMahasiswaByPT = async(req, res) => {
    const idPT = request.params.id
    data = await dataService.getMahasiswaByPT(req.user.username, idPT) 
    res.status(200).send({data});
}

exports.getMahasiswaById = async(req, res) => {
    const idMahasiswa = req.params.id
    data = await dataService.getMahasiswaById(req.user.username, idMahasiswa) 
    res.status(200).send({data});
}

exports.getMahasiswaByKelas = async(req, res) => {
    const idKelas = req.params.id 
    data = await dataService.getMahasiswaByKelas(req.user.username, idKelas) 
    res.status(200).send({data});
}

//Mata KUliah
exports.createMataKuliah = async(req, res) => {
    try{
        const data = req.body;
        const idProdi  = data.idProdi;
        const nama = data.nama;
        const sks = data.sks;
        const jenjangPendidikan = data.jenjangPendidikan

        const result = await dataService.createMataKuliah(req.user.username, idProdi, nama, sks, jenjangPendidikan)
        res.status(201).send({
            message: "Mata Kuliah is created",
            data
        })
    }
    catch(error){
        
    }
}

exports.updateMataKuliah = async(req, res) => {
    try{
        const data = req.body;
        const name = data.nama;
        const idProdi  = data.idProdi;
        const nama = data.nama;
        const sks = data.sks;
        const jenjangPendidikan = data.jenjangPendidikan
        const idMk = req.params.id;

        const result = await dataService.updateMataKuliah(req.user.username, idMk, idProdi, nama, sks, jenjangPendidikan)
        res.status(200).send({
            message: `Mata Kuliah with id ${idMK} is updated`,
            
        })
    }
    catch(error){
        
    }
}

exports.deleteMataKuliah = async(req, res) => {
    try{
        const idMk = req.params.id;
        const result = await dataService.deleteMataKuliah(req.user.username, idMk)
        res.status(200).send({
            message: `MataKuliah with id ${req.params.id} is deleted`,
        })
    }
    catch(error){
        7
    }
}


exports.getAllMataKuliah = async(req, res) => {
    data = await dataService.getAllMataKuliah(1) 
    res.status(200).send({data});
}

exports.getMataKuliahById = async(req, res) => {
    const idMk = req.params.id
    data = await dataService.getMataKuliahById(req.user.username, idMk) 
    res.status(200).send({data});
}


//Kelas
exports.createKelas = async(req, res) => {
    try{
        const data = req.body;
        const nama = data.nama;
        const idMk = data.idMk;
        const semeter = data.semeter;
        const sks = data.sks;
        const idKelas = req.params.id;

        const result = await dataService.createKelas(req.user.username, idProdi, idMk, nama, semeter, sks)
        res.status(201).send({
            message: "Kelas is created",
            data
        })
    }
    catch(error){
        
    }
}

exports.updateKelas = async(req, res) => {
    try{
        const data = req.body;
        const nama = data.nama;
        const idProdi = data.idProdi;
        const idMk = data.idMk;
        const semeter = data.semeter;
        const sks = data.sks;
        const idKelas = req.params.id;

        const result = await dataService.updateKelas(req.user.username,  idKelas, idProdi, idMk, nama, semeter, sks)
        res.status(200).send({
            message: `Kelas with id ${idKelas} is updated`,
            
        })
    }
    catch(error){
        
    }
}

exports.deleteKelas = async(req, res) => {
    try{
        const idKelas = req.params.id;
        const result = await dataService.deleteKelas(req.user.username, idKelas)
        res.status(200).send({
            message: `Kelas with id ${req.params.id} is deleted`,
        })
    }
    catch(error){
        
    }
}

exports.assignDosen = async(req, res) => {
    try{
        const data = req.body;
        const idKelas = data.idKelas;
        const idDosen = data.idDosen;

        const result = await dataService.assignDosen(req.user.username,idKelas, idDosen)
        res.status(200).send({
            message: `Dosen with id ${idDosen} is assign to class with id ${idKelas}`,
            data
        })
    }
    catch(error){
        
    }

}

exports.assignMahasiswa = async(req, res) => {
    try{
        const data = req.body;
        const idKelas = data.idKelas;
        const idMahasiswa = data.idMahasiswa;

        const result = await dataService.assignMahasiswa(req.user.username, idKelas, idMahasiswa)
        res.status(200).send({
            message: `Mahasiswa with id ${idMahasiswa} is assign to class with id ${idKelas}`,
            data
        })
    }
    catch(error){
        
    }
}

exports.getAllKelas = async(req, res) => {
    data = await dataService.getAllKelas(1) 
    res.status(200).send({data});
}

exports.getKelasById = async(req, res) => {
    const idKelas = req.params.id

    result = await dataService.getKelasById(req.user.username, idKelas) 
    res.status(200).send({result});
}

//Verifier
exports.createVerifier = async(req, res) => {
    try{
        const data = req.body;
        const name = data.nama;

        const result = await dataService.createVerifier(req.user.username,name)
        res.status(201).send({
            message: "Verifier is created",
            data
        })
    }
    catch(error){
        
    }
}

exports.updateVerifier = async(req, res) => {
    try{
        const data = req.body;
        const name = data.nama;

        const result = await dataService.updateVerifier(req.user.username,  name)
        res.status(200).send({
            message: `Verifier with id ${req.params.id} is updated`,
            
        })
    }
    catch(error){
        
    }
}

exports.deleteVerifier = async(req, res) => {
    try{
        const result = await dataService.deleteVerifier(1)
        res.status(200).send({
            message: `Verifier with id ${req.params.id} is deleted`,
        })
    }
    catch(error){
        
    }
}


exports.getAllVerifier = async(req, res) => {
    data = await dataService.getAllVerifier(1) 
    res.status(200).send({data});
}




