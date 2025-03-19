import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null); // Store user role
    const [token, setToken] = useState(localStorage.getItem("token") || "");

    useEffect(() => {
        if (token) {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            setUser(storedUser);
            setRole(storedUser?.role);
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("id", data.id);
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify({ email, role: data.role }));
                setToken(data.token);
                setUser({ email });
                setRole(data.role);
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error("Login error:", err);
        }
    };
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setRole(null);
        setToken("");
        window.location.href = '/'
    };

    return (
        <AuthContext.Provider value={{ user, role, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
