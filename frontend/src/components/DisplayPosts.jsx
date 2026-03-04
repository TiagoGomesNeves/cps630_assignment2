import { useState, useEffect, use} from "react";

function DisplayPosts(refresh) {

    const [posts, setPosts] = useState([]);

    const loadPosts = async () => {
        try{
            const response = await fetch('/api/posts');
            const result = await response.json();
            setPosts(response);
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

    )
}

export default DisplayPosts