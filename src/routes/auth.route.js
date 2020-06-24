const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/auth.controller');

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.patch('/verify-account/:email-:token', authController.verifyAccount);
authRouter.get('/status', authController.checkStatus);

module.exports = authRouter;