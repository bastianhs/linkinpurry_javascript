import React, { useState, useEffect } from "react";
import api from "../../api";
import Snackbar from "../../Components/Snackbar";
import { Check, X, UserPlus } from "lucide-react";

const ConnectionRequestsPage = () => {
	const [requests, setRequests] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarVisible, setSnackbarVisible] = useState(false);

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
			marginBottom: "4px",
		},
		subtitle: {
			fontSize: "14px",
			color: "rgba(0,0,0,0.6)",
		},
		grid: {
			display: "grid",
			gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
			gap: "20px",
			"@media (max-width: 640px)": {
				gridTemplateColumns: "1fr",
			},
		},
		card: {
			backgroundColor: "white",
			borderRadius: "8px",
			padding: "16px",
			boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
			transition: "box-shadow 0.3s",
			"&:hover": {
				boxShadow: "0 0 0 1px rgba(0,0,0,0.15)",
			},
		},
		profileSection: {
			display: "flex",
			alignItems: "center",
			marginBottom: "16px",
		},
		avatar: {
			width: "56px",
			height: "56px",
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
				cursor: "pointer",
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
			flex: 1,
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
		acceptButton: {
			backgroundColor: "#0a66c2",
			color: "white",
			border: "none",
			"&:hover": {
				backgroundColor: "#004182",
			},
		},
		ignoreButton: {
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

	useEffect(() => {
		const fetchRequests = async () => {
			try {
				const response = await fetch(
					"http://localhost:4001/api/connection-requests",
					{
						credentials: "include",
					}
				);
				const data = await response.json();
				console.log(data);
				if (data.errors) {
					setRequests([]);
				} else {
					setRequests(data.data);
				}
			} catch (err) {
				setRequests([]);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		fetchRequests();
	}, []);

	const handleAccept = async (fromId) => {
		try {
			await api.put("/connection-requests", {
				fromId,
				action: "accept",
			});
			setRequests((prev) => prev.filter((req) => req.from.id !== fromId));
			setSnackbarMessage({
				text: "Connection request accepted",
				type: "success",
			});
			setSnackbarVisible(true);
		} catch (err) {
			setSnackbarMessage({
				text: "Failed to accept request",
				type: "error",
			});
			setSnackbarVisible(true);
		}
	};

	const handleIgnore = async (fromId) => {
		try {
			await api.put("/connection-requests", {
				fromId,
				action: "decline",
			});
			setRequests((prev) => prev.filter((req) => req.from.id !== fromId));
			setSnackbarMessage({
				text: "Connection request ignored",
				type: "success",
			});
			setSnackbarVisible(true);
		} catch (err) {
			setSnackbarMessage({
				text: "Failed to ignore request",
				type: "error",
			});
			setSnackbarVisible(true);
		}
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div style={styles.container}>
			<div style={styles.header}>
				<h1 style={styles.title}>Pending Invitations</h1>
				<p style={styles.subtitle}>
					{requests.length} pending connection request
					{requests.length !== 1 && "s"}
				</p>
			</div>

			{requests.length === 0 ? (
				<div style={styles.emptyState}>
					<UserPlus size={48} style={styles.emptyIcon} />
					<p style={styles.emptyText}>No pending connection requests</p>
				</div>
			) : (
				<div style={styles.grid}>
					{requests.map((request) => (
						<div key={request.from.id} style={styles.card}>
							<div style={styles.profileSection}>
								<img
									src={`http://localhost:4001/${request.from.profile_photo_path}`}
									alt={request.from.username}
									style={styles.avatar}
								/>
								<div style={styles.info}>
									<h2 style={styles.name}>{request.from.full_name}</h2>
									<p style={styles.username}>@{request.from.username}</p>
									<p style={styles.date}>
										Requested{" "}
										{new Date(request.created_at).toLocaleDateString()}
									</p>
								</div>
							</div>

							<div style={styles.actions}>
								<button
									style={{ ...styles.button, ...styles.acceptButton }}
									onClick={() => handleAccept(request.from.id)}
								>
									<Check size={16} />
									Accept
								</button>
								<button
									style={{ ...styles.button, ...styles.ignoreButton }}
									onClick={() => handleIgnore(request.from.id)}
								>
									<X size={16} />
									Ignore
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

export default ConnectionRequestsPage;
