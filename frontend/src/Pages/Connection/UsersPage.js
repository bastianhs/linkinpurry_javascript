import React, { useState, useEffect } from "react";
import UserList from "../../Components/Connection/UserList";
import axios from "axios";

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch users on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await axios.get("/api/users");
                setUsers(response.data);
            } catch (err) {
                setError("Failed to fetch users.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Handle connection request
    const handleSendRequest = async (userId) => {
        try {
            await axios.post(`/api/connection-requests`, { toId: userId });
            alert("Connection request sent!");
        } catch (err) {
            alert("Failed to send connection request.");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return <UserList users={users} onSendRequest={handleSendRequest} />;
};

export default UsersPage;
