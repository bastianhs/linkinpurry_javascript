import React from "react";

const Snackbar = ({ message, onClose }) => {
	return (
		<div style={styles.snackbarContainer}>
			<div style={styles.snackbar}>
				<span>{message}</span>
				<button onClick={onClose} style={styles.closeButton}>
					✕
				</button>
			</div>
		</div>
	);
};

const styles = {
	snackbarContainer: {
		position: "fixed",
		bottom: "20px",
		right: "20px",
		zIndex: 1000,
	},
	snackbar: {
		display: "flex",
		alignItems: "center",
		backgroundColor: "#323232",
		color: "#fff",
		padding: "10px 20px",
		borderRadius: "8px",
		boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
		fontSize: "14px",
		maxWidth: "300px",
	},
	closeButton: {
		backgroundColor: "transparent",
		border: "none",
		color: "#fff",
		fontSize: "16px",
		marginLeft: "10px",
		cursor: "pointer",
	},
};

export default Snackbar;
