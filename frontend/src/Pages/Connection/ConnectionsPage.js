import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";


const styles = {
    page: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    list: {
        listStyle: 'none',
        padding: '0',
    },
    item: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        marginBottom: '10px',
        transition: 'background-color 0.3s',
    },
    itemHover: {
        backgroundColor: '#f5f5f5',
    },
    photo: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        marginRight: '15px',
    },
    info: {
        display: 'flex',
        flexDirection: 'column',
    },
    name: {
        fontWeight: 'bold',
        margin: '0',
    },
    date: {
        color: '#666',
        margin: '0',
    },
};

const ConnectionsPage = () => {
    const { userId } = useParams();
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConnections = async () => {
        try {
            /**
             * http://localhost:4001/api/connections/{userId}
             * example: http://localhost:4001/api/connections/5
             */
            const response = await axios.get(`http://localhost:4001/api/connections/${userId}`);
            
            setConnections(response.data.data);
        } catch (err) {
            setError(`Failed to fetch connections: ${err.message}`);
        } finally {
            setLoading(false);
        }
        };

        fetchConnections();
    }, [userId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={styles.page}>
        <h1 style={styles.header}>Connection List</h1>
        <ul style={styles.list}>
            {connections.map((connection) => (
            <li key={connection.id} style={styles.item}>
                <img src={connection.profile_photo_path} alt={connection.username} style={styles.photo} />
                <div style={styles.info}>
                    <p style={styles.name}>{connection.username}</p>
                    <p style={styles.date}>Connected on: {new Date(connection.created_at).toLocaleString()}</p>
                </div>
            </li>
            ))}
        </ul>
        </div>
    );
};

export default ConnectionsPage;
