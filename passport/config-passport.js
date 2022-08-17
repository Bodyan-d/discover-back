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

// import passport from 'passport';
// import { ExtractJwt } from 'passport-jwt';
// import { Strategy } from 'passport-local';
// import User from '../models/user.js';
// import dotenv from 'dotenv';
// dotenv.config();
// const SECRET_KEY = process.env.JWT_SECRET_KEY;

// const params = {
// 	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
// 	secretOrKey: SECRET_KEY,
// };

// passport.use(
// 	new Strategy(params, async (payload, done) => {
// 		try {
// 			const user = await User.findById(payload.id);
// 			if (!user) {
// 				return done(new Error('User not found'), false);
// 			}
// 			if (!user.token) {
// 				return done(null, false);
// 			}
// 			return done(null, user);
// 		} catch (error) {
// 			return done(error, false);
// 		}
// 	})
// );
