import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import Changepfp from './Changepfp'
import Changeuser from './Changeuser'
import ChangePass from './Changepass'
import DeleteUser from './DeleteUser'
import Nav from './Nav'


function Settings(){
    // Gets username passed to it by nav
    const location = useLocation();
    const [username, setUsername] = useState(location.state.username.toLowerCase());

    return(
        <>
            <Nav username={username}/>
            <div className="settings-page">
                <div className="settings-card">
                    <h1 className="settings-title">Account Settings</h1>
                    <p className="settings-subtitle">Manage your profile picture, username, password, and account actions.</p>

                    <div className="settings-sections">
                        <Changepfp username={username}/>
                        <Changeuser username={username} onUsernameChange={setUsername}/>
                        <ChangePass username={username}/>
                        <DeleteUser username={username}/>
                    </div>
                </div>
            </div>
        </>
    )

}

export default Settings;