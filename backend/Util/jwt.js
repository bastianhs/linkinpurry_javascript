import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (token) => {
	try {
		if (!token) {
			throw new Error("No token provided");
		}

		// Remove 'Bearer ' if present
		const cleanToken = token.replace("Bearer ", "");

		// Verify and decode token using JWT_SECRET from environment variables
		const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
		return {
			userId: decoded.userId,
			email: decoded.email,
		};
	} catch (error) {
		throw new Error("Invalid or expired token");
	}
};

export const generateToken = (payload) => {
	return jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRATION || "24h",
	});
};
