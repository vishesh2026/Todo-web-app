import React, { useContext } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import TokenContext from '../../context/TokenContext.js';
import './header.css';

function Header() {
    const { userToken, user, tokenDispatch, userDispatch } = useContext(TokenContext);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("authToken");
        tokenDispatch({ type: "UNSET_TOKEN" });
        userDispatch({ type: "UNSET_USER" });
        navigate("/login");
    };

    return (
        <div>
            <nav className='header'>
                <div className="header-content">
                    <div className="logo">
                        <NavLink to="/">📝 Todo App</NavLink>
                    </div>
                    <div className='header-actions'>
                        {userToken ? (
                            <div className='user-section'>
                                <span className='user-name'>
                                    Hello, <strong>{user.name}</strong>
                                    {!user.isVerified && (
                                        <span className="unverified-badge">Unverified</span>
                                    )}
                                </span>
                                <button onClick={logout} className="btn-logout">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <ul className='nav-links'>
                                <li><NavLink to="/login">Login</NavLink></li>
                                <li><NavLink to="/register">Register</NavLink></li>
                            </ul>
                        )}
                    </div>
                </div>
            </nav>
            <Outlet />
        </div>
    );
}

export default Header;