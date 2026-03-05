import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Register(){
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const submission = async (e) => {
        e.preventDefault();

        const newUser = {
            username: formData.username,
            password: formData.password
        };

        try{
            console.log(newUser);
            const response = await fetch('/api/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(newUser)
            });
            console.log("Here");
            const result = await response.json();

            if(response.status === 201){
                alert("Account Created Successfully");
                setFormData({username: '', password: ''})
                navigate('/home', { state: { username: newUser.username } });
            }
            else if ( response.status === 400){
                alert('Username in use');
                setFormData({username: '', password: ''});
            }

        }catch (error){
            console.error('Error Adding User: ', error)
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
            <h2 className="auth-title">Create account</h2>

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

                <button className="auth-btn" type="submit">Create account</button>
            </form>
            </div>
        </div>
        );
    }

export default Register;