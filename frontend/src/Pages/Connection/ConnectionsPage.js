import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ConnectionList from "../../Components/Connection/ConnectionList";
import axios from "axios";

const ConnectionsPage = () => {
    const { userId } = useParams(); // Ambil userId dari URL
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch connections on mount
    useEffect(() => {
        const fetchConnections = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/connections/${userId}`);
            setConnections(response.data);
        } catch (err) {
            setError("Failed to fetch connections.");
        } finally {
            setLoading(false);
        }
        };

        fetchConnections();
    }, [userId]);

    // Handle unconnect action
    const handleUnconnect = async (connectionId) => {
        try {
        await axios.delete(`/api/connections/${connectionId}`);
        setConnections((prevConnections) =>
            prevConnections.filter((connection) => connection.id !== connectionId)
        );
        alert("Connection removed successfully.");
        } catch (err) {
        alert("Failed to remove connection.");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <ConnectionList
        connections={connections}
        onUnconnect={handleUnconnect} // Pass the unconnect handler
        />
    );
};

export default ConnectionsPage;
