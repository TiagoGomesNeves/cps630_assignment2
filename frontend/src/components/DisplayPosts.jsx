import { useState, useEffect, use} from "react";

function DisplayPosts({refresh}) {

    const [posts, setPosts] = useState([]);

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
                                    <img src={`/images/${post.image}`} className="post-image"/>
                                </div>
                            </div>
                        )
                    }else{
                        return(
                            <div className="post-card" key={post._id}>
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
                            </div>
                        )
                    }
                })}
            </div>
        </>
    )
}

export default DisplayPosts