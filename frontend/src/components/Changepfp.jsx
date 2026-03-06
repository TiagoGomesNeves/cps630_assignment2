import { useState } from 'react';


function Changepfp({ username }){
    const [image, setImage] = useState('');

    const submitPfp = async (e) =>{
        e.preventDefault();
        try{
            const formData = new FormData();
            formData.append('user', username.toLowerCase());
            if (image) formData.append('image', image);

            const response = await fetch('/api/pfp', {
                method: 'PATCH',
                body: formData
            });

            if (response.status === 200){
                alert("Pfp has been updated");
                return;
            }else{
                alert("Pfp has not been updated soemthing went wrong");
                return;
            }

        }catch(error){
            console.log("Error Chaning Pfp: ", error);
        }
    };
    return(
        <>
            <form onSubmit={submitPfp}>
                <input type="file" accept="image/*" onChange={(e)=> setImage(e.target.files[0])}required></input>
                <button>Submit</button>
            </form>
        </>
    )
}

export default Changepfp;