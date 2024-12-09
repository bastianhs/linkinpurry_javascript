import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
	const styles = {
		footer: {
			backgroundColor: "#f3f2ef",
			padding: "24px 0 24px",
			marginTop: "auto",
			borderTop: "5px solid rgba(0, 0, 0, 0.08)",
		},
		container: {
			maxWidth: "1128px",
			margin: "0 auto",
			padding: "0 24px",
		},
		grid: {
			display: "grid",
			gridTemplateColumns: "repeat(3, 1fr)",
			gap: "48px",
			marginBottom: "24px",
			"@media (max-width: 768px)": {
				gridTemplateColumns: "repeat(2, 1fr)",
				gap: "24px",
			},
			"@media (max-width: 640px)": {
				gridTemplateColumns: "1fr",
				gap: "32px",
			},
		},
		section: {
			display: "flex",
			flexDirection: "column",
			gap: "12px",
		},
		sectionLeft: {
			alignItems: "flex-start",
			"@media (max-width: 640px)": {
				alignItems: "center",
			},
		},
		sectionCenter: {
			alignItems: "center",
			justifyContent: "flex-start",
		},
		sectionRight: {
			alignItems: "flex-end",
			"@media (max-width: 640px)": {
				alignItems: "center",
			},
		},
		title: {
			color: "#000000",
			fontSize: "16px",
			fontWeight: "600",
			marginBottom: "8px",
			textAlign: "inherit",
		},
		link: {
			color: "rgba(0,0,0,0.6)",
			textDecoration: "none",
			fontSize: "14px",
			padding: "4px 0",
			transition: "color 0.2s",
			":hover": {
				color: "#0a66c2",
				textDecoration: "underline",
			},
		},
		bottom: {
			borderTop: "1px solid rgba(0,0,0,0.08)",
			marginTop: "24px",
			paddingTop: "24px",
			textAlign: "center",
			color: "rgba(0,0,0,0.6)",
			fontSize: "12px",
		},
		logo: {
			display: "flex",
			alignItems: "center",
			gap: "8px",
			marginBottom: "24px",
			justifyContent: "center",
		},
	};

	return (
		<footer style={styles.footer}>
			<div style={styles.container}>
				<div style={styles.logo}>
					<svg
						width="34"
						height="34"
						viewBox="0 0 34 34"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<rect width="34" height="34" rx="4" fill="#0A66C2" />
						<text
							x="50%"
							y="50%"
							dominantBaseline="middle"
							textAnchor="middle"
							fill="white"
							fontFamily="system-ui, -apple-system"
							fontSize="16"
							fontWeight="bold"
						>
							WBD
						</text>
					</svg>
					{/* <img src="/logo.png" alt="Logo" height="24" /> */}
					<span>© 2024</span>
				</div>

				<div style={styles.grid}>
					<div style={{ ...styles.section, ...styles.sectionLeft }}>
						<h3 style={styles.title}>Navigation</h3>
						<Link to="/about" style={styles.link}>
							About
						</Link>
						<Link to="/users" style={styles.link}>
							Network
						</Link>
						<Link to="/chat" style={styles.link}>
							Messages
						</Link>
					</div>

					<div style={{ ...styles.section, ...styles.sectionCenter }}>
						<h3 style={styles.title}>Account</h3>
						<Link to="/profile" style={styles.link}>
							View Profile
						</Link>
						<Link to="/connections/:userId" style={styles.link}>
							My Connections
						</Link>
						<Link to="/connection-requests" style={styles.link}>
							Connection Request
						</Link>
					</div>

					<div style={{ ...styles.section, ...styles.sectionRight }}>
						<h3 style={styles.title}>Contact</h3>
						<Link to="/contact" style={styles.link}>
							Contact Us
						</Link>
						<Link to="/support" style={styles.link}>
							Support
						</Link>
						<Link to="/nothing" style={styles.link}>
							Comming Soon...
						</Link>
					</div>
				</div>

				<div style={styles.bottom}>
					<p>WBD LinkInPurry App</p>
					<p>EkaaPrawiraa, frdmmm, bastianhs © 2024. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
