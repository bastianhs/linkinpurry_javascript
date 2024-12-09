import RegisterPage from "./Pages/Register/RegisterPage";
import LoginPage from "./Pages/Login/LoginPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyProfile from "./Pages/ProfilePage/profilePage";
import UsersPage from "./Pages/Connection/UsersPage";
import ConnectionRequestsPage from "./Pages/Connection/ConnectionRequestsPage";
import ConnectionsPage from "./Pages/Connection/ConnectionsPage";
import "./App.css";
import { AuthProvider } from "./Context/authContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import ChatPage from "./Pages/Chat/ChatPage";
import FeedPage from "./Pages/Feed/FeedPage";
import NotFoundPage from "./Pages/NotFound/NotFoundPage";
import Header from "./Components/Layout/Header";
import Footer from "./Components/Layout/Footer";
import ContactPage from "./Pages/Contact/ContactPage";
import SupportPage from "./Pages/SupportPage/SupportPage";
import { useEffect, useState } from "react";
import AboutPage from "./Components/About/AboutPage";
import OtherUserProfile from "./Pages/ProfilePage/OtherUserProfilePage";

function App() {
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 0);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<AuthProvider>
			<Router>
				
				<div className="app-container">
					<Routes>
						{/* Public Routes - No Header/Footer */}
						<Route path="/register" element={<RegisterPage />} />
						<Route path="/login" element={<LoginPage />} />
						{/* Protected Routes */}
						<Route
							path="/*"
							element={
								<ProtectedRoute>
									<>
										<Header
											className={`header ${isScrolled ? "scrolled" : ""}`}
										/>
										<main className="main-content">
											<Routes>
												<Route path="/profile/:id" element={<MyProfile />} />
												<Route path="/profile" element={<MyProfile />} />
												<Route path="/users" element={<UsersPage />} />
												<Route
													path="/connection-requests"
													element={<ConnectionRequestsPage />}
												/>
												<Route
													path="/connections/:userId"
													element={<ConnectionsPage />}
												/>
												<Route path="/chat" element={<ChatPage />} />
												<Route path="/chat/:id" element={<ChatPage />} />
												<Route path="/" element={<FeedPage />} />
												<Route path="/home" element={<FeedPage />} />
												<Route path="/contact" element={<ContactPage />} />
												<Route path="/support" element={<SupportPage />} />
												<Route path="/about" element={<AboutPage />} />
												<Route path="*" element={<NotFoundPage />} />
											</Routes>
										</main>
										<Footer className="footer" />
									</>
								</ProtectedRoute>
							}
						/>
					</Routes>
				</div>
			</Router>
		</AuthProvider>
	);
}

export default App;
