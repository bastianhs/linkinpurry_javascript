import React, { useState, useEffect } from "react";
import api from "../../api";
import Snackbar from "../../Components/Snackbar";


const styles = {
    page: {
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    header: {
        fontSize: "24px",
        marginBottom: "20px",
        textAlign: "center"
    },
    list: {
        listStyleType: "none",
        padding: 0,
        width: "100%",
        maxWidth: "600px"
    },
    item: {
        display: "flex",
        alignItems: "center",
        marginBottom: "15px",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        flexWrap: "wrap"
    },
    photo: {
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        marginRight: "15px"
    },
    info: {
        flex: 1,
        minWidth: "200px"
    },
    fullName: {
        fontSize: "18px",
        margin: 0
    },
    username: {
        fontSize: "16px",
        color: "#555",
        margin: "0 0 10px 0"
    },
    date: {
        fontSize: "14px",
        color: "#999"
    },
    button: {
        padding: "8px 12px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginLeft: "10px",
        marginTop: "10px"
    },
    acceptButton: {
        backgroundColor: "#4CAF50",
        color: "white"
    },
    declineButton: {
        backgroundColor: "#f44336",
        color: "white"
    }
};

const ConnectionRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [snackbarVisible, setSnackbarVisible] = useState(false);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await api.get("http://localhost:4001/api/connection-requests");
                setRequests(response.data.data);
            } catch (err) {
                const errorMessage = err.response && err.response.data && err.response.data.errors
                ? err.response.data.errors
                : `Failed to fetch connection requests: ${err.message}`;
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const handleAccept = async (fromId) => {
        try {
            await api.put("http://localhost:4001/api/connection-requests", {
                fromId,
                action: "accept",
            });
            setRequests((prevRequests) => prevRequests.filter((req) => req.from.id !== fromId));
            setSuccessMessage("Connection request accepted successfully.");
            setSnackbarVisible(true);
        } catch (err) {
            setError(`Failed to accept connection request: ${err.message}`);
        }
    };

    const handleDecline = async (fromId) => {
        try {
            await api.put("http://localhost:4001/api/connection-requests", {
                fromId,
                action: "decline",
            });
            setRequests((prevRequests) => prevRequests.filter((req) => req.from.id !== fromId));
            setSuccessMessage("Connection request declined successfully.");
            setSnackbarVisible(true);
        } catch (err) {
            setError(`Failed to decline connection request: ${err.message}`);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarVisible(false);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return (
        <div style={{ color: "red", textAlign: "center", fontSize: "18px" }}>{error}</div>
    );

    return (
        <div style={styles.page}>
            <h1 style={styles.header}>Connection Requests</h1>
            <ul style={styles.list}>
                {requests.map((request) => (
                    <li key={request.from.id} style={styles.item}>
                        <img src={request.from.profile_photo_path} alt={request.from.username} style={styles.photo} />
                        <div style={styles.info}>
                            <p style={styles.fullName}>{request.from.full_name}</p>
                            <p style={styles.username}>{request.from.username}</p>
                            <p style={styles.date}>Requested on: {new Date(request.created_at).toLocaleString()}</p>
                        </div>
                        <button
                            style={{ ...styles.button, ...styles.acceptButton }}
                            onClick={() => handleAccept(request.from.id)}
                        >
                            Accept
                        </button>
                        <button
                            style={{ ...styles.button, ...styles.declineButton }}
                            onClick={() => handleDecline(request.from.id)}
                        >
                            Decline
                        </button>
                    </li>
                ))}
            </ul>
            {snackbarVisible && <Snackbar message={successMessage} onClose={handleCloseSnackbar} />}
        </div>
    );
};

export default ConnectionRequestsPage;

// import React from "react";
// import api from "../../api";

// const SimplePostRequestPage = () => {
//     const sendPostRequest = async () => {
//         try {
//             const response = await api.post("http://localhost:4001/api/connection-requests", {
//                 toId: 13
//             });
//             console.log("Post request successful:", response.data);
//         } catch (err) {
//             console.error("Failed to send post request:", err.message);
//         }
//     };

//     return (
//         <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
//             <h1>Simple Post Request Page</h1>
//             <button onClick={sendPostRequest} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
//                 Send Post Request
//             </button>
//         </div>
//     );
// };

// export default SimplePostRequestPage;
