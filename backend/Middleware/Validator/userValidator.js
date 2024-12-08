export const updateProfileValidator = (req, res, next) => {
	const { username, email, password } = req.body;
	const errors = [];

	if (username && username.length < 3) {
		errors.push({
			field: "username",
			message: "Username must be at least 3 characters",
		});
	}
	if (email && !validateEmail(email)) {
		errors.push({ field: "email", message: "Invalid email format" });
	}
	if (password && !Object.values(validatePassword(password)).every(Boolean)) {
		errors.push({
			field: "password",
			message: "Password does not meet requirements",
		});
	}

	if (errors.length) {
		return res.status(400).json({ success: false, errors });
	}

	next();
};
