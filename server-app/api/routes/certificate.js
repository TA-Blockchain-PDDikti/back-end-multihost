const certificateRouter = require('express').Router()
const certificateController = require('../controllers/certificate.js')
const auth = require('../middleware/auth.js')

certificateRouter.use(auth)

certificateRouter.post('/', certificateController.createAcademicCertificate)
certificateRouter.get('/ijazah/:id', certificateController.getIjazahById)
certificateRouter.get('/transkrip/:id', certificateController.getITranskripById)
certificateRouter.post('/sign/:id', certificateController.signIjazah)
certificateRouter.put('ijazah/:id', certificateController.updateIjazah)
certificateRouter.put('transkrip/:id', certificateController.updateTranskrip)
certificateRouter.post('/identifier/', certificateController.generateIdentifier)
certificateRouter.get('/identifier/', certificateController.getIdentifier)
certificateRouter.post('/verify/', certificateController.verify)
certificateRouter.post('/signer/', certificateController.addSigner)
certificateRouter.post('/verify/', certificateController.verify)

module.exports = certificateRouter;