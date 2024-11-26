import React, { useState, useEffect } from "react";
import ConnectionRequestList from "../../Components/Connection/ConnectionRequestList";
import axios from "axios";

const ConnectionRequestsPage = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        axios.get("/api/connection-requests").then(response => setRequests(response.data));
    }, []);

    const handleAccept = (requestId) => {
        axios.post(`/api/connection-requests`, {fromId: requestId, action: "accept"});
        setRequests(requests.filter(request => request.id !== requestId));
    };

    const handleReject = (requestId) => {
        axios.post(`/api/connection-requests`, {fromId: requestId, action: "reject"});
        setRequests(requests.filter(request => request.id !== requestId));
    };

    return (
        <ConnectionRequestList requests={requests} onAccept={handleAccept} onReject={handleReject} />
    );
};

export default ConnectionRequestsPage;
