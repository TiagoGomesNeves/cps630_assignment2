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

    return(

        <>
            <div>
                <h2>Enter a Username and Password</h2>
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
                    <button type='Submit'>Create Account</button>
                </form>

            </div>
        </>
    )
}

export default Register;