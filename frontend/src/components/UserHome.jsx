import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import Nav from './Nav';
import DisplayPosts from './DisplayPosts';
import CreatePost from './CreatePost'

function UserHome() {
    const [refresh, setRefresh] = useState(false);
    const location = useLocation();
    const username = location.state; 

    //When a Post is created refresh the posts on screen
    const changePosts = () => {
        setRefresh(prev => !prev)
    }
    
    return (
        <>
            <Nav username={username.username} />
            <br></br>
            <br></br>
            <div className='user-container'>
                <DisplayPosts refresh={refresh} username={username.username}/>
                <CreatePost username={username.username} onPostCreated={changePosts}/>
            </div>
            <button onClick={changePosts}>New Posts</button>
        </>
    );
}

export default UserHome;