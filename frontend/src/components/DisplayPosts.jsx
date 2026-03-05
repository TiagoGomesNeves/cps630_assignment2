import { useState, useEffect, use} from "react";
import ShowComments from "./ShowComments";
import PostMenu from "./PostMenu";

function DisplayPosts({refresh, username}) {

    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editPostId, setEditPostId] = useState(null);
    const [editContent, setEditContent] = useState("");

    const toggleComments = (id) => {
        if (comments === id) {
            setComments(null);
        } else {
            setComments(id);
        }
    };

    const openEdit = (postId) => {
        const post = posts.find(p => p._id === postId);
        if (!post) return;
        setEditPostId(postId);
        setEditContent(post.content || "");
        setIsEditOpen(true);
    };

    const closeEdit = () => {
        setIsEditOpen(false);
        setEditPostId(null);
        setEditContent("");
    };

    const saveEdit = async () => {
        if (!editPostId) return;

        try {
            const response = await fetch(`/api/posts/${editPostId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: editContent })
            });

            const result = await response.json();

            if (response.status === 200) {
                setPosts(prev =>
                    prev.map(p =>
                        p._id === editPostId
                            ? { ...p, content: result.content }
                            : p
                    )
                );
                closeEdit();
            } else {
                alert(result?.error || "Failed to edit post");
            }
        } catch (error) {
            console.error("Error editing post:", error);
            alert("Failed to edit post");
        }
    };

    const deletePost = async (postId) => {
        try {
            const response = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
            const result = await response.json();
            
            if (response.status === 200) {
                setPosts(prev => prev.filter(p => p._id !== postId));
            } else {
                alert(result.error);
            }
        } catch (error) {
            alert("Failed to delete post");
            console.error("Error deleting post:", error);
        }
    };

    const loadPosts = async () => {
        try{
            const response = await fetch('/api/posts');
            const result = await response.json();
            setPosts(result);
        }catch (error){
            console.error("Error When Loading Posts" , error);
        }
    };

    useEffect(()=> {
        loadPosts();
    }, [refresh]);

    if (posts.length === 0){
        return(
            <>
                <div className="no-posts">
                    <h2>Not Posts Available</h2>
                </div>
            </>
        )
    }

    return (
        <>
            <div className="postContainer">
                {posts.map(post => {
                    if (post.image){
                        return(
                            <div className="post-card" key={post._id}>
                                <PostMenu
                                postId={post._id}
                                postUser={post.user}
                                currentUsername={username}
                                onDelete={deletePost}
                                onEdit={openEdit}
                                />
                                <div className="post-header">
                                    <img 
                                        src={`/images/${post.userpfp}`}
                                        className="post-pfp"
                                    />
                                    <h3 className="post-username">{post.user}</h3>
                                    <span className="post-date">{new Date(post.date).toLocaleDateString()}</span>
                                </div>
                                <div className="post-content">
                                    <p>{post.content}</p>
                                    <div className="post-card-image"> 
                                    <img src={`/images/${post.image}`} className="post-image"/>
                                    </div>
                                </div>
                                <hr></hr>
                                <div className="post-footer">
                                    <button onClick={() => toggleComments(post._id)}>Comments</button>
                                    {comments === post._id && <ShowComments id={post._id} username={username}/>}
                                </div>
                            </div>
                        )
                    }else{
                        return(
                            <div className="post-card" key={post._id}>
                                <PostMenu
                                postId={post._id}
                                postUser={post.user}
                                currentUsername={username}
                                onDelete={deletePost}
                                onEdit={openEdit}
                                />
                                <div className="post-header">
                                    <img 
                                        src={`/images/${post.userpfp}`}
                                        className="post-pfp"
                                    />
                                    <h3 className="post-username">{post.user}</h3>
                                    <span className="post-date">{new Date(post.date).toLocaleDateString()}</span>
                                </div>
                                <div className="post-content">
                                    <p>{post.content}</p>
                                </div>
                                <hr></hr>
                                <div className="post-footer">
                                    <button onClick={() => toggleComments(post._id)}>Comments</button>
                                    {comments === post._id && <ShowComments id={post._id} username={username}/>}
                                </div>
                            </div>
                        )
                    }
                })}
            </div>
            {isEditOpen && (
                <div className="edit-modal-backdrop" onClick={closeEdit}>
                    <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
                    <h3 className="edit-modal-title">Edit post</h3>

                    <textarea
                        className="edit-modal-textarea"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                    />

                    <div className="edit-modal-actions">
                        <button type="button" className="edit-btn" onClick={closeEdit}>Cancel</button>
                        <button type="button" className="edit-btn edit-btn-primary" onClick={saveEdit}>Save</button>
                    </div>
                    </div>
                </div>
                )}
        </>
    )
}

export default DisplayPosts