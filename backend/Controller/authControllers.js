import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const users = [
	{
		id: 1,
		username: "john_doe",
		email: "john@example.com",
		password: bcrypt.hashSync("password123", 10),
		role: "job_seeker",
	},
]; //dummy model

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
		console.log(process.env.JWT_SECRET);
		token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRATION,
		});
	} catch (err) {
		console.log(err);
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

const register = async (req, res) => {
	const { username, email, name, password } = req.body;

	if (!username) {
		return res.status(400).json({
			success: false,
			message: "Username is required.",
			error: "Missing username in the request body.",
		});
	}

	if (!email) {
		return res.status(400).json({
			success: false,
			message: "Email is required.",
			error: "Missing email in the request body.",
		});
	}

	if (!name) {
		return res.status(400).json({
			success: false,
			message: "Name is required.",
			error: "Missing name in the request body.",
		});
	}

	if (!password) {
		return res.status(400).json({
			success: false,
			message: "Password is required.",
			error: "Missing password in the request body.",
		});
	}
	//test email
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return res.status(400).json({
			success: false,
			message: "Invalid email format.",
			error: "The email does not match the expected format.",
		});
	}
	//test password
	if (password.length < 8) {
		return res.status(400).json({
			success: false,
			message: "Password must be at least 8 characters long.",
			error: "Password too short.",
		});
	}
	if (/[A-Z]/.test(password)) {
		return res.status(400).json({
			success: false,
			message: "Password must include at least 1 uppercase character.",
			error: "Password not included uppercase.",
		});
	}
	if (/[a-z]/.test(password)) {
		return res.status(400).json({
			success: false,
			message: "Password must include at least 1 lowercase character.",
			error: "Password not included lowercase.",
		});
	}
	if (/[0-9]/.test(password)) {
		return res.status(400).json({
			success: false,
			message: "Password must include at least 1 numeric character.",
			error: "Password not included numeric.",
		});
	}
	if (/[!@#$%^&*]/.test(password)) {
		return res.status(400).json({
			success: false,
			message: "Password must include at least 1 special character.",
			error: "Password not included special character.",
		});
	}

	// Check existing user
	const existingUser = users.find(
		(u) => u.email === email || u.username === username
	);

	if (existingUser) {
		return res.status(409).json({
			success: false,
			message: "Email or username already exists.",
			error: "Duplicate email or username.",
		});
	}

	//hashing password
	let hashedPassword;
	try {
		hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: "Error during password hashing.",
			error: err.message,
		});
	}

	// adding new user to database
	//dummy model
	const newUser = {
		id: users.length + 1,
		username,
		email,
		name,
		password: hashedPassword,
		role: "user",
	};
	users.push(newUser);

	// JWT
	const payload = {
		userId: newUser.id,
		email: newUser.email,
		role: newUser.role,
	};

	let token;
	try {
		token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRATION,
		});
	} catch (err) {
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
		.status(201)
		.json({
			success: true,
			message: "User registered successfully.",
			body: {
				user: {
					id: newUser.id,
					username: newUser.username,
					email: newUser.email,
					name: newUser.name,
					role: newUser.role,
				},
				token,
			},
		});
};
const authentication = { login, register };
export default authentication;
