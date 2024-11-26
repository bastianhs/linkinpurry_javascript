import React from "react";

const ConnectionRequestList = ({ requests, onAccept, onReject }) => {
    return (
        <div>
        <ul>
            {requests.map(request => (
            <li key={request.id}>
                <span>{request.fromName}</span>
                <button onClick={() => onAccept(request.id)}>Accept</button>
                <button onClick={() => onReject(request.id)}>Reject</button>
            </li>
            ))}
        </ul>
        </div>
    );
};

export default ConnectionRequestList;
