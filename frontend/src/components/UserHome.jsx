import { useLocation } from 'react-router-dom';
import Nav from './Nav';

function UserHome() {
    const location = useLocation();
    const username = location.state; 
    
    return (
        <div >
            <Nav username={username} />
        </div>
    );
}

export default UserHome;