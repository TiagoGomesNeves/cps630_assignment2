import { useState } from "react";

function ChangePass({ username }){
    const [pass, setPass] = useState('');
    
    const changePass = async (e) => {
        e.preventDefault();

        try{
            const response = await fetch(`/api/password/${username}`,{
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({password: pass})
            })

            if (response.status === 200){
                alert("Password Updated");
                return;
            }else{
                alert("Error Occured: Password Not updated");
                return;
            }
        }catch(error){
            console.log("Error occured: ", error);
        }
    };


    return (
        <>
            <form onSubmit={changePass}>
                <input type="password" placeholder="Enter New Pass" onChange={(e) => setPass(e.target.value)} required></input>
                <button>Submit</button>
            </form>
        </>
    )

}

export default ChangePass;