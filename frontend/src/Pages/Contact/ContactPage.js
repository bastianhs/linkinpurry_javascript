import React from "react";

const ContactPage = () => {
	const creators = [
		{
			name: "Eka Prawira",
			role: "Full Stack Developer",
			github: "https://github.com/EkaaPrawiraa",
			githubUsername: "EkaaPrawiraa",
			image: "https://avatars.githubusercontent.com/u/110816073?v=4",
		},
		{
			name: "Farid",
			role: "Full Stack Developer",
			github: "https://github.com/frdmmm",
			githubUsername: "frdmmm",
			image: "https://avatars.githubusercontent.com/u/130454922?v=4",
		},
		{
			name: "Bastian",
			role: "Full Stack Developer",
			github: "https://github.com/bastianhs",
			githubUsername: "bastianhs",
			image: "https://avatars.githubusercontent.com/u/140167233?v=4",
		},
	];

	const styles = {
		container: {
			minHeight: "calc(100vh - 52px)", 
			backgroundColor: "#f3f2ef",
			padding: "48px 24px",
		},
		content: {
			maxWidth: "1128px",
			margin: "0 auto",
		},
		header: {
			textAlign: "center",
			marginBottom: "48px",
		},
		title: {
			fontSize: "32px",
			fontWeight: "600",
			color: "rgba(0, 0, 0, 0.9)",
			marginBottom: "16px",
		},
		subtitle: {
			fontSize: "16px",
			color: "rgba(0, 0, 0, 0.6)",
		},
		grid: {
			display: "grid",
			gridTemplateColumns: "repeat(3, 1fr)",
			gap: "24px",
			"@media (max-width: 768px)": {
				gridTemplateColumns: "1fr",
			},
		},
		card: {
			backgroundColor: "#fff",
			borderRadius: "8px",
			boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
			padding: "24px",
			textAlign: "center",
			transition: "transform 0.2s ease",
			":hover": {
				transform: "translateY(-4px)",
			},
		},
		imageContainer: {
			width: "120px",
			height: "120px",
			margin: "0 auto 16px",
			borderRadius: "50%",
			overflow: "hidden",
			border: "4px solid #0a66c2",
		},
		image: {
			width: "100%",
			height: "100%",
			objectFit: "cover",
		},
		name: {
			fontSize: "20px",
			fontWeight: "600",
			color: "rgba(0, 0, 0, 0.9)",
			marginBottom: "3px",
		},
		username: {
			fontSize: "13px",
			fontWeight: "400",
			color: "rgba(0, 0, 0, 0.5)",
			marginBottom: "20px",
		},
		role: {
			fontSize: "14px",
			color: "rgba(0, 0, 0, 0.6)",
			marginBottom: "16px",
		},
		button: {
			display: "inline-flex",
			alignItems: "center",
			gap: "8px",
			padding: "8px 16px",
			backgroundColor: "#0a66c2",
			color: "#fff",
			borderRadius: "24px",
			textDecoration: "none",
			fontSize: "14px",
			fontWeight: "600",
			transition: "background-color 0.2s",
			":hover": {
				backgroundColor: "#004182",
			},
		},
	};

	return (
		<div style={styles.container}>
			<div style={styles.content}>
				<header style={styles.header}>
					<h1 style={styles.title}>Meet Our Team</h1>
					<p style={styles.subtitle}>The creators behind LinkInPurry App</p>
				</header>

				<div style={styles.grid}>
					{creators.map((creator) => (
						<div key={creator.githubUsername} style={styles.card}>
							<div style={styles.imageContainer}>
								<img
									src={creator.image}
									alt={creator.name}
									style={styles.image}
								/>
							</div>
							<h2 style={styles.name}>{creator.name}</h2>
							<h4 style={styles.username}>@{creator.githubUsername}</h4>
							<p style={styles.role}>{creator.role}</p>
							<a
								href={creator.github}
								target="_blank"
								rel="noopener noreferrer"
								style={styles.button}
							>
								<svg
									height="20"
									width="20"
									viewBox="0 0 16 16"
									fill="currentColor"
								>
									<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
								</svg>
								View GitHub
							</a>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default ContactPage;
