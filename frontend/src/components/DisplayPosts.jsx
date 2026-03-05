import { useState, useEffect, use} from "react";
import ShowComments from "./ShowComments";
import PostMenu from "./PostMenu";

function DisplayPosts({refresh, username}) {

    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState(false);

    const toggleComments = (id) => {
        if (comments === id) {
            setComments(null);
        } else {
            setComments(id);
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
        </>
    )
}

export default DisplayPosts