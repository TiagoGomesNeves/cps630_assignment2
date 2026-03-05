import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import Nav from './Nav';
import DisplayPosts from './DisplayPosts';

function UserHome() {
    const [refresh, setRefresh] = useState(false);
    const location = useLocation();
    const username = location.state; 

    const changePosts = () => {
        setRefresh(prev => !prev)
    }
    
    return (
        <>
            <Nav username={username.username} />
            <DisplayPosts refresh={refresh} username={username.username}/>
            <button onClick={changePosts}></button>
        </>
    );
}

export default UserHome;