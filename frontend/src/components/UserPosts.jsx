import React, { useState, useEffect } from 'react';

function UserPosts({ username }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const response = await fetch('/api/posts');
                const result = await response.json();

                if (Array.isArray(result)) {
                    const filtered = result.filter(p => p.user === username);
                    setPosts(filtered);
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
                        <div className="post-header">
                            <img src={`/images/${post.userpfp}`} className="post-pfp" alt="pfp" />
                            <h3 className="post-username">{post.user}</h3>
                        </div>
                        <div className="post-content">
                            <p>{post.content}</p>
                            {post.image && <img src={`/images/${post.image}`} className="post-image" alt="post" />}
                        </div>
                    </div>
                ))
            ) : (
                <p>No posts found for this user.</p>
            )}
        </div>
    );
}

export default UserPosts;