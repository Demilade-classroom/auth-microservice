const express = require('express');
const appRouter = express.Router();
const appController = require('../controllers/app.controller');
const {
    appRegisterValidationRules,
    appValidate,
} = require('../validation/app_register.validation');

appRouter.post('/register', appRegisterValidationRules(), appValidate, appController.registerApp);
appRouter.get('/details', appController.getApp);

module.exports = appRouter;
