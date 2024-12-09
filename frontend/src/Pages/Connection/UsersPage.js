import React, { useState, useEffect } from "react";
import axios from "axios";

const styles = {
    page: {
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f3f2ef",
        minHeight: "100vh",
    },
    header: {
        textAlign: "center",
        marginBottom: "20px",
        color: "#0073b1",
    },
    inputContainer: {
        display: "flex",
        justifyContent: "center",
        marginBottom: "20px",
    },
    input: {
        padding: "10px",
        width: "60%",
        maxWidth: "400px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        marginRight: "10px",
    },
    button: {
        background: "#0073b1",
        color: "#fff",
        border: "none",
        padding: "10px 20px",
        borderRadius: "4px",
        cursor: "pointer",
    },
    buttonHover: {
        background: "#0056b3",
    },
    list: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
    },
    card: {
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "4px",
        padding: "20px",
        margin: "10px",
        textAlign: "center",
        width: "250px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.2s",
    },
    cardHover: {
        transform: "scale(1.05)",
    },
    imgContainer: {
        display: "flex",
        justifyContent: "center",
        marginBottom: "10px",
    },
    img: {
        borderRadius: "50%",
        width: "100px",
        height: "100px",
        objectFit: "cover",
    },
    name: {
        fontSize: "1.2em",
        marginBottom: "10px",
        color: "#0073b1",
    },
    error: {
        color: "red",
        textAlign: "center",
        marginTop: "20px",
    },
};

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [authenticated, setAuthenticated] = useState(false);
    const [error, setError] = useState(null);

    const fetchUsers = async (search = "") => {
        try {
            const response = await axios.get("http://localhost:4001/api/users", {
                params: { search }
            });
            if (response.status === 200) {
                setUsers(response.data.data);
                setError(null);
            } else {
                setUsers([]);
                setError("Failed to fetch users");
            }
        } catch (error) {
            console.error("There was an error fetching the users!", error);
            setUsers([]);
            setError("There was an error fetching the users!");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        console.log("Users state:", users);
    }, [users]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchClick = () => {
        fetchUsers(searchTerm);
    };

    const handleSendRequest = (userId) => {
        console.log(`Send connection request to user ${userId}`);
    };

    return (
        <div style={styles.page}>
        <h1 style={styles.header}>User List</h1>
        <div style={styles.inputContainer}>
            <input
                type="text"
                placeholder="Search user..."
                value={searchTerm}
                onChange={handleSearch}
                style={styles.input}
            />
            <button
                onClick={handleSearchClick}
                style={styles.button}
                onMouseOver={(e) => e.target.style.background = styles.buttonHover.background}
                onMouseOut={(e) => e.target.style.background = styles.button.background}
            >
                Search
            </button>
        </div>
            {error && <div style={styles.error}>{error}</div>}
            <div style={styles.list}>
                {Array.isArray(users) && users.length > 0 ? (
                    users.map(user => (
                        <div
                            key={user.id}
                            style={styles.card}
                            onMouseOver={(e) => e.currentTarget.style.transform = styles.cardHover.transform}
                            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                        >
                        <div style={styles.imgContainer}>
                            <img src={user.profile_photo_path} alt={`${user.username}`} style={styles.img} />
                        </div>
                        <h2 style={styles.name}>{user.username}</h2>
                        {authenticated && !user.connected && (
                            <button
                                onClick={() => handleSendRequest(user.id)}
                                style={styles.button}
                                onMouseOver={(e) => e.target.style.background = styles.buttonHover.background}
                                onMouseOut={(e) => e.target.style.background = styles.button.background}
                            >
                                Connect
                            </button>
                        )}
                        </div>
                    ))
                ) : (
                    <div style={styles.error}>No users found</div>
                )}
            </div>
        </div>
    );
};

export default UsersPage;