import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login(){
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const submission = async (e) => {
        e.preventDefault();

        const user = {
            username: formData.username,
            password: formData.password
        };

        try{
            const response = await fetch(`/api/user/search?username=${encodeURIComponent(user.username)}&password=${encodeURIComponent(user.password)}`);
            const result = await response.json();

            if(response.status === 200){
                alert("Logged In Successfully");
                setFormData({username: '', password: ''})
                navigate('/home', { state: { username: user.username.toLowerCase() } });
            }
            else{
                alert('Wrong Username or Password');
                setFormData({username: '', password: ''});
            }

        }catch (error){
            console.error('Error Finding User: ', error)
        }
    };

    const change = (e) =>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
            <h2 className="auth-title">Sign in</h2>

            <form className="auth-form" onSubmit={submission}>
                <input
                className="auth-input"
                type="text"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={change}
                required
                />

                <input
                className="auth-input"
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={change}
                required
                />

                <button className="auth-btn" type="submit">Sign in</button>
            </form>
            </div>
        </div>
    );
}
export default Login;