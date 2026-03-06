import { useNavigate } from 'react-router-dom';

function DeleteUSer({ username }){
    const navigate = useNavigate();

    const deleteAccount = async (e) => {
        e.preventDefault();
        const confrim = window.confirm("Are you sure");
        if (!confrim){
            alert("Account Not Deleted");
            return;
        }

        try{
            const response = await fetch(`/api/user/${username}`, {
                method: "DELETE"
            });

            if(response.status === 204){
                alert("Account Deleted");
                navigate('/');
                return;
            }else{
                alert("Account Deletion Failed");
                return;
            }
        }catch(error){
            console.log("Error with deleting account: ", error);
        }
    }
    return(
        <>
            <div className="settings-section settings-section-danger">
                <div className="settings-section-header">
                    <h2 className="settings-section-title">Delete Account</h2>
                    <p className="settings-section-text">Permanently remove your account from the platform.</p>
                </div>

                <button className="settings-btn settings-btn-danger" onClick={deleteAccount}>Delete Account</button>
            </div>
        </>
    )
}

export default DeleteUSer;