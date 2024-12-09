import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import Snackbar from "../../Components/Snackbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/authContext";

const styles = {
	container: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		minHeight: "100vh",
		backgroundColor: "#f3f2ef",
		fontFamily:
			'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
	},
	loginContainer: {
		width: "100%",
		maxWidth: "400px",
		padding: "24px",
		backgroundColor: "#ffffff",
		borderRadius: "8px",
		boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
	},
	title: {
		fontSize: "32px",
		fontWeight: "600",
		color: "rgba(0, 0, 0, 0.9)",
		marginBottom: "12px",
	},
	subtitle: {
		fontSize: "14px",
		color: "rgba(0, 0, 0, 0.6)",
		marginBottom: "24px",
	},
	inputGroup: {
		position: "relative",
		marginBottom: "16px",
	},
	input: {
		width: "100%",
		padding: "16px 12px",
		border: "1px solid rgba(0, 0, 0, 0.6)",
		borderRadius: "4px",
		fontSize: "16px",
		outline: "none",
		transition: "border-color 0.3s ease",
		height: "56px",
	},
	inputFocused: {
		borderColor: "#0a66c2",
	},

	label: {
		position: "absolute",
		top: "16px",
		left: "12px",
		fontSize: "16px",
		color: "rgba(0, 0, 0, 0.6)",
		pointerEvents: "none",
		transition: "all 0.3s ease",
		backgroundColor: "#ffffff",
		padding: "0 4px",
	},

	labelFocused: {
		top: "-8px",
		fontSize: "12px",
		color: "#0a66c2",
	},

	passwordToggle: {
		position: "absolute",
		right: "12px",
		top: "50%",
		transform: "translateY(-50%)",
		cursor: "pointer",
		color: "#666",
		zIndex: 1,
	},
	button: {
		width: "100%",
		padding: "12px",
		backgroundColor: "#0a66c2",
		color: "#ffffff",
		fontSize: "16px",
		fontWeight: "600",
		border: "none",
		borderRadius: "24px",
		cursor: "pointer",
		transition: "background-color 0.3s ease",
	},
	buttonHover: {
		backgroundColor: "#004182",
	},
	signupPrompt: {
		marginTop: "24px",
		textAlign: "center",
		fontSize: "14px",
		color: "rgba(0, 0, 0, 0.9)",
	},
	link: {
		color: "#0a66c2",
		fontWeight: "600",
		textDecoration: "none",
	},
};

const LoginPage = () => {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [inputFocus, setInputFocus] = useState({
		email: false,
		password: false,
	});
	const [snackbarMessage, setSnackbarMessage] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formData.email || !formData.password) {
			alert("Email and password cannot be empty.");
			return;
		}

		try {
			const response = await fetch("http://localhost:4001/api/auth/login", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const data = await response.json();
			console.log(data);
			if (data.success) {
				login();
				setSnackbarMessage({
					text: data.message || "Login successful",
					type: "success",
				});
				const timeoutId = setTimeout(() => {
					navigate("/home");
				}, 3000);
				return () => clearTimeout(timeoutId);
			} else {
				setSnackbarMessage({
					text: data.message,
					type: "error",
					errors: [data.errors] || [],
				});
			}
		} catch (error) {
			setSnackbarMessage({
				text: "Network error occurred",
				type: "error",
			});
		}
	};

	const handleInputChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<div style={styles.container}>
			<div style={styles.loginContainer}>
				<form onSubmit={handleSubmit}>
					<h2 style={styles.title}>Sign in</h2>
					<p style={styles.subtitle}>Stay updated on your professional world</p>

					<div style={styles.inputGroup}>
						<input
							type="email"
							id="email"
							name="email"
							style={{
								...styles.input,
								...(inputFocus.email || formData.email
									? styles.inputFocused
									: {}),
							}}
							value={formData.email}
							onChange={handleInputChange}
							onFocus={() => setInputFocus({ ...inputFocus, email: true })}
							onBlur={() => setInputFocus({ ...inputFocus, email: false })}
							required
						/>
						<label
							htmlFor="email"
							style={{
								...styles.label,
								...(inputFocus.email || formData.email
									? styles.labelFocused
									: {}),
							}}
						>
							Email
						</label>
					</div>

					<div style={styles.inputGroup}>
						<input
							type={showPassword ? "text" : "password"}
							id="password"
							name="password"
							style={{
								...styles.input,
								...(inputFocus.password || formData.password
									? styles.inputFocused
									: {}),
							}}
							value={formData.password}
							onChange={handleInputChange}
							onFocus={() => setInputFocus({ ...inputFocus, password: true })}
							onBlur={() => setInputFocus({ ...inputFocus, password: false })}
							required
						/>
						<label
							htmlFor="password"
							style={{
								...styles.label,
								...(inputFocus.password || formData.password
									? styles.labelFocused
									: {}),
							}}
						>
							Password
						</label>
						<span
							style={styles.passwordToggle}
							onClick={() => setShowPassword(!showPassword)}
						>
							<FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
						</span>
					</div>

					<button
						type="submit"
						style={styles.button}
						onMouseOver={(e) =>
							(e.currentTarget.style.backgroundColor =
								styles.buttonHover.backgroundColor)
						}
						onMouseOut={(e) =>
							(e.currentTarget.style.backgroundColor =
								styles.button.backgroundColor)
						}
					>
						Sign in
					</button>
				</form>

				<div style={styles.signupPrompt}>
					New to this app?{" "}
					<a href="http://localhost:3000/register" style={styles.link}>
						Join now
					</a>
				</div>
			</div>
			{snackbarMessage && (
				<Snackbar
					message={snackbarMessage.text}
					type={snackbarMessage.type}
					errors={snackbarMessage.errors}
					onClose={() => setSnackbarMessage(null)}
				/>
			)}
		</div>
	);
};

export default LoginPage;
