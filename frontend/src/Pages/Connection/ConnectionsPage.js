import React, { useState, useEffect } from "react";
import Snackbar from "../../Components/Snackbar";
import { Search, MessageSquare, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ConnectionsPage = () => {
	const [connections, setConnections] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [showActions, setShowActions] = useState(null);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarVisible, setSnackbarVisible] = useState(false);
	const navigate = useNavigate();

	const styles = {
		container: {
			maxWidth: "1128px",
			margin: "0 auto",
			padding: "24px 16px",
			backgroundColor: "#f3f2ef",
			minHeight: "100vh",
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
			padding: "16px",
			position: "relative",
			boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
			transition: "box-shadow 0.3s",
			"&:hover": {
				boxShadow: "0 0 0 1px rgba(0,0,0,0.15)",
			},
		},
		profileSection: {
			display: "flex",
			alignItems: "center",
			marginBottom: "12px",
		},
		avatar: {
			width: "72px",
			height: "72px",
			borderRadius: "50%",
			marginRight: "12px",
			objectFit: "cover",
		},
		info: {
			flex: 1,
		},
		name: {
			fontSize: "16px",
			fontWeight: "600",
			color: "rgba(0,0,0,0.9)",
			marginBottom: "4px",
			"&:hover": {
				color: "#0a66c2",
				textDecoration: "underline",
			},
		},
		username: {
			fontSize: "14px",
			color: "rgba(0,0,0,0.6)",
			marginBottom: "4px",
		},
		date: {
			fontSize: "12px",
			color: "rgba(0,0,0,0.6)",
		},
		actions: {
			display: "flex",
			gap: "8px",
			marginTop: "16px",
		},
		button: {
			padding: "6px 16px",
			borderRadius: "16px",
			fontSize: "14px",
			fontWeight: "600",
			cursor: "pointer",
			transition: "background-color 0.3s",
		},
		messageButton: {
			backgroundColor: "transparent",
			border: "1px solid #0a66c2",
			color: "#0a66c2",
			"&:hover": {
				backgroundColor: "rgba(112,181,249,0.2)",
				boxShadow: "inset 0 0 0 2px #0a66c2",
			},
		},
		menuButton: {
			position: "absolute",
			top: "16px",
			right: "16px",
			padding: "4px",
			borderRadius: "50%",
			border: "none",
			backgroundColor: "transparent",
			cursor: "pointer",
			"&:hover": {
				backgroundColor: "rgba(0,0,0,0.08)",
			},
		},
		dropdownMenu: {
			position: "absolute",
			top: "40px",
			right: "16px",
			backgroundColor: "white",
			borderRadius: "4px",
			boxShadow: "0 0 0 1px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.2)",
			zIndex: 1,
		},
		menuItem: {
			padding: "8px 16px",
			fontSize: "14px",
			color: "rgba(0,0,0,0.6)",
			cursor: "pointer",
			transition: "background-color 0.2s",
			"&:hover": {
				backgroundColor: "rgba(0,0,0,0.08)",
				color: "rgba(0,0,0,0.9)",
			},
		},
	};

	useEffect(() => {
		const fetchConnections = async () => {
			try {
				const response = await fetch(
					"http://localhost:4001/api/connections/user",
					{
						credentials: "include",
					}
				);
				const data = await response.json();
				console.log(data.data);
				setConnections(data.data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchConnections();
	}, []);

	const filteredConnections = connections.filter((connection) =>
		connection?.username.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const removeConnection = async (id) => {
		const confirmed = window.confirm(
			"Are you sure you want to remove this connection?"
		);
		if (!confirmed) {
			return;
		}

		try {
			const response = await fetch(
				`http://localhost:4001/api/connections/${id}`,
				{
					method: "DELETE",
					credentials: "include",
				}
			);

			if (!response.status == 200) {
				throw new Error("Failed to remove connection");
			}

			setConnections(connections.filter((connection) => connection.id !== id));
			setSnackbarMessage({
				text: "Connection removed successfully",
				type: "success",
			});
			setSnackbarVisible(true);
		} catch (err) {
			console.error(err);
			setSnackbarMessage({
				text: "Failed to remove connection",
				type: "error",
			});
			setSnackbarVisible(true);
		}
	};

	const openMessage = async (id) => {
		navigate(`/chat/${id}`);
	};

	const openUserProfile = (username) => {
		navigate(`/profile/${username}`);
	};
	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div style={styles.container}>
			<div style={styles.header}>
				<h1 style={styles.title}>
					{connections.length} Connection{connections.length !== 1 && "s"}
				</h1>
				<div style={styles.searchBar}>
					<Search style={styles.searchIcon} size={20} />
					<input
						type="text"
						placeholder="Search by name..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						style={styles.searchInput}
					/>
				</div>
			</div>

			<div style={styles.grid}>
				{filteredConnections.map((connection) => (
					<div key={connection.id} style={styles.card}>
						<div style={styles.profileSection}>
							<img
								src={`http://localhost:4001/${connection.profile_photo_path}`}
								alt={connection.username}
								style={styles.avatar}
							/>
							<div style={styles.info}>
								<h2 style={styles.name}>{connection.full_name}</h2>
								<p style={styles.username}>@{connection.username}</p>
								<p style={styles.date}>
									Connected{" "}
									{new Date(connection.created_at).toLocaleDateString()}
								</p>
							</div>
						</div>

						<div style={styles.actions}>
							<button
								style={{ ...styles.button, ...styles.messageButton }}
								onClick={() => openMessage(connection.id)}
							>
								<MessageSquare size={16} style={{ marginRight: "4px" }} />
								Message
							</button>
						</div>

						<button
							style={styles.menuButton}
							onClick={() =>
								setShowActions(
									showActions === connection.id ? null : connection.id
								)
							}
						>
							<MoreVertical size={20} />
						</button>

						{showActions === connection.id && (
							<div style={styles.dropdownMenu}>
								<div
									style={styles.menuItem}
									onClick={() => openUserProfile(connection.username)}
								>
									View Profile
								</div>
								<div
									style={styles.menuItem}
									onClick={() => removeConnection(connection.id)}
								>
									Remove Connection
								</div>
							</div>
						)}
					</div>
				))}
			</div>
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

export default ConnectionsPage;
