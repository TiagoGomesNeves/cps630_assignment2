import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import Changepfp from './Changepfp'
import Changeuser from './Changeuser'
import ChangePass from './Changepass'
import DeleteUser from './DeleteUser'
import Nav from './Nav'


function Settings(){
    const location = useLocation();
    const [username, setUsername] = useState(location.state.username.toLowerCase());

    return(
        <>
            <Nav username={username}/>
            <Changepfp username={username}/>
            <Changeuser username={username} onUsernameChange={setUsername}/>
            <ChangePass username={username}/>
            <DeleteUser username={username}/>
        </>
    )

}

export default Settings;