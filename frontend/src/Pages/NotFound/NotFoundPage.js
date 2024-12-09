import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
	const styles = {
		container: {
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			minHeight: "100vh",
			backgroundColor: "#f3f2ef",
			padding: "20px",
			fontFamily:
				"-apple-system,system-ui,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Fira Sans,Ubuntu,Oxygen,Oxygen Sans,Cantarell,Droid Sans,Apple Color Emoji,Segoe UI Emoji,Segoe UI Emoji,Segoe UI Symbol,Lucida Grande,Helvetica,Arial,sans-serif",
		},
		content: {
			backgroundColor: "#fff",
			borderRadius: "8px",
			padding: "40px",
			maxWidth: "600px",
			width: "100%",
			textAlign: "center",
			boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
		},
		errorCode: {
			fontSize: "120px",
			fontWeight: "bold",
			color: "#0a66c2",
			margin: "0",
			lineHeight: "1",
		},
		title: {
			fontSize: "24px",
			color: "rgba(0,0,0,0.9)",
			marginTop: "20px",
			marginBottom: "16px",
		},
		message: {
			fontSize: "16px",
			color: "rgba(0,0,0,0.6)",
			marginBottom: "32px",
			lineHeight: "1.5",
		},
		button: {
			backgroundColor: "#0a66c2",
			color: "#fff",
			padding: "12px 24px",
			borderRadius: "24px",
			border: "none",
			fontSize: "16px",
			fontWeight: "600",
			cursor: "pointer",
			textDecoration: "none",
			display: "inline-block",
			transition: "background-color 0.3s",
		},
		buttonHover: {
			backgroundColor: "#004182",
		},
		links: {
			marginTop: "24px",
			display: "flex",
			gap: "16px",
			justifyContent: "center",
		},
		link: {
			color: "#0a66c2",
			textDecoration: "none",
			fontSize: "14px",
			fontWeight: "600",
		},
	};

	return (
		<div style={styles.container}>
			<div style={styles.content}>
				<h1 style={styles.errorCode}>404</h1>
				<h2 style={styles.title}>Page not found</h2>
				<p style={styles.message}>
					We can't find the page you're looking for. The page may have been
					removed or moved to a different location.
				</p>
				<Link
					to="/"
					style={styles.button}
					onMouseOver={(e) =>
						(e.target.style.backgroundColor =
							styles.buttonHover.backgroundColor)
					}
					onMouseOut={(e) =>
						(e.target.style.backgroundColor = styles.button.backgroundColor)
					}
				>
					Go Home
				</Link>
				<div style={styles.links}>
					<Link to="/profile" style={styles.link}>
						View Profile
					</Link>
					<Link to="/connections" style={styles.link}>
						Your Network
					</Link>
					<Link to="/chat" style={styles.link}>
						Messages
					</Link>
				</div>
			</div>
		</div>
	);
};

export default NotFoundPage;
