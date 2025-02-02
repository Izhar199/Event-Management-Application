import { useContext } from "react";
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { admin, logout } = useContext(AuthContext);

    return (
        <nav>
            {/* <h2>Event Manager</h2> */}
            {admin &&
                <button onClick={logout}>Logout</button>
            }
        </nav>
    );
};

export default Navbar;
