import passport from 'passport';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import User from '../models/user.js';
import 'dotenv/config';
const SECRET_KEY = process.env.SECRET_KEY;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET_KEY;

console.log('fjwnibj');

passport.use(
	new JwtStrategy(opts, async function (payload, done) {
		console.log('Payload', payload);
		try {
			const user = await User.findOne({ _id: payload.id });
			console.log('User', user);
			if (!user) {
				console.log('!user', user);
				return done(new Error('User not found'), false);
			}
			if (!user.token) {
				console.log('!user.token', user);
				return done(null, false);
			}
			return done(null, user);
		} catch (error) {
			return done(error, false);
		}
	})
);
