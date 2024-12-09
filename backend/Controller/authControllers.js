import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../Model/userModel.js";
import { BaseResponseDTO } from "../Dto/baseDto.js";
import {
	LoginRequestDTO,
	RegisterRequestDTO,
	UserResponseDTO,
} from "../Dto/authDto.js";

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
		const loginDto = new LoginRequestDTO(req.body);
		const user = await userModel.getUserByEmailOrUsername(
			loginDto.email,
			loginDto.email
		);

		if (!user) {
			return res.status(401).json(BaseResponseDTO.error("Email not found"));
		}

		const isPasswordValid = await bcrypt.compare(password, user.password_hash);
		if (!isPasswordValid) {
			return res
				.status(401)
				.json(
					BaseResponseDTO.error("Invalid credentials", "Incorrect password")
				);
		}

		const payload = {
			userId: user.id.toString(),
			email: user.email,
		};

		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: Number(process.env.JWT_EXPIRATION),
		});
		// console.log(token);
		res.cookie("token", token, {
			httpOnly: true,
			maxAge: process.env.JWT_EXPIRATION * 1000,
			sameSite: "lax",
			path: "/",
			domain: "localhost",
		});

		return res.json(BaseResponseDTO.success({ token }));
	} catch (err) {
		return res
			.status(500)
			.json(BaseResponseDTO.error("Server error during login"));
	}
};

const register = async (req, res) => {
	const registerDto = new RegisterRequestDTO(req.body);
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

	if (emailRegex.test(username)) {
		return res.status(400).json({
			success: false,
			message: "Invalid username format.",
			error: "The username must not look like an email.",
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
			expiresIn: Number(process.env.JWT_EXPIRATION),
		});

		res
			.cookie("token", token, {
				httpOnly: true,
				maxAge: process.env.JWT_EXPIRATION * 1000,
				sameSite: "lax",
				path: "/",
				domain: "localhost",
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

const logout = async (req, res) => {
	try {
		const cookieOptions = {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
			path: "/",
			domain: "localhost",
			expires: new Date(0), 
		};
		res.clearCookie("token", cookieOptions);

		return res.status(200).json({
			success: true,
			message: "Logged out successfully",
		});
	} catch (error) {
		console.error("Logout error:", error);
		return res.status(500).json({
			success: false,
			message: "Error during logout",
			error: error.message,
		});
	}
};
const authentication = { login, register, logout };
export default authentication;
