import { useEffect, useRef, useState } from "react";

function PostMenu({ postId, postUser, currentUsername, onDelete, onEdit }) {
    // State to track whether the dropdown menu is open or closed
    const [open, setOpen] = useState(false);
    // track if user clicks outside menu
    const menuRef = useRef(null);

    //Checks if current user is owner of post
    const isOwner =
        (postUser || "").toLowerCase() ===
        (currentUsername || "").toLowerCase();

    if (!isOwner) return null;

    // Tracks if user clicks outside menu
    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handler);

        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Opens edit menu
    const handleEdit = () => {
        setOpen(false);
        if (onEdit) onEdit(postId);
    };

    //opens Delete menu
    const handleDelete = () => {
        setOpen(false);
        if (onDelete) onDelete(postId);
    };

    return (
        <div className="post-menu" ref={menuRef}>
            <button
                type="button"
                className="post-menu-btn"
                aria-label="Post options"
                onClick={() => setOpen((v) => !v)}
            >
                ⋯
            </button>

            {open && (
                <div className="post-menu-dropdown">
                    <button type="button" className="post-menu-item" onClick={handleEdit}>
                        Edit
                    </button>
                    <button type="button" className="post-menu-item" onClick={handleDelete}>
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}

export default PostMenu;