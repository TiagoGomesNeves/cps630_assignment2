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
                navigate('/home', { state: { username: user.username } });
            }
            else if ( response.status === 401){
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

    return(

        <>
            <div>
                <h2>Enter your Username and Password</h2>
                <form onSubmit={submission}>
                    <input 
                        type="text"
                        name="username"
                        placeholder='Enter Username'
                        value={formData.username}
                        onChange={change}
                        required
                    ></input>
                    <input 
                        type="password"
                        name="password"
                        placeholder='Enter Username'
                        value={formData.password}
                        onChange={change}
                        required
                    ></input>
                    <button type='Submit'>Sign In</button>
                </form>

            </div>
        </>
    )
}
export default Login;