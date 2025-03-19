import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LiveChat from "../components/LiveChat";
import Navbar from '../components/Navbar';
import './Dashboard.scss';
function Dashboard() {
    // const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const user = localStorage.getItem('user');
    if (!user) return <h2>Access Denied. Please Login.</h2>;

    return (
        <div>
            <Navbar />
            <h1>Dashboard</h1>
            <LiveChat></LiveChat>
            <button className='events-btn' onClick={() => { navigate('/events'); }}>Events</button>
        </div>
    );
}

export default Dashboard;
