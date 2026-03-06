import { useState } from "react";

function ChangeUser({ username, onUsernameChange }){
    const [name, setName] = useState('');

    const changeName = async (e) => {
        e.preventDefault();

        try{
            const response = await fetch(`/api/username/${username}`,{
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({username: name.toLowerCase()})
            })

            if (response.status === 200){
                alert("Username Updated");
                onUsernameChange(name.toLowerCase());
                return;
            }else{
                alert("Error Occured: Username Not updated");
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
                    <h2 className="settings-section-title">Change Username</h2>
                    <p className="settings-section-text">Enter a new username for your account.</p>
                </div>

                <form className="settings-form settings-form-row" onSubmit={changeName}>
                    <input className="settings-input" type="text" placeholder="Enter New Name" onChange={(e) => setName(e.target.value)} required></input>
                    <button className="settings-btn">Submit</button>
                </form>
            </div>
        </>
    )
}

export default ChangeUser;