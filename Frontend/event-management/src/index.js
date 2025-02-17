import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import { AuthProvider } from "./context/AuthContext";
import Favorites from "./pages/Favorite";
import Navbar from "./components/Navbar";
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
                    <Route path="/events" element={<Events />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/favorites" element={<Favorites />} />
                </Routes>
            </Router>
        </AuthProvider>
    </React.StrictMode>
);