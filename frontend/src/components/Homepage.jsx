import { Link } from "react-router-dom";

function Homepage(){
    return (
        <>
            <h1>Welcome, Sign in or Sign up</h1>
            <Link to="/login" className="link">Sign in</Link>
            <Link to='/register' className="link">Sign Up</Link>
        </>
    );
}

export default Homepage;