import React from 'react';
import { Link } from 'react-router-dom';

const Nav = ({ username }) => {
    return (
        <header className="main-header">
            <nav className="navbar">
                <ul className="nav-list">
                    <li><Link to="/home" state={{  username }}>Home</Link></li>
                    <li><Link to="/profile" state={{username }}>Profile</Link></li>
                    <li><Link to="/search" state={{  username }}>Search</Link></li>
                </ul>
            </nav>
        </header>
    );
}

export default Nav;