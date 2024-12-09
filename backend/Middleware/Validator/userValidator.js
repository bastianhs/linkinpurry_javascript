import { validateEmail, validatePassword, sanitizeString } from "./utils.js";

export const updateProfileValidator = (req, res, next) => {
	const { username, email, password, full_name } = req.body;
	const errors = [];

	if (username) {
		if (username.length < 3) {
			errors.push({
				field: "username",
				message: "Username must be at least 3 characters",
			});
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (emailRegex.test(username)) {
			errors.push({
				field: "username",
				message: "Username must not be in email format",
			});
		}
	}

	if (email && !validateEmail(email)) {
		errors.push({
			field: "email",
			message: "Invalid email format",
		});
	}

	if (password) {
		const passwordRequirements = validatePassword(password);
		if (!Object.values(passwordRequirements).every(Boolean)) {
			errors.push({
				field: "password",
				message:
					"Password must be 8+ characters with uppercase, lowercase, number and special character",
			});
		}
	}

	if (full_name && full_name.trim().length === 0) {
		errors.push({
			field: "full_name",
			message: "Full name cannot be empty",
		});
	}

	if (errors.length) {
		return res.status(400).json({
			success: false,
			errors,
		});
	}

	req.body.username = username ? sanitizeString(username) : undefined;
	req.body.email = email ? sanitizeString(email) : undefined;
	req.body.full_name = full_name ? sanitizeString(full_name) : undefined;

	next();
};
