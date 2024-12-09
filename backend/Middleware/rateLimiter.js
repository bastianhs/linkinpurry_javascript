const rateLimit = {};

export const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
	return (req, res, next) => {
		const ip = req.ip;
		const now = Date.now();

		rateLimit[ip] = rateLimit[ip] || [];
		rateLimit[ip] = rateLimit[ip].filter((time) => time > now - windowMs);

		if (rateLimit[ip].length >= max) {
			return res.status(429).json({
				success: false,
				message: "Too many requests, please try again later",
			});
		}

		rateLimit[ip].push(now);
		next();
	};
};
