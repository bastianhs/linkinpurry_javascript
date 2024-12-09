import sanitize from "sanitize-html";

export const sanitizeRequest = (req, res, next) => {
	if (req.body) {
		Object.keys(req.body).forEach((key) => {
			if (typeof req.body[key] === "string") {
				req.body[key] = sanitize(req.body[key]);
			}
		});
	}
	next();
};
