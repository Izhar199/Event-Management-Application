import { useContext } from "react";
import { AuthContext } from '../context/AuthContext';
import './Navbar.scss';
const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="navbar">
            {/* <h2>Event Manager</h2> */}
            {true &&
                <button className="logout-btn" onClick={logout}>Logout</button>
            }
        </nav>
    );
};

export default Navbar;
