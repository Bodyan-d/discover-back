import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user.js';
import 'dotenv/config';
import express from 'express';
const SECRET_KEY = process.env.SECRET_KEY;

const params = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: SECRET_KEY,
};

// JWT Strategy
// passport.use(
// 	new Strategy(params, function (payload, done) {
// 		User.find({ _id: payload.id })
// 			.then(([user]) => {
// 				if (!user) {
// 					return done(new Error('User not found'), false);
// 				}
// 				return done(null, user);
// 			})
// 			.catch(err => done(err));
// 	})
// );
passport.use(
	new Strategy(params, async (payload, done) => {
		try {
			const user = await User.findById(payload.id);
			if (!user) {
				return done(new Error('User not found'), false);
			}
			return done(null, user);
		} catch (error) {
			return done(error, false);
		}
	})
);
