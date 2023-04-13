const dataService = require('../services/manageData.js')

//Pendidikan Tinggi
exports.createPT = async(req, res) => {
    try{
        const data = req.body;
        const name = data.nama;

        constresult = await dataService.createPT(1,name)
        res.status(201).send({
            message: "Pendidikan Tinggi is created",
            data
        })
    }
    catch(error){
        
    }
}

exports.updatePT = async(req, res) => {
    try{
        const data = req.body;
        const name = data.nama;

        constresult = await dataService.createPT(1,  name)
        res.status(200).send({
            message: `Pendidikan Tinggi with id ${req.params.id} is updated`,
            
        })
    }
    catch(error){
        
    }
}

exports.deletePT = async(req, res) => {
    try{
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
exports.getAllProdi = async(req, res) =>  {

    res.send("Prodi");
}


// Dosen
//Mahasiswa

//Kelas



