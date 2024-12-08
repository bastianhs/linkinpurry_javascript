import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
	const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
	// console.log(token);
	if (!token) {
		console.log("No token");
		return res.status(401).json({ errors: "Unauthorized, please login." });
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (err) {
		console.error("Token verification error:", err.message);
		return res.status(401).json({ errors: "Invalid or expired token." });
	}
};


const profileAuthenticate = (req, res, next) => {
	const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
	
	if (!token) {
		req.user = null; 
		return next();
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded; 
		next();
	} catch (err) {
		console.error("Token verification error:", err.message);
		req.user = null; 
		next();
	}
};


export {
	authenticate,
	profileAuthenticate
};
