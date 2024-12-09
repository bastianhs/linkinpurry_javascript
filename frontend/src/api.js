import axios from "axios";


axios.defaults.withCredentials = true;

const token = localStorage.getItem("jwtToken");
if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

const api = axios.create({
    baseURL: "http://localhost:4001/api",
    withCredentials: true,
});

export default api;
