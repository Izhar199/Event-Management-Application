import React from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import './styles/App.scss';
import Navbar from "./components/Navbar";
const App = () => {
    const navigate = useNavigate();

    return (
        <div className="app-container">
            <h1 className="app-title">Welcome to Event Management App</h1>
            <p className="app-description">Manage your events seamlessly with our platform.</p>
            <div className="button-group">
                <button className="btn login" onClick={() => navigate("/login")}>
                    Login
                </button>
                <button className="btn signup" onClick={() => navigate("/signup")}>
                    Signup
                </button>
            </div>
        </div>
    );
};


export default App;