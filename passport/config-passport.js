import passport from 'passport';
import passportJWT from 'passport-jwt';
import User from '../models/user.js';
import 'dotenv/config';
import express from 'express';
const SECRET_KEY = process.env.JWT_SECRET_KEY;

const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const params = {
	secretOrKey: SECRET_KEY,
	jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
};

// JWT Strategy
passport.use(
	new Strategy(params, function (payload, done) {
		User.find({ _id: payload.id })
			.then(([user]) => {
				if (!user) {
					return done(new Error('User not found'));
				}
				return done(null, user);
			})
			.catch(err => done(err));
	})
);
