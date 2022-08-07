import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user.js';
import 'dotenv/config';
const SECRET_KEY = process.env.SECRET_KEY;

const params = {
	secretOrKey: SECRET_KEY,
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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
