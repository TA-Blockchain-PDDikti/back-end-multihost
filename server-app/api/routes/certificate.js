const certificateRouter = require('express').Router()
const certificateController = require('../controllers/certificate.js')

certificateRouter.post('/', certificateController.createIjazah)
certificateRouter.get('/', certificateController.getIjazah)
certificateRouter.post('/sign/:id', certificateController.signIjazah)
certificateRouter.put('/:id', certificateController.updateIjazah)
certificateRouter.post('/identifier/', certificateController.generateIdentifier)
certificateRouter.get('/identifier/', certificateController.getIdentifier)
certificateRouter.post('/verify/', certificateController.verify)
certificateRouter.post('/signer/', certificateController.addSigner)
certificateRouter.post('/verify/', certificateController.verify)

module.exports = certificateRouter;