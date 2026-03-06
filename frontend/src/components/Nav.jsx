import React from 'react';
import { Link } from 'react-router-dom';

const Nav = ({ username }) => {
    return (
        <header className="main-header">
            <nav className="navbar">
                <ul className="nav-list">
                    <li><Link to="/home" state={{  username }} className="nav-item">
                    <img src="/images/home.png" alt="Home Icon" className="nav-icon" />
                    Home</Link></li>
                    <li><Link to="/profile" state={{username }} className="nav-item">
                    <img src="/images/person.webp" alt="Person Icon" className="nav-icon" />
                    Profile</Link></li>
                    <li><Link to="/search" state={{  username }} className="nav-item">
                    <img src="/images/search.webp" alt="Search Icon" className="nav-icon" />
                    Search</Link></li>
                    <li className="nav-logout"><Link to="/">Sign Out</Link></li>
                </ul>
            </nav>
        </header>
    );
}

export default Nav;