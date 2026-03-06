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
            <form onSubmit={changeName}>
                <input type="text" placeholder="Enter New Name" onChange={(e) => setName(e.target.value)} required></input>
                <button>Submit</button>
            </form>
        </>
    )
}

export default ChangeUser;
