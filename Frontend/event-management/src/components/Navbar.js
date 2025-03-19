import { useContext } from "react";
import { AuthContext } from '../context/AuthContext';
import './Navbar.scss';
const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    return (
        <nav className="navbar">
            {/* <h2>Event Manager</h2> */}
            {window.location.pathname !== '/dashboard' && <button className="logout-btn" onClick={() => window.location.href = '/dashboard'}>Return to Dashboard</button>}
            {user &&
                <button className="logout-btn" onClick={logout}>Logout</button>
            }
        </nav>
    );
};

export default Navbar;
