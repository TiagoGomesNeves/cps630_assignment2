import { useLocation } from 'react-router-dom';
import Nav from './Nav';

function UserHome() {
    const location = useLocation();
    const username = location.state; 
    console.log(username.username);
    
    return (
        <div >
            <Nav username={username.username} />
        </div>
    );
}

export default UserHome;