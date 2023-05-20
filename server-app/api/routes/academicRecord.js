const academicRecordRouter = require('express').Router()
const academicRecordController = require('../controllers/academicRecord.js')
const auth = require('../middleware/auth.js')

academicRecordRouter.use(auth)

academicRecordRouter.post('/', academicRecordController.createAcademicRecord)
academicRecordRouter.get('/', academicRecordController.getAllAcademicRecord)
academicRecordRouter.get('/:id', academicRecordController.getAcademicRecordById)
academicRecordRouter.get('/mahasiswa/:id', academicRecordController.getAcademicRecordByIdMhsw)
academicRecordRouter.get('/kelas/:id', academicRecordController.getAcademicRecordByIdKls)
academicRecordRouter.put('/:id', academicRecordController.updateAcademicRecord)
academicRecordRouter.put('/signNilai/:id', academicRecordController.signAcademicRecord)
academicRecordRouter.patch('/grade/:id', academicRecordController.setGrade)
academicRecordRouter.delete('/:id', academicRecordController.deleteAcademicRecord)

module.exports = academicRecordRouter;