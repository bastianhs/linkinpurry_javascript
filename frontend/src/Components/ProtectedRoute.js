import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/authContext";

const ProtectedRoute = ({ children }) => {
	const { isAuthenticated } = useAuth();
	const location = useLocation();

	if (!isAuthenticated) {
		return <Navigate to="/login" replace state={{ from: location.pathname }} />;
	}

	return children;
};

export default ProtectedRoute;
