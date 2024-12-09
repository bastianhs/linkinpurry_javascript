import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Snackbar from "../../Components/Snackbar";
import { useAuth } from "../../Context/authContext";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		username: "",
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");

	const validatePassword = (password) => {
		const requirements = {
			length: password.length >= 8,
			uppercase: /[A-Z]/.test(password),
			lowercase: /[a-z]/.test(password),
			number: /[0-9]/.test(password),
			special: /[!@#$%^&*]/.test(password),
		};
		return requirements;
	};

	const validateEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formData.name) {
			setSnackbarMessage({
				text: "Please enter your name",
				type: "error",
			});
			return;
		}
		if (!validateEmail(formData.email)) {
			setSnackbarMessage({
				text: "Please enter a valid email address",
				type: "error",
			});
			return;
		}
		if (!Object.values(validatePassword(formData.password)).every(Boolean)) {
			setSnackbarMessage({
				text: "Please ensure your password meets all requirements",
				type: "error",
			});

			return;
		}
		if (formData.password !== formData.confirmPassword) {
			setSnackbarMessage({
				text: "Passwords do not match",
				type: "error",
			});

			return;
		}

		try {
			const response = await fetch("http://localhost:4001/api/auth/register", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: formData.username,
					email: formData.email,
					name: formData.name,
					password: formData.password,
				}),
			});

			const data = await response.json();

			if (data.success) {
				login();
				setSnackbarMessage({
					text: data.message || "Registration successful",
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
				errors: [error.message],
			});
		}
	};

	const passwordRequirements = validatePassword(formData.password);

	const styles = {
		container: {
			minHeight: "100vh",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			background: "linear-gradient(to bottom right, #f3f4f6, #e0f2fe)",
			padding: "1rem",
		},
		formCard: {
			backgroundColor: "white",
			borderRadius: "1rem",
			boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
			width: "100%",
			maxWidth: "32rem",
		},
		header: {
			background: "#2563eb",
			color: "white",
			padding: "2rem",
			textAlign: "center",
			borderTopLeftRadius: "1rem",
			borderTopRightRadius: "1rem",
		},
		form: {
			padding: "2rem",
		},
		formGroup: {
			marginBottom: "1.5rem",
		},
		label: {
			display: "block",
			marginBottom: "0.5rem",
			fontWeight: "500",
			color: "#374151",
		},
		input: {
			width: "100%",
			padding: "0.75rem 1rem",
			borderRadius: "0.5rem",
			border: "1px solid #d1d5db",
			outline: "none",
		},
		inputContainer: {
			position: "relative",
		},
		eyeButton: {
			position: "absolute",
			right: "0.75rem",
			top: "50%",
			transform: "translateY(-50%)",
			background: "none",
			border: "none",
			cursor: "pointer",
			color: "#6b7280",
		},
		requirementsList: {
			backgroundColor: "#f9fafb",
			padding: "1rem",
			borderRadius: "0.5rem",
			marginTop: "0.75rem",
		},
		requirement: {
			display: "flex",
			alignItems: "center",
			gap: "0.5rem",
			marginBottom: "0.25rem",
			fontSize: "0.875rem",
		},
		submitButton: {
			width: "100%",
			padding: "0.75rem 1rem",
			backgroundColor: "#2563eb",
			color: "white",
			border: "none",
			borderRadius: "0.5rem",
			fontWeight: "500",
			cursor: "pointer",
		},
		footer: {
			textAlign: "center",
			padding: "1.5rem",
			borderTop: "1px solid #e5e7eb",
		},
		link: {
			color: "#2563eb",
			textDecoration: "none",
			fontWeight: "500",
		},
	};

	return (
		<div style={styles.container}>
			<div style={styles.formCard}>
				<div style={styles.header}>
					<h1
						style={{
							fontSize: "1.5rem",
							fontWeight: "bold",
							marginBottom: "0.5rem",
						}}
					>
						Create your account
					</h1>
					<p style={{ opacity: 0.9 }}>Join the professional community</p>
				</div>

				<form onSubmit={handleSubmit} style={styles.form}>
					<div style={styles.formGroup}>
						<label htmlFor="name" style={styles.label}>
							Full Name
						</label>
						<input
							type="text"
							id="name"
							name="name"
							value={formData.name}
							onChange={handleInputChange}
							style={styles.input}
							required
						/>
					</div>
					<div style={styles.formGroup}>
						<label htmlFor="name" style={styles.label}>
							Username
						</label>
						<input
							type="text"
							id="username"
							name="username"
							value={formData.username}
							onChange={handleInputChange}
							style={styles.input}
							required
						/>
					</div>

					<div style={styles.formGroup}>
						<label htmlFor="email" style={styles.label}>
							Email
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleInputChange}
							style={styles.input}
							required
						/>
					</div>

					<div style={styles.formGroup}>
						<label htmlFor="password" style={styles.label}>
							Password
						</label>
						<div style={styles.inputContainer}>
							<input
								type={showPassword ? "text" : "password"}
								id="password"
								name="password"
								value={formData.password}
								onChange={handleInputChange}
								style={styles.input}
								required
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								style={styles.eyeButton}
							>
								{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
							</button>
						</div>
						<div style={styles.requirementsList}>
							<p
								style={{
									marginBottom: "0.5rem",
									color: "#4b5563",
									fontSize: "0.875rem",
								}}
							>
								Password must contain:
							</p>
							{Object.entries(passwordRequirements).map(
								([requirement, isValid]) => (
									<div
										key={requirement}
										style={{
											...styles.requirement,
											color: isValid ? "#059669" : "#4b5563",
										}}
									>
										<span>{isValid ? "✓" : "×"}</span>
										<span>
											{requirement === "length"
												? "8+ characters"
												: requirement === "uppercase"
												? "One uppercase letter"
												: requirement === "lowercase"
												? "One lowercase letter"
												: requirement === "number"
												? "One number"
												: "One special character"}
										</span>
									</div>
								)
							)}
						</div>
					</div>

					<div style={styles.formGroup}>
						<label htmlFor="confirmPassword" style={styles.label}>
							Confirm Password
						</label>
						<div style={styles.inputContainer}>
							<input
								type={showConfirmPassword ? "text" : "password"}
								id="confirmPassword"
								name="confirmPassword"
								value={formData.confirmPassword}
								onChange={handleInputChange}
								style={styles.input}
								required
							/>
							<button
								type="button"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								style={styles.eyeButton}
							>
								{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
							</button>
						</div>
					</div>

					<button type="submit" style={styles.submitButton}>
						Complete Registration
					</button>
				</form>

				<div style={styles.footer}>
					Already have an account?{" "}
					<a href="http://localhost:3000/login" style={styles.link}>
						Sign in
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

export default RegisterForm;
