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
                            <div className="Post-Card" key={post._id}>
                                <div>
                                </div>
                                <p>{post.content}</p>
                                <img src={`images/${post.image}`} />
                                <p>{post.date}</p>
                                <p>{post.user}</p>
                            </div>
                        )
                    }else{
                        return(
                            <div className="Post-Card" key={post._id}>
                                <p>{post.content}</p>
                                <p>{post.date}</p>
                                <p>{post.user}</p>
                            </div>
                        )
                    }
                })}
            </div>
        </>
    )
}

export default DisplayPosts