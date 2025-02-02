import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const { admin, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    if (!admin) return <h2>Access Denied. Please Login.</h2>;

    return (
        <div>
            <h1>Admin Dashboard</h1>
            {/* <button onClick={() => { logout(); navigate('/'); }}>Logout</button> */}
            <button onClick={() => { navigate('/events'); }}>Events</button>
        </div>
    );
}

export default Dashboard;
