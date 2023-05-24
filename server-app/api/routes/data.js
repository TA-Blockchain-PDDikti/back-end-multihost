const dataRouter = require('express').Router()
const dataController = require('../controllers/data.js')
const auth = require('../middleware/auth.js')

dataRouter.use(auth)

//pendidikan tinggi
dataRouter.post('/pendidikan-tinggi', dataController.createPT)
dataRouter.get('/pendidikan-tinggi', dataController.getAllPT)
dataRouter.get('/pendidikan-tinggi/:id', dataController.getPTById)
dataRouter.put('/pendidikan-tinggi/:id', dataController.updatePT)
dataRouter.delete('/pendidikan-tinggi/:id', dataController.deletePT)

//prodi
dataRouter.post('/prodi', dataController.createProdi)
dataRouter.get('/prodi', dataController.getAllProdi)
dataRouter.get('/prodi/:id', dataController.getProdiById)
dataRouter.get('/prodi/pt/:id', dataController.getProdiByPT)
dataRouter.put('/prodi/:id', dataController.updateProdi)
dataRouter.delete('/prodi/:id', dataController.deleteProdi)

//dosen
dataRouter.post('/dosen', dataController.createDosen)
dataRouter.get('/dosen', dataController.getAllDosen)
dataRouter.get('/dosen/:id', dataController.getDosenById)
dataRouter.get('/dosen/pt/:id', dataController.getDosenByPT)
dataRouter.put('/dosen/:id', dataController.updateDosen)
dataRouter.put('/dosen/sign/:id', dataController.signDosen)
dataRouter.delete('/dosen/:id', dataController.deleteDosen)

//mahasiswa
dataRouter.post('/mahasiswa', dataController.createMahasiswa)
dataRouter.post('/mahasiswa/setLulus', dataController.setGraduated)
dataRouter.get('/mahasiswa', dataController.getAllMahasiswa)
dataRouter.get('/mahasiswa/pt/:id', dataController.getMahasiswaByPT)
dataRouter.get('/mahasiswa/:id', dataController.getMahasiswaById)
dataRouter.get('/mahasiswa/kelas/:idKelas', dataController.getMahasiswaByKelas)
dataRouter.put('/mahasiswa/:id', dataController.updateMahasiswa)
dataRouter.delete('/mahasiswa/:id', dataController.deleteMahasiswa)

//matakuliah
dataRouter.post('/matkul', dataController.createMataKuliah)
dataRouter.get('/matkul', dataController.getAllMataKuliah)
dataRouter.get('/matkul/:id', dataController.getMataKuliahById)
dataRouter.get('/matkul/pt/:id', dataController.getMataKuliahByIdPt)
dataRouter.put('/matkul/:id', dataController.updateMataKuliah)
dataRouter.delete('/matkul/:id', dataController.deleteMataKuliah)

//kelas
dataRouter.post('/kelas', dataController.createKelas)
dataRouter.get('/kelas', dataController.getAllKelas)
dataRouter.get('/kelas/:id', dataController.getKelasById)
dataRouter.put('/kelas/:id', dataController.updateKelas)
dataRouter.delete('/kelas/:id', dataController.deleteKelas)
dataRouter.post('/kelas/dosen', dataController.assignDosen)
dataRouter.post('/kelas/mahasiswa', dataController.assignMahasiswa)

// //verifier
// dataRouter.post('/verifier', dataController.createVerifier)
// dataRouter.get('/verifier', dataController.getAllVerifier)
// dataRouter.put('/verifier/:id', dataController.updateVerifier)
// dataRouter.delete('/verifier/:id', dataController.deleteVerifier)


module.exports = dataRouter;