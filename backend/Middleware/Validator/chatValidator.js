export const createChatValidator = (req, res, next) => {
	const { to_id } = req.body;
	const errors = [];

	if (!to_id || isNaN(Number(to_id))) {
		errors.push({ field: "to_id", message: "Valid user ID is required" });
	}

	if (errors.length) {
		return res.status(400).json({ success: false, errors });
	}
	next();
};
