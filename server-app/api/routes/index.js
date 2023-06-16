const router = require('express').Router()
const dataRouter = require('./data.js')
const userRouter = require('./user.js')
const certificateRouter = require('./sertifikatAkademik.js')
const academicRecordRouter = require('./administrasiNilai.js')

router.use('/data', dataRouter);
router.use('/academicRecords', academicRecordRouter)
router.use('/certificates', certificateRouter)
router.use('/auth', userRouter)

module.exports = router;