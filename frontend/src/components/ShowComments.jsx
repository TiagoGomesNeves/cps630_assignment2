import { useState, useEffect} from "react";

function ShowComments({id, username}){
    const [comments , setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const loadComments = async () =>{
        try{
            const response = await fetch(`/api/comments?postID=${encodeURIComponent(id)}`);
            const result = await response.json();
            setComments(result);
        }catch(error){
            console.log("No comments Found: " , error);
        }
    };

    const addComment = async (e) =>{
        e.preventDefault();
        try {
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    postId: id,
                    user: username,
                    content: newComment
                })
            });
            const result = await response.json();
            if (response.status === 201){
                alert("Comment Added");
                loadComments();
            }else{
                alert("Error When Adding Comment");
            }
        }catch(error){
            console.log("Error when Adding comment: ", error);
        }
    }

    useEffect(()=> {
        loadComments();
    }, [id]);

    if (comments.length === 0){
        return(
            <>
                <div className="no-comment-section">
                    <h2>No Comments</h2>
                </div>
                <div className="comment-input">
                    <input
                        type="text"
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        required
                    />
                    <button onClick={addComment}>Post</button>
                </div>
            </>
        )
    }


    return(
        <>
            <div className="comment-section">
                {comments.map(comment => {
                    return(
                        <div className="comment" key={comment._id}>
                            <span className="comment-user">{comment.user}:</span>
                            <span className="comment-content">{comment.content}</span>
                        </div>
                    )
                })}
                <div className="comment-input">
                <input
                    type="text"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                />
                <button onClick={addComment}>Post</button>
            </div>
            </div>
        </>
        
    )

}

export default ShowComments;