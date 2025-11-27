import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
            setIsMenuOpen(false);
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

                <button className="navbar-toggle" onClick={toggleMenu}>
                    <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
                </button>

                <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
                    <Link to="/" className="navbar-link" onClick={() => setIsMenuOpen(false)}>Posts</Link>

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
                            <Link to={`/profile/${user._id}`} onClick={() => setIsMenuOpen(false)}>
                                <Button variant="ghost" size="sm">My Profile</Button>
                            </Link>
                            <Button variant="ghost" size="sm" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                                <Button variant="ghost" size="sm">Login</Button>
                            </Link>
                            <Link to="/register" onClick={() => setIsMenuOpen(false)}>
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
