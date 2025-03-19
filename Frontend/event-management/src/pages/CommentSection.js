import React, { useState, useEffect } from "react";
import axios from "axios";

const CommentSection = ({ eventId, user }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isOpen, setIsOpen] = useState(false); // Toggle State
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (isOpen) {
            axios.get(`http://localhost:5000/api/events/${eventId}/comments`)
                .then((res) => setComments(res.data))
                .catch((err) => console.error("Error fetching comments:", err));
        }
    }, [eventId, isOpen]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            const response = await axios.post(
                `http://localhost:5000/api/events/${eventId}/comments`,
                { text: newComment },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setComments([...comments, response.data.comment]);
            setNewComment("");
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    return (
        <div className="comment-container">
            <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? "Hide Comments" : "Show Comments"}
            </button>

            {isOpen && (
                <div className="comment-section">
                    <h4>Comments</h4>
                    <div className="comments-list">
                        {comments.length > 0 ? comments.map((comment, index) => (
                            <p key={index}><strong>{comment.name}:</strong> {comment.text}</p>
                        )) : <p>No comments yet.</p>}
                    </div>

                    {user.role === 'user' && (
                        <div className="comment-input">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                style={{ width: "90%" }}
                            />
                            <button onClick={handleAddComment}>Add</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CommentSection;
