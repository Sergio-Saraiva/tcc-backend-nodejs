const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.replace('Bearer ', '');
		if (!token) {
			throw new Error('Auth Failed, no token');
		}
		const decodedToken = jwt.verify(token, process.env.JWT_USER_KEY);
		req.user = {
			userID: decodedToken.userId,
		};
		next();
	} catch (err) {
		const error = new HttpError('Authentication failed!', 403);
		return next(error);
	}
};
