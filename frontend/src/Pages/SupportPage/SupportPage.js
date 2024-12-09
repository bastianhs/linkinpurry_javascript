import React from "react";

const SupportPage = () => {
	const faqs = [
		{
			question: "How do I create an account?",
			answer:
				"Click the 'Register' button and fill in your details (username, email, full name, and password). Your email must be unique and follow standard format (example@example.com).",
		},
		{
			question: "How do I connect with other users?",
			answer:
				"Go to the Users List page, search for users, and click the 'Connect' button on their profile. They'll need to accept your connection request.",
		},
		{
			question: "How do I message someone?",
			answer:
				"You can message your connections through the chat feature in the navigation bar. Click 'New Chat' to start a conversation with any of your connections.",
		},
		{
			question: "How do I manage connection requests?",
			answer:
				"Visit the Connection Requests page to see pending requests. You can accept or decline requests from other users.",
		},
		{
			question: "How do I view my connections?",
			answer:
				"Access the Connections page to see all your accepted connections. This list is visible to other users.",
		},
		{
			question: "How do I edit my profile?",
			answer:
				"Go to your Profile page and click the 'Edit Profile' button. You can update your name, work history, skills, and profile photo.",
		},
		{
			question: "How do I search for other users?",
			answer:
				"Use the search bar in the Users List page. You can search by username (case-insensitive) and partial matches are supported.",
		},
		{
			question: "How do I start a new chat?",
			answer:
				"In the Chat page, click 'New Chat' button and select a connection from the list to start a conversation.",
		},
		{
			question: "Can others see my chat messages?",
			answer:
				"No, chats are private. Only you and the person you're chatting with can see the conversation.",
		},
		{
			question: "How do I view someone's profile?",
			answer:
				"Click on a user's name or photo anywhere in the app to visit their profile page and see their details.",
		},
	];

	const styles = {
		container: {
			minHeight: "calc(100vh - 52px)",
			backgroundColor: "#f3f2ef",
			padding: "48px 24px",
		},
		content: {
			maxWidth: "768px",
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
			marginBottom: "32px",
		},
		section: {
			backgroundColor: "#fff",
			borderRadius: "8px",
			boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
			padding: "32px",
			marginBottom: "24px",
		},
		sectionTitle: {
			fontSize: "20px",
			fontWeight: "600",
			color: "rgba(0, 0, 0, 0.9)",
			marginBottom: "16px",
		},
		faqItem: {
			marginBottom: "24px",
		},
		question: {
			fontSize: "16px",
			fontWeight: "600",
			color: "rgba(0, 0, 0, 0.9)",
			marginBottom: "8px",
		},
		answer: {
			fontSize: "14px",
			color: "rgba(0, 0, 0, 0.6)",
		},
		contact: {
			textAlign: "center",
			fontSize: "14px",
			color: "rgba(0, 0, 0, 0.6)",
		},
		email: {
			color: "#0a66c2",
			textDecoration: "none",
			fontWeight: "600",
		},
	};

	return (
		<div style={styles.container}>
			<div style={styles.content}>
				<header style={styles.header}>
					<h1 style={styles.title}>Support Center</h1>
					<p style={styles.subtitle}>Find answers to common questions</p>
				</header>

				<section style={styles.section}>
					<h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>
					{faqs.map((faq, index) => (
						<div key={index} style={styles.faqItem}>
							<h3 style={styles.question}>{faq.question}</h3>
							<p style={styles.answer}>{faq.answer}</p>
						</div>
					))}
				</section>

				<section style={styles.section}>
					<h2 style={styles.sectionTitle}>Contact Support</h2>
					<p style={styles.contact}>
						Can't find what you're looking for? Email us at{" "}
						<a href="mailto:support@linkinpurry.com" style={styles.email}>
							support@linkinpurry.com
						</a>
					</p>
				</section>
			</div>
		</div>
	);
};

export default SupportPage;
