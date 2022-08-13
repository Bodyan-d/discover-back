import express from 'express';
const router = express.Router();
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import guard from '../helpers/guard.js';
import 'dotenv/config';
const SECRET_KEY = process.env.SECRET_KEY;

router.post('/registration', async (req, res, next) => {
	const { username, email, password } = req.body;
	const user = await User.findOne({ email });
	if (user) {
		return res.status(409).json({
			status: 'error',
			code: 409,
			message: 'Email is already in use',
			data: 'Conflict',
		});
	}
	try {
		const newUser = new User({ username, email });
		const id = newUser._id;
		newUser.setPassword(password);
		await newUser.save();
		res.status(201).json({
			status: 'success',
			code: 201,
			message: 'Registration successful',
			data: { id, username, email, password },
		});
	} catch (error) {
		next(error);
	}
});

router.post('/login', async (req, res, next) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	const id = user._id;

	if (!user || !user.validPassword(password)) {
		return res.status(400).json({
			status: 'error',
			code: 400,
			message: 'Incorrect login or password',
			data: 'Bad request',
		});
	}

	const payload = {
		id,
		username: user.username,
	};

	const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1y' });
	await User.updateOne({ _id: id }, { token });

	res.status(200).json({
		status: 'success',
		code: 200,
		data: {
			token,
			id,
			username: user.username,
			email: user.email,
			password: user.password,
		},
	});
});

router.get('/profile', guard, async (req, res, next) => {
	try {
		const { email, id, username, token, password } = req.user;

		return res.status(200).json({
			status: 'success',
			code: 200,
			data: { id, username, email, password, token },
		});
	} catch (error) {
		next(error);
	}
});

router.get('/logout', guard, async (req, res, next) => {
	const id = req.user._id;
	await User.updateOne({ _id: id }, { token: null });
	return res.status(204).json({});
});
export default router;
