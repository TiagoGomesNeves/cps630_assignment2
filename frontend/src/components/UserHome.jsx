import { useLocation } from 'react-router-dom';

function UserHome(){
    const location = useLocation();
    const { username } = location.state;
    
}

export default UserHome;