import React from "react";

const TypingIndicator = () => {
	return (
		<div style={styles.container}>
			<div style={styles.dots}>
				<span style={styles.dot} />
				<span style={{ ...styles.dot, animationDelay: "0.2s" }} />
				<span style={{ ...styles.dot, animationDelay: "0.4s" }} />
			</div>
		</div>
	);
};

const styles = {
	container: {
		padding: "8px 16px",
		fontSize: "14px",
		color: "#666",
	},
	dots: {
		display: "flex",
		gap: "4px",
	},
	dot: {
		width: "8px",
		height: "8px",
		backgroundColor: "#0a66c2",
		borderRadius: "50%",
		animation: "bounce 1s infinite",
	},
	"@keyframes bounce": {
		"0%, 100%": { transform: "translateY(0)" },
		"50%": { transform: "translateY(-4px)" },
	},
};

export default TypingIndicator;
