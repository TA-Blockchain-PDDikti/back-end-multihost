const dataService = require('../services/manageData.js')

//Pendidikan Tinggi
exports.createPT = async(req, res) => {
    try{
        const data = req.body;
        const name = data.nama;

        const result = await dataService.createPT(1,name)
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
        const name = data.nama;

        const result = await dataService.updatePT(1,  name)
        res.status(200).send({
            message: `Pendidikan Tinggi with id ${req.params.id} is updated`,
            
        })
    }
    catch(error){
        
    }
}

exports.deletePT = async(req, res) => {
    try{
        const result = await dataService.deletePT(1);
        res.status(200).send({
            message: `Pendidikan Tinggi with id ${req.params.id} is deleted`,
        })
    }
    catch(error){
        
    }
}

exports.getAllPT = async(req, res) => {
    data = await dataService.getAllPT(1) 
    res.status(200).send({data});
}


//Prodi
exports.createProdi = async(req, res) => {
    try{
        const data = req.body;
        const name = data.nama;

        const result = await dataService.createProdi(1,name)
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
        const name = data.nama;

        const result = await dataService.updateProdi(1,  name)
        res.status(200).send({
            message: `Prodi with id ${req.params.id} is updated`,
            
        })
    }
    catch(error){
        
    }
}

exports.deleteProdi = async(req, res) => {
    const result = await dataService.deleteProdi(1)
    try{
        res.status(200).send({
            message: `Prodi with id ${req.params.id} is deleted`,
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
    data = await dataService.getProdiByPT(1) 
    res.status(200).send({data});
}

// Dosen
exports.createDosen = async(req, res) => {
    try{
        const data = req.body;
        const name = data.nama;

        const result = await dataService.createDosen(1,name)
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
        const name = data.nama;

        const result = await dataService.updateDosen(1,  name)
        res.status(200).send({
            message: `Dosen with id ${req.params.id} is updated`,
            
        })
    }
    catch(error){
        
    }
}

exports.deleteDosen = async(req, res) => {
    const result = await dataService.deleteDosen(1)
    try{
        res.status(200).send({
            message: `Dosen with id ${req.params.id} is deleted`,
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
    data = await dataService.getDosenByPT(1) 
    res.status(200).send({data});
}

//Mahasiswa

exports.createMahasiswa = async(req, res) => {
    try{
        const data = req.body;
        const name = data.nama;

        const result = await dataService.createMahasiswa(1,name)
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
        const name = data.nama;

        const result = await dataService.updateMahasiswa(1,  name)
        res.status(200).send({
            message: `Mahasiswa with id ${req.params.id} is updated`,
            
        })
    }
    catch(error){
        
    }
}

exports.deleteMahasiswa = async(req, res) => {
    try{
        const result = await dataService.deleteMahasiswa(1)
        res.status(200).send({
            message: `Mahasiswa with id ${req.params.id} is deleted`,
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
    data = await dataService.getMahasiswaByPT(1) 
    res.status(200).send({data});
}

exports.getMahasiswaById = async(req, res) => {
    data = await dataService.getMahasiswaById(1) 
    res.status(200).send({data});
}

exports.getMahasiswaByKelas = async(req, res) => {
    data = await dataService.getMahasiswaByKelas(1) 
    res.status(200).send({data});
}

//Mata KUliah
exports.createMataKuliah = async(req, res) => {
    try{
        const data = req.body;
        const name = data.nama;

        const result = await dataService.createMataKuliah(1,name)
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

        const result = await dataService.updateMataKuliah(1,  name)
        res.status(200).send({
            message: `Mata Kuliah with id ${req.params.id} is updated`,
            
        })
    }
    catch(error){
        
    }
}

exports.deleteMataKuliah = async(req, res) => {
    try{
        const result = await dataService.deleteMataKuliah(1)
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



//Kelas
exports.createKelas = async(req, res) => {
    try{
        const data = req.body;
        const name = data.nama;

        const result = await dataService.createKelas(1,name)
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
        const name = data.nama;

        const result = await dataService.updateKelas(1,  name)
        res.status(200).send({
            message: `Kelas with id ${req.params.id} is updated`,
            
        })
    }
    catch(error){
        
    }
}

exports.deleteKelas = async(req, res) => {
    try{
        const result = await dataService.deleteKelas(1)
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

        const result = await dataService.assignDosen(1,idDosen)
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

        const result = await dataService.assignMahasiswa(1,idMahasiswa)
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


//Verifier
exports.createVerifier = async(req, res) => {
    try{
        const data = req.body;
        const name = data.nama;

        const result = await dataService.createVerifier(1,name)
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

        const result = await dataService.updateVerifier(1,  name)
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




