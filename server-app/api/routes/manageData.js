const dataRouter = require('express').Router()
const dataController = require('../controllers/manageData.js')

//pendidikan tinggi
dataRouter.post('/pendidikan-tinggi', dataController.createPT)
dataRouter.get('/pendidikan-tinggi', dataController.getAllPT)
dataRouter.put('/pendidikan-tinggi/:id', dataController.updatePT)
dataRouter.delete('/pendidikan-tinggi/:id', dataController.deletePT)

//prodi
dataRouter.get('/prodi', dataController.getAllProdi)
//dosen
dataRouter.get('/dosen')
//mahasiswa
dataRouter.get('/mahasiswa')

//kelas
dataRouter.get('/kelas')

//verifier
dataRouter.get('/verifier')



module.exports = dataRouter;