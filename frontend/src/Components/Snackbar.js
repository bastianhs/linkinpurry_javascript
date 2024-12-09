import React from "react";

const Snackbar = ({ message, type = "success", errors = [], onClose }) => {
	const styles = {
		snackbarContainer: {
			position: "fixed",
			bottom: "20px",
			right: "20px",
			zIndex: 1000,
		},
		snackbar: {
			backgroundColor: type === "success" ? "#059669" : "#DC2626",
			color: "#fff",
			padding: "16px",
			borderRadius: "8px",
			boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
			// fontSize: "14px",
			minWidth: "300px",
		},
		errorList: {
			marginTop: "8px",
			listStyle: "none",
			padding: 0,
		},
		errorItem: {
			marginTop: "4px",
			fontSize: "14px",
		},
		closeButton: {
			position: "absolute",
			right: "8px",
			top: "8px",
			background: "none",
			border: "none",
			color: "white",
			cursor: "pointer",
		},
	};
	return (
		<div style={styles.snackbarContainer}>
			<div style={styles.snackbar}>
				<span>{message}</span>
				<button onClick={onClose} style={styles.closeButton}>
					✕
				</button>
				{errors.length > 0 && (
					<ul style={styles.errorList}>
						{errors.map((error, index) => (
							<li key={index} style={styles.errorItem}>
								• {error.message}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default Snackbar;
