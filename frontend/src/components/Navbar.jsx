import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/" className="navbar-brand">
                    <span className="gradient-text">Zee App</span>
                </Link>

                <div className="navbar-menu">
                    <Link to="/" className="navbar-link">Posts</Link>

                    {user ? (
                        <>
                            <div className="navbar-user">
                                {user.avatar && (
                                    <img
                                        src={user.avatar}
                                        alt={user.username}
                                        className="navbar-avatar"
                                    />
                                )}
                                <span className="navbar-username">{user.username}</span>
                            </div>
                            <Link to={`/profile/${user._id}`}>
                                <Button variant="ghost" size="sm">My Profile</Button>
                            </Link>
                            <Button variant="ghost" size="sm" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="ghost" size="sm">Login</Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="primary" size="sm">Register</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
