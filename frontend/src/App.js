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

function App() {
	return (
		<AuthProvider>
			<Router>
				<Routes>
					{/* Public Routes */}
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/login" element={<LoginPage />} />

					{/* Protected Routes */}
					<Route
						path="/profile"
						element={
							<ProtectedRoute>
								<MyProfile />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/users"
						element={
							<ProtectedRoute>
								<UsersPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/connection-requests"
						element={
							<ProtectedRoute>
								<ConnectionRequestsPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/connections/:userId"
						element={
							<ProtectedRoute>
								<ConnectionsPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/chat"
						element={
							<ProtectedRoute>
								<ChatPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/feed"
						element={
							<ProtectedRoute>
								<FeedPage />
							</ProtectedRoute>
						}
					/>
					<Route path="/" element={<LoginPage />} />
				</Routes>
			</Router>
		</AuthProvider>
	);
}

export default App;
