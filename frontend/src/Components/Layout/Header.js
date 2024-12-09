import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context/authContext";
import {
	Search,
	Home,
	Users,
	MessageSquare,
	Bell,
	User,
	LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
	const [showUserMenu, setShowUserMenu] = useState(false);
	const { logout } = useAuth();
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState("");
	const [showSuggestions, setShowSuggestions] = useState(false);

	const styles = {
		header: {
			position: "fixed",
			marginTop: "1px",
			left: 0,
			right: 0,
			backgroundColor: "white",
			padding: "0 24px",
			height: "52px",
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			borderBottom: "1px solid rgba(0,0,0,0.08)",
			zIndex: 100,
		},
		nav: {
			display: "flex",
			alignItems: "center",
			gap: "24px",
		},
		search: {
			display: "flex",
			alignItems: "center",
			backgroundColor: "#EEF3F8",
			padding: "8px 16px",
			borderRadius: "4px",
			width: "280px",
			marginLeft: "16px",
		},
		searchInput: {
			border: "none",
			backgroundColor: "transparent",
			marginLeft: "8px",
			outline: "none",
			width: "100%",
			fontSize: "14px",
		},
		navItem: {
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			color: "#666666",
			textDecoration: "none",
			fontSize: "12px",
			cursor: "pointer",
			padding: "0 8px",
		},
		navIcon: {
			marginBottom: "4px",
		},
		activeNavItem: {
			color: "#000000",
		},
		userMenu: {
			position: "relative",
		},
		userMenuContent: {
			position: "absolute",
			top: "100%",
			right: 0,
			backgroundColor: "white",
			boxShadow: "0 0 5px rgba(0,0,0,0.2)",
			borderRadius: "8px",
			padding: "8px 0",
			marginTop: "8px",
			width: "200px",
		},
		menuItem: {
			padding: "8px 16px",
			fontSize: "14px",
			color: "#666666",
			textDecoration: "none",
			display: "flex",
			alignItems: "center",
			gap: "8px",
			cursor: "pointer",
			":hover": {
				backgroundColor: "#f3f2ef",
			},
		},
		searchContainer: {
			display: "flex",
			alignItems: "center",
			backgroundColor: "#EEF3F8",
			padding: "8px 16px",
			borderRadius: "4px",
			width: "280px",
			marginLeft: "16px",
		},
		searchInput: {
			border: "none",
			backgroundColor: "transparent",
			marginLeft: "8px",
			outline: "none",
			width: "100%",
			fontSize: "14px",
		},
		searchWrapper: {
			position: "relative",
		},
		suggestions: {
			position: "absolute",
			top: "100%",
			left: 0,
			right: 0,
			backgroundColor: "white",
			borderRadius: "4px",
			boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
			marginTop: "4px",
			zIndex: 1000,
		},
		suggestion: {
			padding: "8px 16px",
			cursor: "pointer",
			fontSize: "14px",
			color: "rgba(0,0,0,0.6)",
			"&:hover": {
				backgroundColor: "#f3f2ef",
			},
		},
	};
	const availableRoutes = [
		{ path: "/home", label: "Home" },
		{ path: "/profile", label: "My Profile" },
		{ path: "/users", label: "Find People" },
		{ path: "/connection-requests", label: "Network Requests" },
		{ path: "/chat", label: "Messages" },
		{ path: "/about", label: "About" },
		{ path: "/contact", label: "Contact" },
		{ path: "/support", label: "Support" },
	];
	const filteredRoutes = availableRoutes.filter((route) =>
		route.label.toLowerCase().includes(searchTerm.toLowerCase())
	);
	const handleSearch = (e) => {
		e.preventDefault();
		if (searchTerm.trim()) {
			const route = availableRoutes.find((r) =>
				r.label.toLowerCase().includes(searchTerm.toLowerCase())
			);
			if (route) {
				navigate(route.path);
				setSearchTerm("");
				setShowSuggestions(false);
			}
		}
	};
	return (
		<header style={styles.header}>
			<div style={styles.nav}>
				<Link to="/">
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
					{/* <img src="Assets/Images/Logo.png" alt="Logo" maxHeight="30" /> */}
				</Link>
				<div style={styles.searchWrapper}>
					<form onSubmit={handleSearch} style={styles.searchContainer}>
						<Search style={styles.searchIcon} size={20} />
						<input
							type="text"
							placeholder="Search pages..."
							value={searchTerm}
							onChange={(e) => {
								setSearchTerm(e.target.value);
								setShowSuggestions(true);
							}}
							onFocus={() => setShowSuggestions(true)}
							style={styles.searchInput}
						/>
					</form>
					{showSuggestions && searchTerm && (
						<div style={styles.suggestions}>
							{filteredRoutes.map((route) => (
								<div
									key={route.path}
									style={styles.suggestion}
									onClick={() => {
										navigate(route.path);
										setSearchTerm("");
										setShowSuggestions(false);
									}}
								>
									{route.label}
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			<nav style={styles.nav}>
				<Link to="/home" style={styles.navItem}>
					<Home style={styles.navIcon} size={24} />
					<span>Home</span>
				</Link>
				<Link to="/connection-requests" style={styles.navItem}>
					<Users style={styles.navIcon} size={24} />
					<span>Network</span>
				</Link>
				<Link to="/chat" style={styles.navItem}>
					<MessageSquare style={styles.navIcon} size={24} />
					<span>Messages</span>
				</Link>
				<Link to="/notifications" style={styles.navItem}>
					<Bell style={styles.navIcon} size={24} />
					<span>Notifications</span>
				</Link>
				<div style={styles.userMenu}>
					<div
						style={styles.navItem}
						onClick={() => setShowUserMenu(!showUserMenu)}
					>
						<User style={styles.navIcon} size={24} />
						<span>Me</span>
					</div>
					{showUserMenu && (
						<div style={styles.userMenuContent}>
							<Link to="/profile" style={styles.menuItem}>
								<User size={16} />
								View Profile
							</Link>
							<div style={styles.menuItem} onClick={logout}>
								<LogOut size={16} />
								Sign Out
							</div>
						</div>
					)}
				</div>
			</nav>
		</header>
	);
};

export default Header;
