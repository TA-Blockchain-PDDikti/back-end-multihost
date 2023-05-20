const router = require('express').Router()
const dataRouter = require('./data.js')
const userRouter = require('./user.js')
const certificateRouter = require('./academicCertificate.js')
const academicRecordRouter = require('./academicRecord.js')

router.use('/data', dataRouter);
router.use('/academicRecords', academicRecordRouter)
router.use('/certificates', certificateRouter)
router.use('/auth', userRouter)

module.exports = router;