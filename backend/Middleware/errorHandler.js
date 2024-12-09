// src/middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
	console.error(err.stack);

	if (err.name === "ValidationError") {
		return res.status(400).json({
			success: false,
			message: "Validation Error",
			errors: err.errors,
		});
	}

	if (err.name === "UnauthorizedError") {
		return res.status(401).json({
			success: false,
			message: "Invalid token",
		});
	}

	res.status(500).json({
		success: false,
		message: "Internal server error",
	});
};
