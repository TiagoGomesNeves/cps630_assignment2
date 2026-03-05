import { useState } from 'react';


function CreatePost({username}){
    const [content, setcontent] = useState('');
    const [image, setImage] = useState('');
    console.log(username);

    
    const create = async (e) =>{
        e.preventDefault();
        let user = null;
        try{
            const response1 = await fetch(`/api/user?username=${encodeURIComponent(username)}`);
            user = await response1.json();

            if (response1.status === 404){
                alert("User not found, no Post Made");
                return;
            }
        }catch(error){
            console.log("Error finding User: ", error);
            return;
        }

        try{
            console.log(user)
            const formData = new FormData();
            formData.append('user', username);
            formData.append('content', content);
            formData.append('date', Date.now());
            formData.append('userpfp', user.pfp);
            if (image) formData.append('image', image);

            const response = await fetch('/api/posts', {
                method: 'POST',
                body: formData
            });

            if (response.status() === 200){
                alert("Post Added Successfully");
            }else{
                alert("No Post Added Somethinng went wrong");
            }
        }catch(error){
            console.log("Error when creating post: ", error);
        }
    };

    return(
        <>  
            <div className='post-form'>
                <h2>Create a Post</h2>
                <form onSubmit={create} className='post-form-container'>
                    <input type='text' placeholder='Write Something...' onChange={(e) => setcontent(e.target.value)}required></input>
                    <input type='file' accept='image/*' onChange={(e) => setImage(e.target.files[0])}></input>
                    <button>Submit</button>
                </form>
            </div>
        </>
    )
}

export default CreatePost;