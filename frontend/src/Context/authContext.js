import React, { createContext, useContext, useState, useEffect } from "react";
import { isAuthenticated as checkAuth, validateToken } from "../Utils/auth";
import api from "../Utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		validateToken()
			.then((valid) => {
				setIsAuthenticated(valid);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, []);

	const login = () => {
		setIsAuthenticated(true);
	};

	const logout = async () => {
		try {
			await api.post("/auth/logout", {}, { withCredentials: true });
			setIsAuthenticated(false);
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	if (isLoading) {
		return <div>Loading...</div>; 
	}

	return (
		<AuthContext.Provider value={{ isAuthenticated, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
