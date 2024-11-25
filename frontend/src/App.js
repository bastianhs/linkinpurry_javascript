import RegisterPage from "./Pages/Register/RegisterPage";
import LoginPage from "./Pages/Login/LoginPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EditProfile from "./Pages/ProfilePage/profilePage";
import "./App.css";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/profile" element={<EditProfile />} />
			</Routes>
		</Router>
	);
}

export default App;
