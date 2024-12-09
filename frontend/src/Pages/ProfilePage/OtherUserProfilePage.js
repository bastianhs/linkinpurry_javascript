import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faUser,
	faEnvelope,
	faCalendar,
	faBriefcase,
	faTools,
	faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { MessageSquare, UserPlus, UserMinus } from "lucide-react";
import api from "../../Utils/api";
import Snackbar from "../../Components/Snackbar";
import { Check, X } from "lucide-react";

const OtherUserProfile = () => {
	const { username } = useParams();
	const navigate = useNavigate();
	const [userData, setUserData] = useState(null);
	const [connectionStatus, setConnectionStatus] = useState(null); // null, 'none', 'pending', 'connected'
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
		profileSection: {
			display: "flex",
			gap: "24px",
			"@media (max-width: 768px)": {
				flexDirection: "column",
			},
		},
		avatarSection: {
			flex: "0 0 200px",
			textAlign: "center",
		},
		avatar: {
			width: "200px",
			height: "200px",
			borderRadius: "50%",
			objectFit: "cover",
			border: "4px solid white",
			boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
			marginBottom: "16px",
		},
		info: {
			flex: "1",
		},
		name: {
			fontSize: "24px",
			fontWeight: "600",
			color: "rgba(0,0,0,0.9)",
			marginBottom: "4px",
		},
		username: {
			fontSize: "16px",
			color: "rgba(0,0,0,0.6)",
			marginBottom: "16px",
		},
		stats: {
			fontSize: "14px",
			color: "rgba(0,0,0,0.6)",
			marginBottom: "24px",
		},
		actions: {
			display: "flex",
			gap: "12px",
		},
		button: {
			padding: "6px 16px",
			fontSize: "16px",
			fontWeight: "600",
			borderRadius: "16px",
			cursor: "pointer",
			display: "inline-flex",
			alignItems: "center",
			justifyContent: "center",
			gap: "8px",
			minWidth: "120px",
			height: "32px",
			transition: "all 0.2s ease",
		},
		primaryButton: {
			backgroundColor: "#0a66c2",
			color: "#ffffff",
			border: "1px solid #0a66c2",
		},
		secondaryButton: {
			backgroundColor: "#ffffff",
			color: "#0a66c2",
			border: "1px solid #0a66c2",
		},
		dangerButton: {
			backgroundColor: "#ffffff",
			color: "#cc1016",
			border: "1px solid #cc1016",
		},
		buttonIcon: {
			width: "16px",
			height: "16px",
		},
		section: {
			backgroundColor: "white",
			borderRadius: "8px",
			padding: "24px",
			marginBottom: "24px",
			boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
		},
		sectionTitle: {
			fontSize: "20px",
			fontWeight: "600",
			color: "rgba(0,0,0,0.9)",
			marginBottom: "16px",
		},
		detail: {
			display: "flex",
			alignItems: "center",
			gap: "12px",
			marginBottom: "16px",
		},
		detailIcon: {
			width: "24px",
			color: "rgba(0,0,0,0.6)",
		},
		detailText: {
			fontSize: "14px",
			color: "rgba(0,0,0,0.9)",
		},
		posts: {
			display: "flex",
			flexDirection: "column",
			gap: "16px",
		},
		post: {
			padding: "16px",
			backgroundColor: "white",
			borderRadius: "8px",
			boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
		},
		postContent: {
			fontSize: "14px",
			color: "rgba(0,0,0,0.9)",
			marginBottom: "8px",
		},
		postDate: {
			fontSize: "12px",
			color: "rgba(0,0,0,0.6)",
		},
	};

	useEffect(() => {
		const fetchUserProfile = async () => {
			setLoading(true);
			try {
				const response = await api.get(`/profile/other/${username}`);

				if (response.data.success) {
					setUserData(response.data.body);
					console.log(response.data.body);
					if (response.data.body.connection_status) {
						setConnectionStatus(response.data.body.connection_status);
					} else {
						setConnectionStatus(false);
					}
				} else {
					setError(response.data.message);
				}
			} catch (err) {
				setError(err.response?.data?.message || "Failed to fetch profile");
			} finally {
				setLoading(false);
			}
		};

		if (username) {
			fetchUserProfile();
		}
	}, [username]);
	useEffect(() => {
		const fetchConnections = async () => {
			setLoading(true);
			try {
				console.log(userData);
				const response = await api.get(`/connections/status/${userData.id}`);
				if (response.isPending) {
					setConnectionStatus("pending");
				} else if (response.isConnected) {
					setConnectionStatus("connected");
				} else {
					setConnectionStatus("not connected");
					// setError(response.data.message);
				}
			} catch (err) {
				setError(err.response?.data?.message || "Failed to fetch profile");
			} finally {
				setLoading(false);
			}
		};
		if (userData) {
			fetchConnections();
		}
	}, [userData]);

	const handleMessage = () => {
		navigate(`/chat/${userData.id}`);
	};

	const handleConnect = async () => {
		try {
			await api.post("/connection-requests", { toId: userData.id });
			setConnectionStatus("pending");
			setSnackbarMessage({
				text: "Connection request sent successfully",
				type: "success",
			});
			setSnackbarVisible(true);
		} catch (err) {
			setError(
				err.response?.data?.message || "Failed to send connection request"
			);
			setSnackbarVisible(true);
		}
	};
	const handleDisconnect = async () => {
		const confirmed = window.confirm(
			"Are you sure you want to remove this connection?"
		);
		if (!confirmed) return;

		try {
			await api.delete(`/connections/${userData.id}`);
			setConnectionStatus("not connected");
			setSnackbarMessage({
				text: "Connection removed successfully",
				type: "success",
			});
			setSnackbarVisible(true);
		} catch (err) {
			setError(err.response?.data?.message || "Failed to remove connection");
			setSnackbarVisible(true);
		}
	};
	const handleAccept = async () => {
		try {
			await api.put("/connection-requests", {
				fromId: userData.id,
				action: "accept",
			});
			setConnectionStatus("connected");
			setSnackbarMessage({
				text: "Connection request accepted",
				type: "success",
			});
			setSnackbarVisible(true);
		} catch (err) {
			setError(err.response?.data?.message || "Failed to accept request");
			setSnackbarVisible(true);
		}
	};
	const handleReject = async () => {
		try {
			await api.put("/connection-requests", {
				fromId: userData.id,
				action: "decline",
			});
			setConnectionStatus("not connected");
			setSnackbarMessage({
				text: "Connection request declined",
				type: "success",
			});
			setSnackbarVisible(true);
		} catch (err) {
			setError(err.response?.data?.message || "Failed to decline request");
			setSnackbarVisible(true);
		}
	};

	if (loading) return <div style={styles.container}>Loading...</div>;
	if (error) return <div style={styles.container}>Error: {error}</div>;

	const renderConnectionActions = () => {
		switch (connectionStatus) {
			case "connected":
				return (
					<div>
						<button onClick={handleMessage}>Message</button>
						<button onClick={handleDisconnect}>Remove Connection</button>
					</div>
				);
			case "pending":
				return (
					<div>
						<button onClick={handleAccept}>Accept</button>
						<button onClick={handleReject}>Reject</button>
					</div>
				);
			case "not connected":
				return (
					<div>
						<button onClick={handleConnect}>Connect</button>
					</div>
				);
			default:
				return null;
		}
	};
	return (
		<div style={styles.container}>
			<div style={styles.header}>
				<div style={styles.profileSection}>
					<div style={styles.avatarSection}>
						<img
							src={userData.profile_photo_path}
							alt={userData.username}
							style={styles.avatar}
						/>
						<div style={styles.actionButtons}>
							{connectionStatus === "connected" && (
								<>
									<button style={styles.primaryButton} onClick={handleMessage}>
										<MessageSquare size={16} />
										Message
									</button>
									<button
										style={styles.dangerButton}
										onClick={handleDisconnect}
									>
										<UserMinus size={16} />
										Remove Connection
									</button>
								</>
							)}
							{connectionStatus === "pending" && (
								<>
									<button style={styles.primaryButton} onClick={handleAccept}>
										<Check size={16} />
										Accept
									</button>
									<button style={styles.secondaryButton} onClick={handleReject}>
										<X size={16} />
										Reject
									</button>
								</>
							)}
							{connectionStatus === "not connected" && (
								<button style={styles.primaryButton} onClick={handleConnect}>
									<UserPlus size={16} />
									Connect
								</button>
							)}
						</div>
					</div>
					<div style={styles.info}>
						<h1 style={styles.name}>{userData.name}</h1>
						<p style={styles.username}>@{userData.username}</p>
						<p style={styles.stats}>
							<FontAwesomeIcon icon={faUsers} /> {userData.connection_count}{" "}
							connections
						</p>
					</div>
				</div>
			</div>
			<renderConnectionActions />
			<div style={styles.section}>
				<h2 style={styles.sectionTitle}>About</h2>
				<div style={styles.detail}>
					<FontAwesomeIcon icon={faBriefcase} style={styles.detailIcon} />
					<span style={styles.detailText}>
						{userData.work_history || "No work history"}
					</span>
				</div>
				<div style={styles.detail}>
					<FontAwesomeIcon icon={faTools} style={styles.detailIcon} />
					<span style={styles.detailText}>
						{userData.skills || "No skills listed"}
					</span>
				</div>
				<div style={styles.detail}>
					<FontAwesomeIcon icon={faCalendar} style={styles.detailIcon} />
					<span style={styles.detailText}>
						Joined {new Date(userData.created_at).toLocaleDateString()}
					</span>
				</div>
			</div>

			{userData.relevant_posts && userData.relevant_posts.length > 0 && (
				<div style={styles.section}>
					<h2 style={styles.sectionTitle}>Posts</h2>
					<div style={styles.posts}>
						{userData.relevant_posts.map((post) => (
							<div key={post.id} style={styles.post}>
								<p style={styles.postContent}>{post.content}</p>
								<span style={styles.postDate}>
									{new Date(post.created_at).toLocaleDateString()}
								</span>
							</div>
						))}
					</div>
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

export default OtherUserProfile;
