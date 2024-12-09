import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faUser,
	faEnvelope,
	faCalendar,
	faClock,
	faPen,
	faEye,
	faEyeSlash,
	faUsers,
	faBriefcase,
	faTools,
	faCamera,
	faTrash,
	faMapMarkerAlt,
	faPlus,
} from "@fortawesome/free-solid-svg-icons";
import api from "../../Utils/api";
import Snackbar from "../../Components/Snackbar";

const UserProfile = () => {
	const styles = {
		container: {
			backgroundColor: "#f3f2ef",
			minHeight: "100vh",
			paddingBottom: "48px",
		},
		bannerContainer: {
			position: "relative",
			backgroundColor: "white",
			marginBottom: "24px",
			boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
		},
		banner: {
			height: "200px",
			backgroundColor: "#a0b4b7",
			borderTopLeftRadius: "8px",
			borderTopRightRadius: "8px",
		},
		contentWrapper: {
			maxWidth: "1128px",
			margin: "0 auto",
			padding: "0 24px",
		},
		profileHeader: {
			position: "relative",
			paddingBottom: "24px",
		},
		avatarContainer: {
			position: "absolute",
			top: "-90px",
			left: "24px",
			width: "160px",
			height: "160px",
			border: "4px solid white",
			borderRadius: "50%",
			backgroundColor: "#fff",
			boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
		},
		avatar: {
			width: "100%",
			height: "100%",
			borderRadius: "50%",
			objectFit: "cover",
		},
		cameraButton: {
			position: "absolute",
			bottom: "8px",
			right: "8px",
			backgroundColor: "white",
			border: "1px solid rgba(0,0,0,0.6)",
			borderRadius: "50%",
			padding: "8px",
			cursor: "pointer",
			transition: "all 0.2s",
			"&:hover": {
				backgroundColor: "rgba(0,0,0,0.08)",
			},
		},
		headerContent: {
			marginLeft: "200px",
			paddingTop: "24px",
		},
		name: {
			fontSize: "24px",
			fontWeight: "600",
			color: "rgba(0,0,0,0.9)",
			marginBottom: "4px",
		},
		headline: {
			fontSize: "16px",
			color: "rgba(0,0,0,0.9)",
			marginBottom: "8px",
		},
		location: {
			fontSize: "14px",
			color: "rgba(0,0,0,0.6)",
			display: "flex",
			alignItems: "center",
			gap: "4px",
			marginBottom: "16px",
		},
		connectionInfo: {
			fontSize: "14px",
			color: "#0a66c2",
			fontWeight: "600",
			cursor: "pointer",
			"&:hover": {
				textDecoration: "underline",
			},
		},
		editButton: {
			position: "absolute",
			top: "24px",
			right: "24px",
			padding: "6px 12px",
			backgroundColor: "transparent",
			border: "1px solid rgba(0,0,0,0.6)",
			borderRadius: "16px",
			display: "flex",
			alignItems: "center",
			gap: "8px",
			cursor: "pointer",
			transition: "all 0.2s",
			"&:hover": {
				backgroundColor: "rgba(0,0,0,0.08)",
				border: "2px solid rgba(0,0,0,0.6)",
			},
		},
		section: {
			backgroundColor: "white",
			borderRadius: "8px",
			padding: "24px",
			marginBottom: "8px",
			boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
		},
		sectionHeader: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: "16px",
		},
		sectionTitle: {
			fontSize: "20px",
			fontWeight: "600",
			color: "rgba(0,0,0,0.9)",
		},
	};

	const [userData, setUserData] = useState(null);
	const [showEditForm, setShowEditForm] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState(null);
	const [snackbarVisible, setSnackbarVisible] = useState(false);
	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await api.get("/profile/me", {
					credentials: "include",
				});
        // console.log(data)
				const data = response.data.body;
				setUserData(data);
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		};

		fetchUserData();
	}, []);
	const EditProfileForm = ({ onCancel }) => {
		const [showPassword, setShowPassword] = useState(false);
		const [profilePhoto, setProfilePhoto] = useState(
			userData.profile_photo || null
		);
		const fileInputRef = useRef(null);

		const [formData, setFormData] = useState({
			name: userData.name || "",
			email: userData.email || "",
			username: userData.username || "",
			password: "",
			work_history: userData.work_history || "",
			skills: userData.skills || "",
			profile_photo: null,
		});

		const handleInputChange = (e) => {
			const { name, value } = e.target;
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}));
		};

		const handlePhotoUpload = async (e) => {
			const file = e.target.files[0];
			if (file) {
				// File size validation (5MB)
				if (file.size > 5 * 1024 * 1024) {
					setSnackbarMessage({
						text: "File size must be less than 5MB",
						type: "error",
					});
					setSnackbarVisible(true);
					return;
				}

				// File type validation
				const validTypes = ["image/jpeg", "image/png", "image/webp"];
				if (!validTypes.includes(file.type)) {
					setSnackbarMessage({
						text: "Please upload JPEG, PNG or WEBP images only",
						type: "error",
					});
					setSnackbarVisible(true);
					return;
				}

				const reader = new FileReader();
				reader.onloadend = () => {
					setProfilePhoto(reader.result);
					setFormData((prev) => ({
						...prev,
						profile_photo: file,
					}));
					setSnackbarMessage({
						text: "Photo selected successfully",
						type: "success",
					});
					setSnackbarVisible(true);
				};
				reader.readAsDataURL(file);
			}
		};
		const handleRemovePhoto = () => {
			setProfilePhoto(null);
			setFormData((prev) => ({
				...prev,
				profile_photo: null,
			}));
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		};

		const handleSubmit = async (e) => {
			e.preventDefault();

			try {
				const textData = {
					username: formData.username,
					email: formData.email,
					full_name: formData.name,
					work_history: formData.work_history,
					skills: formData.skills,
					...(formData.password && { password: formData.password }),
				};


				const response = await api.put("/users/update", textData, {
					headers: {
						"Content-Type": "application/json",
					},
				});
				if (formData.profile_photo) {
					const photoData = new FormData();
					photoData.append("profile_photo", formData.profile_photo);

					await api.put("/users/update-photo", photoData, {
						headers: {
							"Content-Type": "multipart/form-data",
						},
					});
				}

				setSnackbarMessage({
					text: "Profile updated successfully",
					type: "success",
				});
				setSnackbarVisible(true);

				// Refresh user data
				const updatedProfile = await api.get("/profile/me");
				setUserData(updatedProfile.data.body);

				setTimeout(() => {
					onCancel();
				}, 5000);
			} catch (error) {
				setSnackbarMessage({
					text: error.response?.data?.error || "Error updating profile",
					type: "error",
					errors: error.response?.data?.errors || [],
				});
				setSnackbarVisible(true);
			}
		};
		return (
			<div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
					<form onSubmit={handleSubmit} className="p-8">
						<div className="text-center mb-8">
							<h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
							<p className="mt-2 text-sm text-gray-600">
								Update your personal information
							</p>
						</div>

						<div className="space-y-6">
							<div className="flex flex-col items-center mb-6">
								<div className="relative mb-4">
									{profilePhoto ? (
										<img
											src={profilePhoto}
											alt="Profile"
											className="w-32 h-32 rounded-full object-cover shadow-md"
										/>
									) : (
										<div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
											<FontAwesomeIcon
												icon={faUser}
												className="h-16 w-16 text-gray-500"
											/>
										</div>
									)}

									<div className="absolute bottom-0 right-0 flex space-x-2">
										<button
											type="button"
											onClick={() => fileInputRef.current.click()}
											className="bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600"
											title="Upload Photo"
										>
											<FontAwesomeIcon icon={faCamera} className="h-4 w-4" />
										</button>
										{profilePhoto && (
											<button
												type="button"
												onClick={handleRemovePhoto}
												className="bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600"
												title="Remove Photo"
											>
												<FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
											</button>
										)}
									</div>
								</div>

								<input
									type="file"
									ref={fileInputRef}
									onChange={handlePhotoUpload}
									accept="image/*"
									className="hidden"
								/>
								<p className="text-sm text-gray-600">
									Click camera icon to upload new photo
								</p>
							</div>
							<div className="bg-gray-50 p-6 rounded-lg">
								<h2 className="text-lg font-semibold mb-4 border-b pb-2">
									Personal Details
								</h2>
								<div className="grid grid-cols-2 gap-4">
									<TextInput
										id="name"
										label="Full Name"
										type="text"
										placeholder="Enter your full name"
										value={formData.name}
										onChange={handleInputChange}
									/>
									<TextInput
										id="username"
										label="Username"
										type="text"
										placeholder="Enter your username"
										value={formData.username}
										onChange={handleInputChange}
									/>
									<TextInput
										id="email"
										label="Email"
										type="email"
										placeholder="Enter your email"
										value={formData.email}
										onChange={handleInputChange}
									/>
									<PasswordInput
										id="password"
										label="New Password"
										showPassword={showPassword}
										setShowPassword={setShowPassword}
										value={formData.password}
										onChange={handleInputChange}
									/>
								</div>
							</div>

							<div className="bg-gray-50 p-6 rounded-lg">
								<h2 className="text-lg font-semibold mb-4 border-b pb-2">
									Professional Details
								</h2>
								<div className="space-y-4">
									<div>
										<label
											htmlFor="work_history"
											className="block text-sm font-medium text-gray-700 mb-2"
										>
											Work History
										</label>
										<textarea
											id="work_history"
											name="work_history"
											rows="4"
											className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
											placeholder="Describe your work experience"
											value={formData.work_history}
											onChange={handleInputChange}
										/>
									</div>

									<div>
										<label
											htmlFor="skills"
											className="block text-sm font-medium text-gray-700 mb-2"
										>
											Skills
										</label>
										<textarea
											id="skills"
											name="skills"
											rows="4"
											className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
											placeholder="List your skills (comma-separated)"
											value={formData.skills}
											onChange={handleInputChange}
										/>
									</div>
								</div>
							</div>

							<div className="flex justify-end space-x-4 pt-4">
								<button
									type="button"
									onClick={onCancel}
									className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
								>
									Save Changes
								</button>
							</div>
						</div>
					</form>
				</div>
				{snackbarVisible && (
					<Snackbar
						message={snackbarMessage.text}
						type={snackbarMessage.type}
						errors={snackbarMessage.errors || []}
						onClose={() => setSnackbarVisible(false)}
					/>
				)}
			</div>
		);
	};

	if (showEditForm) {
		return <EditProfileForm onCancel={() => setShowEditForm(false)} />;
	}

	return (
		<div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-3xl mx-auto">
				<div className="bg-white rounded-lg shadow-md overflow-hidden">
					<div className="p-6">
						<h2 className="text-2xl font-bold text-center mb-6">
							Profile Information
						</h2>
						{userData ? (
							<div className="space-y-6">
								<div className="flex items-start space-x-6">
									<div className="w-1/3">
										{userData.profile_photo ? (
											<img
												src={userData.profile_photo}
												alt="Profile"
												className="w-full rounded-lg shadow-md object-cover"
											/>
										) : (
											<div className="w-full aspect-square bg-gray-200 flex items-center justify-center rounded-lg">
												<FontAwesomeIcon
													icon={faUser}
													className="h-16 w-16 text-gray-500"
												/>
											</div>
										)}
									</div>
									<div className="w-2/3 space-y-4">
										<ProfileItem
											icon={faUser}
											label="Full Name"
											value={userData.name || userData.username}
										/>
										<ProfileItem
											icon={faEnvelope}
											label="Email"
											value={userData.email}
										/>
										<ProfileItem
											icon={faCalendar}
											label="Member Since"
											value={new Date(userData.created_at).toLocaleDateString()}
										/>
										<ProfileItem
											icon={faClock}
											label="Last Updated"
											value={new Date(userData.updated_at).toLocaleDateString()}
										/>
										<ProfileItem
											icon={faUsers}
											label="Connections"
											value={userData.connection_count}
										/>
									</div>
								</div>

								<div className="bg-gray-50 p-6 rounded-lg">
									<h3 className="text-xl font-semibold mb-4 border-b pb-2">
										Professional Details
									</h3>
									<div className="space-y-4">
										<ProfileItem
											icon={faBriefcase}
											label="Work History"
											value={userData.work_history || "No work history added"}
										/>
										<ProfileItem
											icon={faTools}
											label="Skills"
											value={userData.skills || "No skills listed"}
										/>
									</div>
								</div>

								<div className="mt-8 flex justify-center">
									<button
										onClick={() => setShowEditForm(true)}
										className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
									>
										<FontAwesomeIcon icon={faPen} className="h-5 w-5" />
										<span>Edit Profile</span>
									</button>
								</div>
							</div>
						) : (
							<LoadingSkeleton />
						)}
					</div>
				</div>
			</div>
      {snackbarVisible && (
          <Snackbar
            message={snackbarMessage.text}
            type={snackbarMessage.type}
            errors={snackbarMessage.errors || []}
            onClose={() => setSnackbarVisible(false)}
          />
        )}
		</div>
	);
};

const ProfileItem = ({ icon, label, value }) => (
	<div className="flex items-center space-x-3">
		<FontAwesomeIcon icon={icon} className="h-5 w-5 text-gray-500" />
		<div>
			<p className="text-sm font-medium text-gray-500">{label}</p>
			<p className="text-lg font-semibold text-gray-900">{value}</p>
		</div>
	</div>
);

const LoadingSkeleton = () => (
	<div className="text-center py-8">
		<div className="animate-pulse space-y-4">
			<div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
			<div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
			<div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
		</div>
	</div>
);

const TextInput = ({ id, label, type, placeholder, value, onChange }) => (
	<div>
		<label htmlFor={id} className="block text-sm font-medium text-gray-700">
			{label}
		</label>
		<input
			type={type}
			id={id}
			name={id}
			value={value || ""}
			onChange={onChange}
			className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
			placeholder={placeholder}
		/>
	</div>
);

const PasswordInput = ({
	id,
	label,
	showPassword,
	setShowPassword,
	value,
	onChange,
}) => (
	<div>
		<label htmlFor={id} className="block text-sm font-medium text-gray-700">
			{label}
		</label>
		<div className="relative">
			<input
				type={showPassword ? "text" : "password"}
				id={id}
				name={id}
				value={value || ""}
				onChange={onChange}
				className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				placeholder="Enter new password"
			/>
			<button
				type="button"
				className="absolute inset-y-0 right-0 pr-3 flex items-center"
				onClick={() => setShowPassword(!showPassword)}
			>
				<FontAwesomeIcon
					icon={showPassword ? faEyeSlash : faEye}
					className="h-5 w-5 text-gray-400"
				/>
			</button>
		</div>
	</div>
);

export default UserProfile;
