import axios from "axios";
axios.defaults.withCredentials = true;
const token = localStorage.getItem("jwtToken");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
const api = axios.create({
    baseURL: "http://localhost:4001/api", // Adjust based on your server's URL
    withCredentials: true, // This ensures cookies are sent with requests
});

export default api;
