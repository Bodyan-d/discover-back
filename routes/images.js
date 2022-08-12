import express from 'express';
const router = express.Router();
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import 'dotenv/config';
const secret = process.env.SECRET_KEY;

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

router.post('/', auth, async (req, res, next) => {
	try {
		const { _id: userId } = req.user;
		const { amount, type } = req.body;
		const amountNumber = Number(amount);

		const transactionBalance = countBalance(type, balance, amountNumber);

		await User.addBalance(userId, transactionBalance);

		const transaction = await Transaction.addTransaction({
			...req.body,
			owner: userId,
			balance: transactionBalance,
		});
		return res.status(201).json({
			status: 'success',
			code: 201,
			data: { transaction },
		});
	} catch (err) {
		next(err);
	}
});

export default router;
