import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../Model/userModel.js";

const login = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({
			success: false,
			message: "email and password are required.",
			error: "Missing email or password in the request body.",
		});
	}

	try {
		const user = await userModel.getUserByEmailOrUsername(
			email,
			email
		);

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials.",
				error: "User not found or invalid email.",
			});
		}

		const isPasswordValid = await bcrypt.compare(password, user.password_hash);
		if (!isPasswordValid) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials.",
				error: "Incorrect password.",
			});
		}

		const payload = {
			userId: user.id.toString(),
			email: user.email,
		};

		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRATION,
		});
		// console.log(token);
		res.cookie("token", token, {
				httpOnly: true,
				maxAge: process.env.JWT_EXPIRATION * 1000,
				sameSite: "none",
			});

		res.json({
				success: true,
				message: "Login successful",
				body: {
					token,
				},
			});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			success: false,
			message: "Server error during login.",
			error: err.message,
		});
	}
};

const register = async (req, res) => {
	const { username, email, name, password } = req.body;

	if (!username || !email || !name || !password) {
		return res.status(400).json({
			success: false,
			message: "All fields are required.",
			error: "Missing data in the request body.",
		});
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return res.status(400).json({
			success: false,
			message: "Invalid email format.",
			error: "The email does not match the expected format.",
		});
	}

	if (
		password.length < 8 ||
		!/[A-Z]/.test(password) ||
		!/[a-z]/.test(password) ||
		!/[0-9]/.test(password) ||
		!/[!@#$%^&*]/.test(password)
	) {
		return res.status(400).json({
			success: false,
			message:
				"Password must be at least 8 characters long and include uppercase, lowercase, numeric, and special characters.",
		});
	}

	try {
		const existingUser = await userModel.getUserByEmailOrUsername(
			email,
			username
		);

		if (existingUser) {
			return res.status(409).json({
				success: false,
				message: "Email or username already exists.",
				error: "Duplicate email or username.",
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await userModel.createUser(
			username,
			email,
			name,
			hashedPassword
		);

		const payload = {
			userId: newUser.id.toString(),
			email: newUser.email,
		};

		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRATION,
		});

		res
			.cookie("token", token, {
				httpOnly: true,
				maxAge: process.env.JWT_EXPIRATION * 1000,
			})
			.status(201)
			.json({
				success: true,
				message: "User registered successfully.",
				body: {
					user: {
						id: newUser.id.toString(),
						username: newUser.username,
						email: newUser.email,
						name: newUser.full_name,
					},
					token,
				},
			});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			success: false,
			message: "Server error during registration.",
			error: err.message,
		});
	}
};

const authentication = { login, register };
export default authentication;
