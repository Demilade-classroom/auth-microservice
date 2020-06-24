const routes = require('../constants/route.constants');
const jwt = require('jsonwebtoken');
const config = require('../config');

// checks the app you're trying to access 
module.exports = (req, res, next) => {
    if (routes.appCheckRoutes.includes(req.path)) {
        if (!req.headers.authorization) {
            return res.status(412).json({
                error: true,
                message: 'Access denied!! Missing authorization credentials'
            });
        }
        let token = req.headers.authorization;

        if (token.startsWith('Bearer ')) {
            token = token.split(' ')[1];
        }
        
        try {
            const decoded = jwt.verify(token, config.JWT_SECRET);
            req.app = decoded;
            return next();
        } catch (error) {
            console.log("Error from getting app info. >>>>> ", error);
			return res.status(401).json({
				message: 'Something went wrong. Invalid app credentials. Please try again..'
			});
        }
        
    } else {
        next();
    }
};