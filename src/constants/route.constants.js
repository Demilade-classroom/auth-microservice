module.exports = {
    appCheckRoutes: [
        '/api/v1/auth/register',
        '/api/v1/auth/login',
    ],
    unsecureRoutes: [
        '/api/v1',
        '/',
        '/api/v1/app/register'
    ],
    secureRoutes: [ // these routes are much depending on the application
        '/api/v1/app/details', // only logged-in admins can access this endpoint
        '/api/v1/auth/status',
    ]
};