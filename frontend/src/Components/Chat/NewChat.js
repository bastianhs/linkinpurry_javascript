import React, { useState } from "react";

const NewChat = ({ connections, onStartChat }) => {
	const styles = {
		newChatButton: {
			padding: "12px 16px",
			backgroundColor: "#0a66c2",
			color: "#fff",
			border: "none",
			borderRadius: "24px",
			fontWeight: "600",
			cursor: "pointer",
			margin: "16px",
			width: "calc(100% - 32px)",
		},
		modal: {
			position: "fixed",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: "rgba(0, 0, 0, 0.5)",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			zIndex: 1000,
		},
		modalContent: {
			backgroundColor: "#fff",
			borderRadius: "8px",
			padding: "24px",
			width: "90%",
			maxWidth: "400px",
			maxHeight: "80vh",
			overflow: "auto",
		},
		userList: {
			marginTop: "16px",
			maxHeight: "400px",
			overflowY: "auto",
		},
		userItem: {
			padding: "12px",
			cursor: "pointer",
			borderRadius: "4px",
			transition: "background-color 0.3s",
			display: "flex",
			alignItems: "center",
			gap: "12px",
			":hover": {
				backgroundColor: "#f3f2ef",
			},
		},
		userAvatar: {
			width: "40px",
			height: "40px",
			borderRadius: "50%",
			objectFit: "cover",
		},
		userAvatarFallback: {
			width: "40px",
			height: "40px",
			borderRadius: "50%",
			backgroundColor: "#0a66c2",
			color: "white",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			fontSize: "16px",
		},
		userName: {
			fontSize: "14px",
			fontWeight: "600",
			color: "rgba(0, 0, 0, 0.9)",
		},
		closeButton: {
			marginTop: "16px",
			padding: "8px 16px",
			backgroundColor: "#fff",
			border: "1px solid #0a66c2",
			color: "#0a66c2",
			borderRadius: "24px",
			cursor: "pointer",
		},
		noConnections: {
			textAlign: "center",
			color: "#666",
			padding: "24px",
			fontSize: "14px",
		},
	};

	const [isModalOpen, setIsModalOpen] = useState(false);
	// console.log(connections);
	return (
		<>
			<button style={styles.newChatButton} onClick={() => setIsModalOpen(true)}>
				New Chat
			</button>

			{isModalOpen && (
				<div style={styles.modal}>
					<div style={styles.modalContent}>
						<h3>Select User to Chat</h3>
						<div style={styles.userList}>
							{!connections ? (
								<div style={styles.noConnections}>
									You don't have any connections yet. Connect with other users
									to start chatting!
								</div>
							) : (
								connections.map((user) => (
									<div
										key={user.id}
										style={styles.userItem}
										onClick={() => {
											onStartChat(user);
											setIsModalOpen(false);
										}}
									>
										{user.profile_photo_path ? (
											<img
												src={`http://localhost:4001/${user.profile_photo_path}`}
												alt={user.username}
												style={styles.userAvatar}
											/>
										) : (
											<div style={styles.userAvatarFallback}>
												{user.username.charAt(0).toUpperCase()}
											</div>
										)}
										<span style={styles.userName}>{user.username}</span>
									</div>
								))
							)}
						</div>
						<button
							style={styles.closeButton}
							onClick={() => setIsModalOpen(false)}
						>
							Cancel
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default NewChat;
