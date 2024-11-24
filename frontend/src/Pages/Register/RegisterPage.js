document.addEventListener("DOMContentLoaded", function () {
	const form = document.getElementById("registerForm");
	const steps = document.querySelectorAll(".form-step");
	const progressSteps = document.querySelectorAll(".progress-step");
	const roleCards = document.querySelectorAll(".role-card");
	const passwordInput = document.getElementById("password");
	const confirmPasswordInput = document.getElementById("confirm-password");
	const togglePasswordBtns = document.querySelectorAll(".toggle-password");
	const roleInput = document.getElementById("role");

	let currentStep = 1;

	roleCards.forEach((card) => {
		card.addEventListener("click", () => {
			roleCards.forEach((c) => c.classList.remove("selected"));
			card.classList.add("selected");
			roleInput.value = card.dataset.role;
		});
	});
	togglePasswordBtns.forEach((btn) => {
		btn.addEventListener("click", function () {
			const input = this.previousElementSibling;
			if (input.type === "password") {
				input.type = "text";
				this.classList.remove("fa-eye-slash");
				this.classList.add("fa-eye");
			} else {
				input.type = "password";
				this.classList.remove("fa-eye");
				this.classList.add("fa-eye-slash");
			}
		});
	});
	function validatePassword(password) {
		const requirements = {
			length: password.length >= 8,
			uppercase: /[A-Z]/.test(password),
			lowercase: /[a-z]/.test(password),
			number: /[0-9]/.test(password),
			special: /[!@#$%^&*]/.test(password),
		};
		Object.keys(requirements).forEach((req) => {
			const element = document.getElementById(req);
			if (element) {
				if (requirements[req]) {
					element.classList.add("valid");
				} else {
					element.classList.remove("valid");
				}
			}
		});

		return Object.values(requirements).every(Boolean);
	}

	function validateEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	function validateStep(step) {
		switch (step) {
			case 1:
				if (!roleInput.value) {
					showError("Please select a role to continue");
					return false;
				}
				return true;
			case 2:
				const email = document.getElementById("email").value;
				const name = document.getElementById("name").value;
				const password = passwordInput.value;
				const confirmPassword = confirmPasswordInput.value;

				if (!name) {
					showError("Please enter your name");
					return false;
				}
				if (!validateEmail(email)) {
					showError("Please enter a valid email address");
					return false;
				}
				if (!validatePassword(password)) {
					showError("Please ensure your password meets all requirements");
					return false;
				}
				if (password !== confirmPassword) {
					showError("Passwords do not match");
					return false;
				}
				return true;
			case 3:
				if (roleInput.value === "Company") {
					const location = document.getElementById("companyloc").value;
					const about = document.getElementById("companyabout").value;
					if (!location || !about) {
						showError("Please fill in all company information");
						return false;
					}
				}
				return true;
			default:
				return true;
		}
	}

	function showError(message) {
		alert(message);
	}

	function goToStep(step) {
		if (validateStep(currentStep)) {
			steps.forEach((s) => s.classList.remove("active"));
			progressSteps.forEach((p) => {
				p.classList.remove("active");
				p.classList.remove("completed");
			});
			steps[step - 1].classList.add("active");
			for (let i = 0; i < step; i++) {
				progressSteps[i].classList.add("completed");
			}
			progressSteps[step - 1].classList.add("active");

			currentStep = step;
			if (step === 3 && roleInput.value !== "Company") {
				submitForm();
			}
		}
	}

	document.querySelectorAll(".btn-next").forEach((button) => {
		button.addEventListener("click", () => {
			goToStep(currentStep + 1);
		});
	});

	document.querySelectorAll(".btn-prev").forEach((button) => {
		button.addEventListener("click", () => {
			goToStep(currentStep - 1);
		});
	});
	function submitForm() {
		if (!validateStep(currentStep)) {
			return;
		}

		const formData = {
			email: document.getElementById("email").value,
			password: passwordInput.value,
			role: roleInput.value,
			nama: document.getElementById("name").value,
		};

		if (roleInput.value === "Company") {
			formData.location = document.getElementById("companyloc").value;
			formData.about = document.getElementById("companyabout").value;
		}

		const xhr = new XMLHttpRequest();
		const url =
			roleInput.value === "Company"
				? "http://localhost:8000/api/company-register"
				: "http://localhost:8000/api/register";

		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-Type", "application/json");

		xhr.onreadystatechange = function () {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				const response = JSON.parse(xhr.responseText);
				if (xhr.status === 201) {
					alert(response.message || "Registration successful!");
					window.location.href = "http://localhost:8000/login";
				} else {
					showError(response.error || "Registration failed. Please try again.");
				}
			}
		};

		xhr.onerror = function () {
			showError("Network error occurred. Please try again.");
		};

		try {
			xhr.send(JSON.stringify(formData));
		} catch (error) {
			showError("Error sending data. Please try again.");
		}
	}

	form.addEventListener("submit", function (event) {
		event.preventDefault();
		submitForm();
	});

	passwordInput.addEventListener("input", () => {
		validatePassword(passwordInput.value);
	});

	confirmPasswordInput.addEventListener("input", validateConfirmPassword);
	passwordInput.addEventListener("input", validateConfirmPassword);

	function validateConfirmPassword() {
		if (passwordInput.value !== confirmPasswordInput.value) {
			confirmPasswordInput.setCustomValidity("Passwords don't match");
		} else {
			confirmPasswordInput.setCustomValidity("");
		}
	}

	// Initialize first step
	goToStep(1);
});
