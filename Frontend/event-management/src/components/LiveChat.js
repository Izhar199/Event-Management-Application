import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { FaComments, FaTimes } from "react-icons/fa";

const socket = io("http://localhost:5000", {
    transports: ["websocket", "polling"], // Ensure WebSocket connection
    withCredentials: true,
});

const LiveChat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [isOpen, setIsOpen] = useState(false); // Toggle chat window
    console.log(messages, 'lllllllllllllll')
    useEffect(() => {
        socket.on("receiveMessage", (newMessage) => {
            console.log("✅ New message received:", newMessage);
            setMessages((prev) => [...prev, newMessage]);
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, []);

    const sendMessage = () => {
        if (message.trim()) {
            socket.emit("sendMessage", message);
            setMessage("");
        }
    };

    return (
        <>
            {/* Floating Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    background: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)"
                }}
            >
                {isOpen ? <FaTimes size={20} /> : <FaComments size={20} />}
            </button>

            {/* Chat Box */}
            {isOpen && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "80px",
                        right: "20px",
                        width: "300px",
                        background: "white",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                        padding: "10px",
                        zIndex: 999999
                    }}
                >
                    <h3>Live Chat</h3>
                    <div style={{ height: "200px", overflowY: "auto", border: "1px solid #ddd", padding: "5px" }}>
                        {messages.map((msg, index) => (
                            <p key={index} style={{ background: "#f1f1f1", padding: "5px", borderRadius: "5px" }}>
                                {msg}
                            </p>
                        ))}
                    </div>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        style={{ width: "80%", padding: "5px", marginTop: "5px" }}
                    />
                    <button
                        onClick={sendMessage}
                        style={{
                            padding: "5px",
                            marginLeft: "5px",
                            background: "blue",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        Send
                    </button>
                </div >
            )}
        </>
    );
};

export default LiveChat;
