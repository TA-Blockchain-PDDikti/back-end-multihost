const dataRouter = require('express').Router()
const dataController = require('../controllers/manageData.js')

//pendidikan tinggi
dataRouter.post('/pendidikan-tinggi', dataController.createPT)
dataRouter.get('/pendidikan-tinggi', dataController.getAllPT)
dataRouter.put('/pendidikan-tinggi/:id', dataController.updatePT)
dataRouter.delete('/pendidikan-tinggi/:id', dataController.deletePT)

//prodi
dataRouter.post('/prodi', dataController.createProdi)
dataRouter.get('/prodi', dataController.getAllProdi)
dataRouter.put('/prodi/:id', dataController.updateProdi)
dataRouter.delete('/prodi/:id', dataController.deleteProdi)

//dosen
dataRouter.post('/dosen', dataController.createDosen)
dataRouter.get('/dosen', dataController.getAllDosen)
dataRouter.put('/dosen/:id', dataController.updateDosen)
dataRouter.delete('/dosen/:id', dataController.deleteDosen)

//mahasiswa
dataRouter.post('/mahasiswa', dataController.createMahasiswa)
dataRouter.get('/mahasiswa', dataController.getAllMahasiswa)
dataRouter.put('/mahasiswa/:id', dataController.updateMahasiswa)
dataRouter.delete('/mahasiswa/:id', dataController.deleteMahasiswa)

//kelas
dataRouter.post('/kelas', dataController.createKelas)
dataRouter.get('/kelas', dataController.getAllKelas)
dataRouter.put('/kelas/:id', dataController.updateKelas)
dataRouter.delete('/kelas/:id', dataController.deleteKelas)

//verifier
dataRouter.post('/verifier', dataController.createVerifier)
dataRouter.get('/verifier', dataController.getAllVerifier)
dataRouter.put('/verifier/:id', dataController.updateVerifier)
dataRouter.delete('/verifier/:id', dataController.deleteVerifier)


module.exports = dataRouter;