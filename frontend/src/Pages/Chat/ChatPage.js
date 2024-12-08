import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import ChatList from "../../Components/Chat/ChatList";
import ChatWindow from "../../Components/Chat/ChatWindow";
import NewChat from "../../Components/Chat/NewChat";
import { useAuth } from "../../Context/authContext";

const ChatPage = () => {
	const styles = {
		chatPage: {
			display: "flex",
			height: "100vh",
			backgroundColor: "#f3f2ef",
		},
		sidebar: {
			width: "320px",
			backgroundColor: "#fff",
			display: "flex",
			flexDirection: "column",
			borderRight: "1px solid #e0e0e0",
		},
		main: {
			flex: 1,
			display: "flex",
			flexDirection: "column",
			backgroundColor: "#fff",
		},
		chatWindow: {
			display: "flex",
			flexDirection: "column",
			height: "100%",
		},
		header: {
			padding: "16px",
			borderBottom: "1px solid #e0e0e0",
			backgroundColor: "#fff",
		},
		headerTitle: {
			fontSize: "16px",
			fontWeight: "600",
			color: "rgba(0, 0, 0, 0.9)",
		},
		messageList: {
			flex: 1,
			overflowY: "auto",
			padding: "16px",
		},
		message: {
			marginBottom: "12px",
			maxWidth: "70%",
		},
		sent: {
			marginLeft: "auto",
			backgroundColor: "#0a66c2",
			color: "#fff",
			padding: "12px 16px",
			borderRadius: "16px 16px 0 16px",
		},
		received: {
			backgroundColor: "#f3f2ef",
			color: "rgba(0, 0, 0, 0.9)",
			padding: "12px 16px",
			borderRadius: "16px 16px 16px 0",
		},
		timestamp: {
			fontSize: "11px",
			marginTop: "4px",
			opacity: 0.7,
		},
	};

	const [user,setUser]=useState(null);
	const [socket, setSocket] = useState(null);
	const [chats, setChats] = useState([]);
	const [activeChat, setActiveChat] = useState(null);
    const [chatList,setChatList]=useState([]);
	const [messages, setMessages] = useState([]);
	const [connections, setConnections] = useState([]);
    const [toUser,setToUser]=useState(null);

    
	useEffect(() => {
		const newSocket = io("http://localhost:4001", {
			transports: ["websocket"],
			withCredentials:true,
		});

		newSocket.on("connect", () => {
			console.log("Connected to WebSocket server");
		});

		newSocket.on("message", (message) => {
            message = message.message;
            console.log("MESSAGE: ", message);
            const formattedMessages = {
				id: message.id,
				from_id: message.from_id,
				to_id: message.to_id,
				message: message.message,
				timestamp: new Date(message.timestamp),
				isSender: message.from_id === user,
			};
            console.log("SINI")
            console.log(toUser);
            console.log(formattedMessages.to_id);
			if (message.to_id === formattedMessages.to_id) {
				setMessages((prev) => [...prev, formattedMessages]);
                
			}else if (message.from_id === formattedMessages.from_id){
                setMessages((prev) => [...prev, formattedMessages]);
            }
			fetchChats();
            // fetchMessages(activeChat?.messages ? activeChat.messages[0].otherUser.id :[]);
		});
		fetchConnections();
		fetchChats();
		newSocket.on("error", (error) => {
			console.error("Socket error:", error);
		});
		setSocket(newSocket);

		return () => newSocket.disconnect();
	}, []);

	useEffect(() => {
		console.log("ACTIVE CHAT: ", toUser);
        
		if (toUser) {
			fetchMessages(toUser.id);
		}
	}, [toUser]);

	const fetchChats = async () => {
		try {
			const response = await fetch("http://localhost:4001/api/chats", {
                credentials:'include',
			});
			const data = await response.json();
            setChatList(data.chats);
            setUser(data.userId);
            // console.log("CHATLIST: ", data.chats);
            
		} catch (error) {
			console.error("Error fetching chats:", error);
		}
	};

	const fetchMessages = async (to_id) => {
		try {
			console.log("TO ID: ", to_id);
			const response = await fetch(`http://localhost:4001/api/chats/messages`, {
				method: "POST",
                credentials:'include',
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					to_userId: to_id,
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
            setUser(data.userId);

			
			const formattedMessages = data.messages.map((msg) => ({
				id: msg.id,
				from_id: msg.from_id,
				to_id: msg.to_id,
				message: msg.message,
				timestamp: new Date(msg.timestamp),
				isSender: msg.from_id === user?.userId,
			}));

			setMessages(formattedMessages);
            // console.log("MESSAGES: ", messages);
		} catch (error) {
			console.error("Error fetching messages:", error);
		}
	};

	const fetchConnections = async () => {
		try {
			const response = await fetch("http://localhost:4001/api/connections/user", {
				credentials:'include',
			});
			const data = await response.json();
			// console.log(data.data);
			setConnections(data.data);
		} catch (error) {
			console.error("Error fetching connections:", error);
		}
	};

	const handleSendMessage = (message) => {
		if (socket && toUser) {
			socket.emit("message", {
				to_id: toUser.id,
				message,
			});
            console.log("message: ", message);
            fetchMessages(toUser.id);
		}
	};

	const handleStartChat = async (selectedUser) => {
		try {
            console.log("SELECTED USER: ", selectedUser);
			const response = await fetch("http://localhost:4001/api/chats", {
				method: "POST",
                credentials:'include',
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					to_id: selectedUser.id, 
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const newChat = await response.json();
            console.log("NEW CHAT: ", newChat);
			setChatList((prev) => {
                // console.log("PREV: ", prev);
				if (!prev.find((chat) => chat.to_id === newChat.to_id)) {
					return [...prev, newChat];
				}
				return prev;
			});
            setToUser(selectedUser);
            fetchChats();
			// setActiveChat(newChat);
		} catch (error) {
			console.error("Error creating chat:", error);
		}
	};

	return (
		<div style={styles.chatPage}>
			<div style={styles.sidebar}>
				<NewChat connections={connections} onStartChat={handleStartChat} />
				<ChatList
					chats={chatList}
					activeChat={toUser}
					onSelectChat={setToUser}
                    user = {user}
				/>
			</div>
			<div style={styles.main}>
				<ChatWindow
					messages={messages}
					activeChat={toUser}
					onSendMessage={handleSendMessage}
                    user={user}
				/>
			</div>
		</div>
	);
};

export default ChatPage;
