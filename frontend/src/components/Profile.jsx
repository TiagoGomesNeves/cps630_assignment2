import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Nav from './Nav';
import UserPosts from './UserPosts';

function Profile() {
    const location = useLocation();
    const username = location.state?.username;
    const [pfp, setPfp] = useState("");
    
    useEffect(() => {
        if (username) {
            fetch(`/api/user/pfp/${username}`)
                .then(res => res.json())
                .then(data => {
                    if (data.pfp) setPfp(data.pfp);
                })
                .catch(err => console.error("Fetch error:", err));
        }
    }, [username]);

    return (
        <div>
            <div className="profile-card">
                <Nav username={username} pfp={pfp} />
                {pfp && <img src={`/images/${pfp}`} alt="Profile" className="profile-pfp" />}
                <p className="profile-info">{username}</p>
            </div>

            <hr />
            <h3>Your Posts</h3>
            <UserPosts username={username} />
        </div>
    );
}

export default Profile;