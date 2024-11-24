import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const users = [
	{ id: 1, username: "john_doe", email: "john@example.com", password: bcrypt.hashSync("password123", 10), role: "job_seeker" }
];//dummy model

const login = async (req, res) => {
	const { identifier, password } = req.body;
	if (!identifier || !password) {
		return res.status(400).json({
			success: false,
			message: "Identifier and password are required.",
			error: "Missing identifier or password in the request body.",
		});
	}
    //dummy model algrithm
	const user = users.find(
		(u) => u.email === identifier || u.username === identifier
	);
	if (!user) {
		return res.status(401).json({
			success: false,
			message: "Invalid credentials.",
			error: "User not found or invalid identifier.",
		});
	}
	try {
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials.",
				error: "Incorrect password.",
			});
		}
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: "Error during password verification.",
			error: err.message,
		});
	}
	const payload = {
		userId: user.id,
		email: user.email,
		role: user.role,
	};
	let token;
	try {
        console.log(process.env.JWT_SECRET)
		token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRATION,
		});
	} catch (err) {
        console.log(err)
		return res.status(500).json({
			success: false,
			message: "Failed to generate JWT token.",
			error: err.message,
		});
	}
	res
		.cookie("token", token, {
			httpOnly: true, 
			maxAge: process.env.JWT_EXPIRATION * 1000, 
		})
		.json({
			success: true,
			message: "Login successful",
			body: {
				token, 
			},
		});
};

export default login;