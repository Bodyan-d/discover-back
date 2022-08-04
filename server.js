import 'dotenv/config';
import express from 'express';
import path from 'path';
import passport from 'passport';
import logger from 'morgan';
import { fileURLToPath } from 'url';
import cors from 'cors';
import mongoose from 'mongoose';
import './passport/config-passport.js';

const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

import imagesRouter from './routes/images.js';
import userRouter from './routes/user.js';

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

app.use('/user/images', imagesRouter);
app.use('/user', userRouter);

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

const PORT = process.env.PORT || 3030;
const uriDb = process.env.DB_HOST;

const connection = mongoose.connect(uriDb, {
	promiseLibrary: global.Promise,
	useNewUrlParser: true,
});

connection
	.then(() => {
		app.listen(PORT, function () {
			console.log(`Server running. Use our API on port: ${PORT}`);
		});
	})
	.catch(err =>
		console.log(`Server not running. Error message: ${err.message}`)
	);

export default app;
