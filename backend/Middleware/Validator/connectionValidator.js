export const connectionRequestValidator = (req, res, next) => {
	const { toId } = req.body;

	if (!toId || isNaN(Number(toId))) {
		return res.status(400).json({
			success: false,
			errors: [{ field: "toId", message: "Valid user ID is required" }],
		});
	}

	next();
};

export const connectionResponseValidator = (req, res, next) => {
	const { fromId, action } = req.body;
	const errors = [];

	if (!fromId || isNaN(Number(fromId))) {
		errors.push({ field: "fromId", message: "Valid user ID is required" });
	}
	if (!action || !["accept", "decline"].includes(action)) {
		errors.push({
			field: "action",
			message: "Action must be accept or decline",
		});
	}

	if (errors.length) {
		return res.status(400).json({ success: false, errors });
	}

	next();
};
