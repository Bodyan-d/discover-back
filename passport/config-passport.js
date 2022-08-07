import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user.js';
import dotenv from 'dotenv';
dotenv.config();
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

// module.exports = passport => {
// 	passport.use(
// 		new JwtStrategy(opts, (jwt_payload, done) => {
// 			User.findById(jwt_payload.id)
// 				.then(user => {
// 					if (user) {
// 						return done(null, user);
// 					}
// 					return done(null, false);
// 				})
// 				.catch(err => {
// 					console.log(err);
// 				});
// 		})
// 	);
// };
