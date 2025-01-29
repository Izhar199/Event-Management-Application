import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from "./context/AuthContext";
import './index.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <Router>
//     <Routes>
//       <Route path="/" element={<App />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/signup" element={<Signup />} />
//       <Route path="/dashboard" element={<Dashboard />} />
//     </Routes>
//   </Router>,
//   document.getElementById('root')
// );
root.render(
    <React.StrictMode>
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </Router>
        </AuthProvider>
    </React.StrictMode>
);