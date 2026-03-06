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
            <div className="settings-section">
                <div className="settings-section-header">
                    <h2 className="settings-section-title">Change Password</h2>
                    <p className="settings-section-text">Choose a new password for your account.</p>
                </div>

                <form className="settings-form settings-form-row" onSubmit={changePass}>
                    <input className="settings-input" type="password" placeholder="Enter New Pass" onChange={(e) => setPass(e.target.value)} required></input>
                    <button className="settings-btn">Submit</button>
                </form>
            </div>
        </>
    )

}

export default ChangePass;