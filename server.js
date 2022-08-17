import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import passport from 'passport';
import logger from 'morgan';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';

import './passport/config-passport.js';

const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

import imagesRouter from './routes/images.js';
import userRouter from './routes/user.js';

const app = express();

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	next();
});

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(helmet());
app.use(logger(formatsLogger));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

app.use('/user/images', cors(), imagesRouter);
app.use('/user', cors(), userRouter);

// catch 404 and forward to error handler
app.use((req, res) => {
	res.status(404).json({ status: 'error', code: 404, message: 'Not found' });
});

app.use((err, req, res, next) => {
	console.log(`error`, err);
	const statusCode = err.status || 500;
	res.status(statusCode).json({
		status: statusCode === 500 ? 'fail' : 'error',
		code: statusCode,
		message: err.message,
	});
});

const PORT = process.env.PORT || 3001;
const uriDb = process.env.DB_MONGO;

const connection = mongoose.connect(uriDb, {
	promiseLibrary: global.Promise,
	useNewUrlParser: true,
});

connection
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server running. Use our API on port: ${PORT}`);
		});
	})
	.catch(err =>
		console.log(`Server not running. Error message: ${err.message}`)
	);

export default app;
