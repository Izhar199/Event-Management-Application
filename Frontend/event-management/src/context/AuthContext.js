import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAdmin(true);
        }
    }, []);

    const login = async (username, password) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            localStorage.setItem('id', res.data.id);
            localStorage.setItem('token', res.data.token);
            setAdmin(true);
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAdmin(null);
        window.location.href = '/'
    };

    return (
        <AuthContext.Provider value={{ admin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
