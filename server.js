const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./src/config');
const initDB = require('./src/config/dbconfig');
const authRoutes = require('./src/routes/auth.route');
const appRoutes = require('./src/routes/app.route');
const accessToApp = require('./src/middlewares/checkApp');
const checkAuth = require('./src/middlewares/checkAuth');
const app = express();

initDB(); // connects to db

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.send('Server working 🔥');
});

app.get('/api/v1', (req, res) => {
	res.send(` Welcome to the API Version 1.0.0 of Authentication Microservice 
        Please go through the docs for necessary information on how to get started..
    `);
});

app.use(accessToApp);
app.use(checkAuth);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/app', appRoutes);

// You can set 404 and 500 errors
app.use((req, res, next) => {
	const error = new Error('Not found');
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	if (error.status === 404)
		res.status(404).json({ message: 'Invalid Request, Request Not found' });
	else {
		console.log(error);
		res.status(500).json({
			message: 'Oops, problem occurred while processing your request..',
		});
	}
});

const port = config.PORT;

app.listen(port, () => {
    console.log(`::: Server running on port: ${port} 🔥`);
});