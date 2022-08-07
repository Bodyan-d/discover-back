import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import User from '../modules/user.js';
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

const params = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: SECRET_KEY,
};

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
