import { useLocation } from 'react-router-dom';
import Nav from './Nav'

function UserHome(){
    const location = useLocation();
    const { username } = location.state;
    
    return(
        <>
           
        </>
    )
}

export default UserHome;