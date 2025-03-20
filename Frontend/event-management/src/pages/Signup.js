import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "user", // Default role
    });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // await axios.post('http://localhost:5000/api/auth/signup', formData);
        setMessage(""); // Clear previous messages

        try {
            const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
            setMessage(response.data.message);
            navigate('/login');
        } catch (error) {
            setMessage(error.response?.data?.message || "Signup failed");
        }

    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Signup</h2>
            {message && <p>{message}</p>}
            <input
                type="text"
                name="name"
                placeholder="Enter name"
                value={formData.name}
                onChange={handleChange}
                required

            />
            <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required

            />
            <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required

            />
            <select name="role" value={formData.role} onChange={handleChange} style={styles.select} >
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>
            <button type="submit">Sign Up</button>
        </form>
    );
}
const styles = {

    select: { padding: "10px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "5px" },

    message: { color: "green" },
};
export default Signup;
