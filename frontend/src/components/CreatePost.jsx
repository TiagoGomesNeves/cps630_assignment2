import { useState } from 'react';

// Component for creating a new post
function CreatePost({ username, onPostCreated }){
    const [content, setcontent] = useState('');
    const [image, setImage] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setcontent('');
        setImage('');
    };

    // Handle the form submission to create a new post
    const create = async (e) =>{
        e.preventDefault();
        let user = null;

        // Get the profile picture for the post
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
        
        // Make API call to create a new post with the content, image, and user information
        try{
            const formData = new FormData();
            formData.append('user', username.toLowerCase());
            formData.append('content', content);
            formData.append('date', Date.now());
            formData.append('userpfp', user.pfp);
            if (image) formData.append('image', image);

            const response = await fetch('/api/posts', {
                method: 'POST',
                body: formData
            });

            if (response.status === 201){
                alert("Post Added Successfully");
                closeModal();
                if (onPostCreated) {
                    onPostCreated();
                }
                return;
            }else{
                alert("No Post Added Somethinng went wrong");
                return;
            }
        }catch(error){
            console.log("Error when creating post: ", error);
        }
    };

    return(
        <>
            <button className="create-post-fab" onClick={openModal}>Create Post</button>

            {isOpen && (
                <div className="create-post-backdrop" onClick={closeModal}>
                    <div className="create-post-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="create-post-header">
                            <h2>Create a Post</h2>
                            <button type="button" className="create-post-close" onClick={closeModal}>×</button>
                        </div>

                        <form onSubmit={create} className="create-post-form">
                            <textarea
                                className="create-post-textarea"
                                placeholder="Write Something..."
                                value={content}
                                onChange={(e) => setcontent(e.target.value)}
                                required
                            ></textarea>

                            <input
                                className="create-post-file"
                                type='file'
                                accept='image/*'
                                onChange={(e) => setImage(e.target.files[0])}
                            ></input>

                            <div className="create-post-actions">
                                <button type="button" className="create-post-cancel" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="create-post-submit">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default CreatePost;