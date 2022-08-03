import express from 'express';
const router = express.Router();
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import 'dotenv/config';
const secret = process.env.SECRET;

const auth = (req, res, next) => {
	passport.authenticate('jwt', { session: false }, (err, user) => {
		if (!user || err) {
			return res.status(401).json({
				status: 'error',
				code: 401,
				message: 'Unauthorized',
				data: 'Unauthorized',
			});
		}
		req.user = user;
		next();
	})(req, res, next);
};

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
		newUser.setPassword(password);
		await newUser.save();
		res.status(201).json({
			status: 'success',
			code: 201,
			data: {
				message: 'Registration successful',
			},
		});
	} catch (error) {
		next(error);
	}
});

router.post('/login', async (req, res, next) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	const id = user._id;
	console.log(id);

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

	const token = jwt.sign(payload, secret, { expiresIn: '1m' });
	await User.findOneAndUpdate({ _id: id }, { accessToken: token });

	res.json({
		status: 'success',
		code: 200,
		data: {
			token,
		},
	});
});

router.get('/profile', auth, (req, res, next) => {
	const { username } = req.user;
	res.json({
		status: 'success',
		code: 200,
		data: {
			message: `Authorization was successful: ${username}`,
		},
	});
});

router.get('/logout', auth, async (req, res, next) => {
	const id = req.user._id;
	console.log(req.user);
	await User.findOneAndUpdate(id, null, null);
	return res.status(204).json({});
});
export default router;
