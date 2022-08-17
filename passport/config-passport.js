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
			if (err) {
				return done(err, false);
			}
			if (!user.token) {
				return done(null, false);
			}
			if (user) {
				return done(null, user);
			} else {
				return done(new Error('User not found'), false);
			}
		});
	})
);
