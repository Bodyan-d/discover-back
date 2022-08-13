import passport from 'passport';
import('../passport/config-passport.js');
import jwt from 'jsonwebtoken';
import 'dotenv/config';
const SECRET_KEY = process.env.SECRET_KEY;

const guard = async (req, res, next) => {
	passport.authenticate('jwt', { session: false }, async (error, user) => {
		const token = req.headers.authorization.split(' ')[1];
		console.log(token);
		console.log(user);

		if (!user || error || token !== user.token) {
			jwt.verify(token, SECRET_KEY, function (error, decoded) {
				return res.status(401).json({
					status: 'error',
					code: 401,
					message: 'Invalid credentials',
				});
			});
		}

		req.user = user;
		return next();
	})(req, res, next);
};

export default guard;
