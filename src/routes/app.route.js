const express = require('express');
const appRouter = express.Router();
const appController = require('../controllers/app.controller');
const checkAppAdmin = require('../middlewares/isAppAdmin');
const {
    appRegisterValidationRules,
    appValidate,
} = require('../validation/app_register.validation');

appRouter.post('/register', appRegisterValidationRules(), appValidate, appController.registerApp);
appRouter.get('/:app_name', checkAppAdmin, appController.getApp);

module.exports = appRouter;
