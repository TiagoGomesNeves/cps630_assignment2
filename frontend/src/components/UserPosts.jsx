import React, { useState, useEffect } from 'react';
import PostMenu from "./PostMenu";

function UserPosts({ username }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editPostId, setEditPostId] = useState(null);
    const [editContent, setEditContent] = useState("");

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

            if (response.status !== 200) {
                if (result && result.error) alert(result.error);
                else alert("Failed to edit post");
                return;
            }else{
                alert("Post has been updated");
            }

            setPosts(prev => {
                return prev.map(p => {
                    if (p._id === editPostId) return { ...p, content: result.content };
                    return p;
                });
            });
            closeEdit();
            
        } catch (err) {
            console.error(err);
            alert("Failed to edit post");
        }
    };

    const deletePost = async (postId) => {
        try {
            const response = await fetch(`/api/posts/${postId}`, {
                method: "DELETE",
                headers: { "x-username": username }
            });
            const result = await response.json();
            
            if (response.status === 200) {
                setPosts(prev => prev.filter(p => p._id !== postId));
                alert("Post has been deleted");
            } else {
                alert(result?.error || "Failed to delete post");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const response = await fetch(`/api/posts/search?username=${encodeURIComponent(username)}`);
                const result = await response.json();

                if (result){
                    setPosts(result);
                }
            } catch (error) {
                console.error("Error loading posts:", error);
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            loadPosts();
        }
    }, [username]);

    if (loading) return <div className="loading">Loading your posts...</div>;

    return (
        <div className="postContainer">
            {posts.length > 0 ? (
                posts.map(post => (
                    <div className="post-card" key={post._id}>
                        <PostMenu
                        postId={post._id}
                        postUser={post.user}
                        currentUsername={username}
                        onDelete={deletePost}
                        onEdit={openEdit}

                        />
                        <div className="post-header">
                            <img src={`/images/${post.userpfp}`} className="post-pfp" alt="pfp" />
                            <h3 className="post-username">{post.user}</h3>
                        </div>
                        <div className="post-content">
                            <p>{post.content}</p>
                            <div className='post-card-image'>
                            {post.image && <img src={`/images/${post.image}`} className="post-image" alt="post" />}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>No posts found for this user.</p>
            )}
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
        </div>
    );
}

export default UserPosts;