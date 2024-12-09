import React from "react";

const AboutPage = () => {
	const features = [
		{
			title: "Professional Networking",
			description: "Connect with other professionals and build your network",
			icon: "🤝",
		},
		{
			title: "Real-time Chat",
			description: "Communicate instantly with your connections",
			icon: "💬",
		},
		{
			title: "Profile Management",
			description: "Showcase your professional experience and skills",
			icon: "👤",
		},
		{
			title: "User Search",
			description: "Find and connect with professionals easily",
			icon: "🔍",
		},
	];

	const stats = [
		{
			label: "Active Users",
			value: "1000+",
			icon: "👥",
		},
		{
			label: "Connections Made",
			value: "5000+",
			icon: "🔗",
		},
		{
			label: "Messages Sent",
			value: "10000+",
			icon: "✉️",
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
			fontSize: "18px",
			color: "rgba(0, 0, 0, 0.6)",
			maxWidth: "600px",
			margin: "0 auto",
			lineHeight: "1.5",
		},
		section: {
			backgroundColor: "#fff",
			borderRadius: "8px",
			boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
			padding: "32px",
			marginBottom: "24px",
		},
		sectionTitle: {
			fontSize: "24px",
			fontWeight: "600",
			color: "rgba(0, 0, 0, 0.9)",
			marginBottom: "24px",
		},
		featureGrid: {
			display: "grid",
			gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
			gap: "24px",
		},
		featureCard: {
			padding: "24px",
			backgroundColor: "#f8fafd",
			borderRadius: "8px",
			textAlign: "center",
		},
		featureIcon: {
			fontSize: "32px",
			marginBottom: "16px",
		},
		featureTitle: {
			fontSize: "18px",
			fontWeight: "600",
			color: "rgba(0, 0, 0, 0.9)",
			marginBottom: "8px",
		},
		featureDescription: {
			fontSize: "14px",
			color: "rgba(0, 0, 0, 0.6)",
		},
		statsGrid: {
			display: "grid",
			gridTemplateColumns: "repeat(3, 1fr)",
			gap: "24px",
			textAlign: "center",
		},
		statCard: {
			padding: "24px",
		},
		statIcon: {
			fontSize: "32px",
			marginBottom: "8px",
		},
		statValue: {
			fontSize: "24px",
			fontWeight: "600",
			color: "#0a66c2",
			marginBottom: "4px",
		},
		statLabel: {
			fontSize: "14px",
			color: "rgba(0, 0, 0, 0.6)",
		},
		mission: {
			fontSize: "16px",
			lineHeight: "1.6",
			color: "rgba(0, 0, 0, 0.7)",
		},
	};

	return (
		<div style={styles.container}>
			<div style={styles.content}>
				<header style={styles.header}>
					<h1 style={styles.title}>About LinkInPurry</h1>
					<p style={styles.subtitle}>
						A professional networking platform designed to connect people and
						foster meaningful professional relationships
					</p>
				</header>

				<section style={styles.section}>
					<h2 style={styles.sectionTitle}>Our Mission</h2>
					<p style={styles.mission}>
						LinkInPurry is dedicated for O.W.C.A. agents to facilitate sharing
						news feeds, connecting with other agents, and sending direct
						messages with guaranteed security.
					</p>
				</section>

				<section style={styles.section}>
					<h2 style={styles.sectionTitle}>Key Features</h2>
					<div style={styles.featureGrid}>
						{features.map((feature, index) => (
							<div key={index} style={styles.featureCard}>
								<div style={styles.featureIcon}>{feature.icon}</div>
								<h3 style={styles.featureTitle}>{feature.title}</h3>
								<p style={styles.featureDescription}>{feature.description}</p>
							</div>
						))}
					</div>
				</section>

				<section style={styles.section}>
					<h2 style={styles.sectionTitle}>Platform Statistics</h2>
					<div style={styles.statsGrid}>
						{stats.map((stat, index) => (
							<div key={index} style={styles.statCard}>
								<div style={styles.statIcon}>{stat.icon}</div>
								<div style={styles.statValue}>{stat.value}</div>
								<div style={styles.statLabel}>{stat.label}</div>
							</div>
						))}
					</div>
				</section>
			</div>
		</div>
	);
};

export default AboutPage;
