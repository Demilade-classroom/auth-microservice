const routes = require('../constants/route.constants');
const jwt = require('jsonwebtoken');
const config = require('../config');

// only logged in users that are admins to that app
module.exports = (req, res, next) => {
    // if (routes.adminOnlyRoutes.includes(req.path)) {
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
            req.user.role = decoded.role;
            if ( req.user.role === 'ADMIN' ) {
                return next();
            } else {
                return res.status(403).json({
                    message: 'Missing credentials!!'
                });
            }
        } catch (error) {
            console.log("Error from admin verification >>>>> ", error);
			res.status(statusCode.FORBIDDEN).json({
				message: 'Something went wrong. Please try again..'
			});
        }
        
    // } else {
    //     next();
    // }
};
 