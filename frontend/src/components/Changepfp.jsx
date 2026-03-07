import { useState } from 'react';

// Component for changing user profile picture
function Changepfp({ username }){
    
    const [image, setImage] = useState('');

    
    const submitPfp = async (e) =>{
        e.preventDefault();

        // Make API call to update the profile picture
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
            <div className="settings-section">
                <div className="settings-section-header">
                    <h2 className="settings-section-title">Change Profile Picture</h2>
                    <p className="settings-section-text">Upload a new image for your profile.</p>
                </div>

                <form className="settings-form settings-form-file" onSubmit={submitPfp}>
                    <input className="settings-file-input" type="file" accept="image/*" onChange={(e)=> setImage(e.target.files[0])} required></input>
                    <button className="settings-btn">Submit</button>
                </form>
            </div>
        </>
    )
}

export default Changepfp;