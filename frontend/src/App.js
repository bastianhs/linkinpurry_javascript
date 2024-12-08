import RegisterPage from "./Pages/Register/RegisterPage";
import LoginPage from "./Pages/Login/LoginPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyProfile from "./Pages/ProfilePage/profilePage";
import UsersPage from "./Pages/Connection/UsersPage";
import ConnectionRequestsPage from "./Pages/Connection/ConnectionRequestsPage";
import ConnectionsPage from "./Pages/Connection/ConnectionsPage";
import "./App.css";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/profile" element={<MyProfile />} />
				{/* <Route path="/profile/:id" element={<MyProfile />} /> */}
				
				<Route path="/users" element={<UsersPage />} />
				<Route path="/connection-requests" element={<ConnectionRequestsPage />} />
				<Route path="/connections/:userId" element={<ConnectionsPage />} />
			</Routes>
		</Router>
	);
}

export default App;
