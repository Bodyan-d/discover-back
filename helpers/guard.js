import passport from 'passport';
import('../passport/config-passport.js');
import jwt from 'jsonwebtoken';
import 'dotenv/config';
const SECRET_KEY = process.env.SECRET_KEY;

const guard = async (req, res, next) => {
	passport.authenticate('jwt', { session: false }, async (error, user) => {
		var token = req.headers.authorization.split(' ')[1];

		if (!user || error || token !== user.token) {
			jwt.verify(token, SECRET_KEY, function (error, decoded) {
				if (error) {
					if (error.name === 'TokenExpiredError')
						return res.json({
							status: 'error',
							code: 401,
							message: 'Access Token was expired!',
						});
					else
						return res.json({
							status: 'error',
							code: 401,
							message: 'Unable to parse token',
						});
				} else {
					next();
				}
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
