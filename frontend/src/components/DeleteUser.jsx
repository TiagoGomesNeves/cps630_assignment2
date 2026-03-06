import { useNavigate } from 'react-router-dom';

function DeleteUSer({ username }){
    const navigate = useNavigate();

    const deleteAccount = async (e) => {
        e.preventDefault();
        const confrim = window.confirm("Are you sure");

        if (!confirm){
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
            <button onClick={deleteAccount}>Delete Account</button>
        </>
    )
}

export default DeleteUSer;