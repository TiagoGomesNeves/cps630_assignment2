import { Link } from "react-router-dom";

function Homepage(){
    return (
        <div className="auth-page">
        <div className="auth-card">
            <h1 className="auth-title">Welcome</h1>
            <p className="auth-subtitle">Sign in or create an account to continue</p>

            <div className="auth-actions">
            <Link to="/login" className="auth-link-btn">Sign in</Link>
            <Link to="/register" className="auth-link-btn auth-link-secondary">  Sign up</Link>
            </div>
        </div>
        </div>
    );
    }
export default Homepage;