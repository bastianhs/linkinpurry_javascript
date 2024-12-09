import React, { useEffect, useRef } from "react";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";

const ChatWindow = ({
	messages,
	activeChat,
	onSendMessage,
	user,
	isTyping,
	onTyping,
}) => {
	const styles = {
		emptyState: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			height: "100%",
			color: "rgba(0, 0, 0, 0.6)",
			fontSize: "14px",
			backgroundColor: "#f3f2ef",
		},
		chatWindow: {
			display: "flex",
			flexDirection: "column",
			height: "100%",
		},
		header: {
			padding: "16px",
			borderBottom: "1px solid #e0e0e0",
			backgroundColor: "#fff",
		},
		headerTitle: {
			fontSize: "16px",
			fontWeight: "600",
			color: "rgba(0, 0, 0, 0.9)",
		},
		messageList: {
			flex: 1,
			overflowY: "auto",
			padding: "16px",
			display: "flex",
			flexDirection: "column",
			gap: "8px",
		},
		message: {
			marginBottom: "8px",
			maxWidth: "70%",
			padding: "12px 16px",
			position: "relative",
		},
		sent: {
			alignSelf: "flex-end",
			backgroundColor: "#0a66c2",
			color: "#fff",
			borderRadius: "16px 16px 0 16px",
		},
		received: {
			alignSelf: "flex-start",
			backgroundColor: "#f3f2ef",
			color: "rgba(0, 0, 0, 0.9)",
			borderRadius: "16px 16px 16px 0",
		},
		timestamp: {
			fontSize: "11px",
			marginTop: "4px",
			opacity: 0.7,
			display: "block",
		},
		messageContent: {
			wordBreak: "break-word",
		},
	};

	const messagesEndRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
		console.log("iamdifajd")
	}, [messages,isTyping]);

	if (!activeChat) {
		return (
			<div style={styles.emptyState}>
				Select a conversation or start a new chat
			</div>
		);
	}
	// console.log(messages);
	// console.log(user);
	return (
		<div style={styles.chatWindow}>
			<div style={styles.header}>
				<h3 style={styles.headerTitle}>{activeChat.full_name}</h3>
			</div>

			<div style={styles.messageList}>
				{messages.map((msg) => {
					const isSentByMe = msg.from_id === user;
					return (
						<div
							key={msg.id}
							style={{
								...styles.message,
								...(isSentByMe ? styles.sent : styles.received),
							}}
						>
							<div style={styles.messageContent}>{msg.message}</div>
							<span style={styles.timestamp}>
								{new Date(msg.timestamp).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
								})}
							</span>
						</div>
					);
				})}
				{isTyping && <TypingIndicator />}
				<div ref={messagesEndRef} />
			</div>

			<MessageInput onSendMessage={onSendMessage} onTyping={onTyping} />
		</div>
	);
};

export default ChatWindow;
