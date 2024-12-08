import React from "react";

const ChatList = ({ chats, activeChat, onSelectChat, user }) => {
	const styles = {
		chatList: {
			borderRight: "1px solid #e0e0e0",
			overflow: "auto",
			height: "100%",
		},
		chatItem: {
			padding: "16px",
			cursor: "pointer",
			display: "flex",
			alignItems: "center",
			gap: "12px",
			borderBottom: "1px solid #f3f2ef",
			transition: "background-color 0.3s",
		},
		active: {
			backgroundColor: "#f3f2ef",
		},
		avatar: {
			width: "48px",
			height: "48px",
			borderRadius: "50%",
			objectFit: "cover",
		},
		avatarFallback: {
			width: "48px",
			height: "48px",
			borderRadius: "50%",
			backgroundColor: "#0a66c2",
			color: "#fff",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			fontSize: "18px",
			flexShrink: 0,
		},
		chatInfo: {
			flex: 1,
			minWidth: 0,
		},
		userName: {
			fontSize: "14px",
			fontWeight: "600",
			color: "rgba(0, 0, 0, 0.9)",
			display: "block",
			marginBottom: "4px",
			whiteSpace: "nowrap",
			overflow: "hidden",
			textOverflow: "ellipsis",
		},
		lastMessage: {
			fontSize: "13px",
			color: "rgba(0, 0, 0, 0.6)",
			whiteSpace: "nowrap",
			overflow: "hidden",
			textOverflow: "ellipsis",
		},
	};
	// console.log(chats);
	const groupedChats = chats.reduce((acc, chat) => {
		// console.log(chat);
		const partnerId = chat.otherUser.id;
		// if (partnerId === 8) {
		//     console.log("Found chat with user 8:", chat);
		//   }
		if (!acc[partnerId]) {
			acc[partnerId] = {
				id: chat.id,
				otherUser: chat.otherUser,
				messages: [chat],
				lastMessage: chat,
			};
		} else if (
			new Date(chat.timestamp) > new Date(acc[partnerId].lastMessage.timestamp)
		) {
			acc[partnerId].lastMessage = chat;
		}
		return acc;
	}, {});

	const uniqueChats = Object.values(groupedChats)
		.filter((chat) => chat.otherUser.id !== user)
		.sort(
			(a, b) =>
				new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp)
		);
	return (
		<div style={styles.chatList}>
			{uniqueChats.map((chat) => (
				<div
					key={chat.otherUser.id}
					style={{
						...styles.chatItem,
						...(activeChat?.id === chat.otherUser.id ? styles.active : {}),
					}}
					onClick={() => onSelectChat(chat.otherUser)}
				>
					{chat.otherUser.profile_photo_path ? (
						<img
							src={chat.otherUser.profile_photo_path}
							alt={chat.otherUser.username}
							style={styles.avatar}
						/>
					) : (
						<div style={styles.avatarFallback}>
							{chat.otherUser.username.charAt(0).toUpperCase()}
						</div>
					)}
					<div style={styles.chatInfo}>
						<span style={styles.userName}>{chat.otherUser.username}</span>
						<span style={styles.lastMessage}>
							{chat.lastMessage.message || "No messages yet"}
						</span>
					</div>
				</div>
			))}
		</div>
	);
};

export default ChatList;
