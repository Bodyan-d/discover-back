import passport from 'passport';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import User from '../models/user.js';
import 'dotenv/config';
const SECRET_KEY = process.env.SECRET_KEY;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET_KEY;

passport.use(
	new JwtStrategy(opts, function (payload, done) {
		User.findOne({ _id: payload.id }, function (err, user) {
			console.log(user);
			// console.log(user.token);
			if (err) {
				console.log('ERROR');
				return done(err, false);
			}
			if (!user?.token) {
				console.log('No token');
				return done(null, false);
			}
			if (user) {
				return done(null, user);
			} else {
				console.log('User not found');
				return done(new Error('User not found'), false);
			}
		});
	})
);
