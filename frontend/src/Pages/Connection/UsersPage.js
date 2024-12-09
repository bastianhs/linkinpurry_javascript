import React, { useState, useEffect } from "react";
import { Search, UserPlus, MailPlus, X } from "lucide-react";
import api from "../../api";
import Snackbar from "../../Components/Snackbar";
import { UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UsersPage = () => {
	const [users, setUsers] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarVisible, setSnackbarVisible] = useState(false);
	const navigate = useNavigate();

	const styles = {
		container: {
			maxWidth: "1128px",
			margin: "0 auto",
			padding: "24px 16px",
			backgroundColor: "#f3f2ef",
			minHeight: "calc(100vh - 52px)",
		},
		header: {
			backgroundColor: "white",
			borderRadius: "8px",
			padding: "24px",
			marginBottom: "24px",
			boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
		},
		title: {
			fontSize: "20px",
			fontWeight: "600",
			color: "rgba(0,0,0,0.9)",
			marginBottom: "16px",
		},
		searchBar: {
			position: "relative",
			marginBottom: "16px",
		},
		searchIcon: {
			position: "absolute",
			left: "12px",
			top: "50%",
			transform: "translateY(-50%)",
			color: "rgba(0,0,0,0.6)",
		},
		searchInput: {
			width: "100%",
			padding: "12px 12px 12px 40px",
			border: "1px solid rgba(0,0,0,0.3)",
			borderRadius: "4px",
			fontSize: "14px",
			"&:focus": {
				outline: "none",
				borderColor: "#0a66c2",
			},
		},
		grid: {
			display: "grid",
			gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
			gap: "20px",
			"@media (max-width: 640px)": {
				gridTemplateColumns: "1fr",
			},
		},
		card: {
			backgroundColor: "white",
			borderRadius: "8px",
			padding: "24px",
			boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
			transition: "box-shadow 0.3s",
			"&:hover": {
				boxShadow: "0 0 0 1px rgba(0,0,0,0.15)",
			},
		},
		profileSection: {
			textAlign: "center",
			marginBottom: "16px",
		},
		avatarContainer: {
			width: "104px",
			height: "104px",
			margin: "0 auto 12px",
			position: "relative",
		},
		avatar: {
			width: "100%",
			height: "100%",
			borderRadius: "50%",
			objectFit: "cover",
			border: "2px solid #fff",
			boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
		},
		name: {
			fontSize: "16px",
			fontWeight: "600",
			color: "rgba(0,0,0,0.9)",
			marginBottom: "4px",
			"&:hover": {
				color: "#0a66c2",
				textDecoration: "underline",
				cursor: "pointer",
			},
		},
		username: {
			fontSize: "14px",
			color: "rgba(0,0,0,0.6)",
			marginBottom: "8px",
		},
		location: {
			fontSize: "14px",
			color: "rgba(0,0,0,0.6)",
			marginBottom: "16px",
		},
		actions: {
			display: "flex",
			gap: "8px",
			flexDirection: "column",
		},
		button: {
			padding: "6px 16px",
			borderRadius: "16px",
			fontSize: "14px",
			fontWeight: "600",
			cursor: "pointer",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			gap: "8px",
			transition: "all 0.2s",
		},
		primaryButton: {
			backgroundColor: "#0a66c2",
			color: "white",
			border: "none",
			"&:hover": {
				backgroundColor: "#004182",
			},
		},
		secondaryButton: {
			backgroundColor: "white",
			color: "rgba(0,0,0,0.6)",
			border: "1px solid rgba(0,0,0,0.6)",
			"&:hover": {
				border: "2px solid rgba(0,0,0,0.6)",
				backgroundColor: "rgba(0,0,0,0.08)",
			},
		},
		emptyState: {
			textAlign: "center",
			padding: "40px 20px",
			backgroundColor: "white",
			borderRadius: "8px",
			boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
		},
		emptyIcon: {
			marginBottom: "16px",
			color: "rgba(0,0,0,0.6)",
		},
		emptyText: {
			fontSize: "16px",
			color: "rgba(0,0,0,0.6)",
		},
	};

	const fetchUsers = async (search = "") => {
		setLoading(true);
		try {
			const response = await api.get("/users", { params: { search } });
			setUsers(response.data.data);
			setError(null);
		} catch (err) {
			setUsers([]);
			// setError("Failed to fetch users");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const handleSearch = (event) => {
		setSearchTerm(event.target.value);
		if (event.target.value === "") {
			fetchUsers();
		}
	};

	const handleSearchSubmit = (event) => {
		event.preventDefault();
		fetchUsers(searchTerm);
	};

	const handleConnect = async (userId) => {
		try {
			await api.post("/connection-requests", { toId: userId });
			setSnackbarMessage({
				text: "Connection request sent successfully",
				type: "success",
			});
			setSnackbarVisible(true);
		} catch (err) {
			setSnackbarMessage({
				text: "Failed to send connection request",
				type: "error",
			});
			setSnackbarVisible(true);
		}
	};

	if (loading) return <div style={styles.container}>Loading...</div>;
	if (error) return <div style={styles.container}>Error: {error}</div>;

	return (
		<div style={styles.container}>
			<div style={styles.header}>
				<h1 style={styles.title}>People you may know</h1>
				<form onSubmit={handleSearchSubmit}>
					<div style={styles.searchBar}>
						<Search style={styles.searchIcon} size={20} />
						<input
							type="text"
							placeholder="Search by name..."
							value={searchTerm}
							onChange={handleSearch}
							style={styles.searchInput}
						/>
					</div>
				</form>
			</div>

			{users.length === 0 ? (
				<div style={styles.emptyState}>
					<Search size={48} style={styles.emptyIcon} />
					<p style={styles.emptyText}>No users found</p>
				</div>
			) : (
				<div style={styles.grid}>
					{users.map((user) => (
						<div key={user.id} style={styles.card}>
							<div style={styles.profileSection}>
								<div style={styles.avatarContainer}>
									<img
										src={`http://localhost:4001/${user.profile_photo_path}`}
										alt={user.username}
										style={styles.avatar}
									/>
								</div>
								<h2 style={styles.name}>{user.username}</h2>
								<p style={styles.username}>@{user.username}</p>
							</div>

							<div style={styles.actions}>
								<button
									onClick={() => navigate(`/profile/${user.username}`)}
									style={{ ...styles.button, ...styles.primaryButton }}
								>
									<UserIcon size={16} />
									View Profile
								</button>
							</div>
						</div>
					))}
				</div>
			)}

			{snackbarVisible && (
				<Snackbar
					message={snackbarMessage.text}
					type={snackbarMessage.type}
					onClose={() => setSnackbarVisible(false)}
				/>
			)}
		</div>
	);
};

export default UsersPage;
