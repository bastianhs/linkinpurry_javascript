import React, { useState, useRef } from "react";

const MessageInput = ({ onSendMessage, onTyping }) => {
	const styles = {
		inputForm: {
			display: "flex",
			padding: "16px",
			borderTop: "1px solid #e0e0e0",
			backgroundColor: "#fff",
		},
		input: {
			flex: 1,
			padding: "12px 16px",
			borderRadius: "24px",
			border: "1px solid #e0e0e0",
			fontSize: "14px",
			marginRight: "8px",
			outline: "none",
		},
		sendButton: {
			backgroundColor: "#0a66c2",
			color: "#fff",
			border: "none",
			padding: "8px 16px",
			borderRadius: "24px",
			fontWeight: "600",
			cursor: "pointer",
		},
	};
	const [message, setMessage] = useState("");
	const typingTimeoutRef = useRef(null);

	const handleChange = (e) => {
		setMessage(e.target.value);
		onTyping(true); 
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (message.trim()) {
			onSendMessage(message);
			setMessage("");
		}
	};

	return (
		<form style={styles.inputForm} onSubmit={handleSubmit}>
			<input
				type="text"
				value={message}
				onChange={handleChange}
				placeholder="Type a message..."
				style={styles.input}
			/>
			<button type="submit" style={styles.sendButton}>
				Send
			</button>
		</form>
	);
};

export default MessageInput;
