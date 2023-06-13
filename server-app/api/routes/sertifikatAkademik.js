const certificateRouter = require('express').Router()
const certificateController = require('../controllers/sertifikatAkademik.js')
const auth = require('../middleware/auth.js')

certificateRouter.post('/verify/', certificateController.verify)

certificateRouter.use(auth)
certificateRouter.post('/', certificateController.createAcademicCertificate)
certificateRouter.post('/graduated', certificateController.setGraduated)
certificateRouter.post('/approve/ijazah/', certificateController.approveIjazah)
certificateRouter.post('/approve/transkrip/', certificateController.approveTranskrip)
certificateRouter.post('/identifier/', certificateController.generateIdentifier)
certificateRouter.post('/approver/', certificateController.addApprover)

// Ijazah
certificateRouter.get('/ijazah/', certificateController.getAllIjazah)
certificateRouter.get('/ijazah/:id', certificateController.getIjazahById)
certificateRouter.get('/ijazah/pt/:id', certificateController.getIjazahByIdPt)
certificateRouter.get('/ijazah/prodi/:id', certificateController.getIjazahByIdProdi)
certificateRouter.get('/ijazah/mahasiswa/:id', certificateController.getIjazahByIdMahasiswa)
certificateRouter.get('/ijazah/approver/:id', certificateController.getIjazahByIdApprover)
certificateRouter.put('/ijazah/:id', certificateController.updateIjazah)

//transkrip
certificateRouter.get('/transkrip/', certificateController.getAllTranskrip)
certificateRouter.get('/transkrip/:id', certificateController.getTranskripById)
certificateRouter.get('/transkrip/pt/:id', certificateController.getTranskripByIdPt)
certificateRouter.get('/transkrip/prodi/:id', certificateController.getTranskripByIdProdi)
certificateRouter.get('/transkrip/mahasiswa/:id', certificateController.getTranskripByIdMahasiswa)
certificateRouter.get('/transkrip/approver/:id', certificateController.getTranskripByIdApprover)
certificateRouter.put('/transkrip/:id', certificateController.updateTranskrip)

module.exports = certificateRouter;