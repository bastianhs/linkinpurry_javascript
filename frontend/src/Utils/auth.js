import Cookies from "js-cookie";

export const getToken = () => Cookies.get("token");
export const setToken = (token) => {
	return true;
};
export const removeToken = async () => {
	try {
		await fetch("http://localhost:4001/api/auth/logout", {
			method: "POST",
			credentials: "include",
		});
		return true;
	} catch (err) {
		console.error("Logout error:", err);
		return false;
	}
};
export const validateToken = () => {
	return fetch("http://localhost:4001/api/auth/protected", {
		credentials: "include",
	}).then((res) => res.ok);
};
export const isAuthenticated = () => !!getToken();
