const academicRecordRouter = require('express').Router()
const academicRecordController = require('../controllers/academicRecord.js')
const auth = require('../middleware/auth.js')

academicRecordRouter.use(auth)

academicRecordRouter.post('/', academicRecordController.createAcademicRecord)
academicRecordRouter.get('/:id', academicRecordController.getAcademicRecordById)
academicRecordRouter.put('/:id', academicRecordController.updateAcademicRecord)
academicRecordRouter.patch('/grade/:id', academicRecordController.setGrade)
academicRecordRouter.delete('/:id', academicRecordController.deleteAcademicRecord)

module.exports = academicRecordRouter;