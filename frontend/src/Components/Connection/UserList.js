import React, { useState } from "react";

const UserList = ({ users, onSendRequest }) => {
    const [search, setSearch] = useState("");

    // Filter users by search term (case-insensitive, substring matching)
    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
        <input
            type="text"
            placeholder="Search users"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
        />
        <ul>
            {filteredUsers.map((user) => (
            <li key={user.id} style={{ marginBottom: "1rem" }}>
                <img
                    src={user.profilePicture}
                    alt={user.name}
                    width={50}
                    height={50}
                    style={{ borderRadius: "50%", marginRight: "1rem" }}
                />
                <span>{user.name}</span>
                {!user.isConnected && (
                <button
                    onClick={() => onSendRequest(user.id)}
                    style={{ marginLeft: "1rem" }}
                >
                    Connect
                </button>
                )}
            </li>
            ))}
        </ul>
        </div>
    );
};

export default UserList;
