const userRouter = require('express').Router()
const userController = require('../controllers/user.js')

userRouter.post('/register', userController.registerUser)
userRouter.post('/enroll', userController.enrollAdmin)

module.exports = userRouter;