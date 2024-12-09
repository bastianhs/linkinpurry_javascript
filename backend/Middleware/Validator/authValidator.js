import { validateEmail, validatePassword, sanitizeString } from "./utils.js";

export const loginValidator = async (req, res, next) => {
	const { email, password } = req.body;
	const errors = [];

	if (!email || !validateEmail(email)) {
		errors.push({ field: "email", message: "Invalid email format" });
	}
	if (!password || password.length < 8) {
		errors.push({
			field: "password",
			message: "Password must be at least 8 characters",
		});
	}

	if (errors.length) {
		return res
			.status(400)
			.json({ success: false, message: "Validation failed", errors });
	}
	next();
};

export const registerValidator = (req, res, next) => {
	const { username, email, password, name } = req.body;
	const errors = [];

	if (!username || username.length < 3) {
		errors.push({
			field: "username",
			message: "Username must be at least 3 characters",
		});
	}
	if (!email || !validateEmail(email)) {
		errors.push({ field: "email", message: "Invalid email format" });
	}
	if (!password || !Object.values(validatePassword(password)).every(Boolean)) {
		errors.push({
			field: "password",
			message: "Password does not meet requirements",
		});
	}
	if (!name || name.trim().length === 0) {
		errors.push({ field: "name", message: "Name is required" });
	}

	if (errors.length) {
		return res.status(400).json({ success: false, errors });
	}

	req.body.username = sanitizeString(username);
	req.body.email = sanitizeString(email);
	req.body.name = sanitizeString(name);
	next();
};
