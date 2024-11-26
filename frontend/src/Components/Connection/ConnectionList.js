import React from "react";

const ConnectionList = ({ connections, onUnconnect }) => {
    return (
        <div>
        <ul>
            {connections.map((connection) => (
            <li key={connection.id}>
                <img
                src={connection.profilePicture}
                alt={connection.name}
                width={50}
                height={50}
                />
                <span>{connection.name}</span>
                <button onClick={() => onUnconnect(connection.id)}>Unconnect</button>
            </li>
            ))}
        </ul>
        </div>
    );
};

export default ConnectionList;
