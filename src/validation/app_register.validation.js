const { body, validationResult } = require('express-validator');
const appRegisterValidationRules = () => {
	return [
        body('app_name')
            .not()
            .isEmpty()
            .withMessage('Application name is required')
			.isLength({ min: 4, max: 50 })
			.withMessage('Application name must have at least 4 characters'),
		body('app_nice_name')
			.not()
			.isEmpty()
			.withMessage('Application should have a nice name apart'),
	];
};

const appValidate = (req, res, next) => {
	const errors = validationResult(req);
	if (errors.isEmpty()) {
		return next();
	}
	const extractedErrors = [];
	errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

	return res.status(422).json({
		errors: extractedErrors,
	});
};

module.exports = {
	appRegisterValidationRules,
	appValidate,
};
