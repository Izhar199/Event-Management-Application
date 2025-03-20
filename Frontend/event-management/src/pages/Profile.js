import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import './Profile.scss';
const Profile = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user?.email, 'uuuu')
    return (
        <div className="App">
            <Navbar />
            <div className="profile-container">
                <h1 className="header">Profile Page</h1>
                <div className="profile-card">
                    <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`} alt="User Avatar" className="profile-avatar" />
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                    {/* <p><strong>Joined:</strong> {user.joined}</p> */}
                </div>
            </div>
        </div>
    );
};

export default Profile;
