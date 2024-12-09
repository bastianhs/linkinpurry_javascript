import React, { useState, useEffect, useCallback } from "react";

const styles = {
    feedPage: {
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
    },
    createPost: {
        marginBottom: "20px",
    },
    textarea: {
        width: "100%",
        height: "100px",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        resize: "none",
    },
    button: {
        marginTop: "10px",
        padding: "10px 20px",
        backgroundColor: "#0073b1",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    buttonHover: {
        backgroundColor: "#005582",
    },
    feedList: {
        marginTop: "20px",
    },
    feedItem: {
        backgroundColor: "white",
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        marginBottom: "10px",
    },
    feedHeader: {
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
    },
    profilePhoto: {
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        marginRight: "10px",
    },
    userName: {
        fontWeight: "bold",
        margin: "0",
    },
    postDate: {
        fontSize: "0.8em",
        color: "#777",
        margin: "0",
    },
    feedContent: {
        margin: "10px 0",
    },
    feedActions: {
        marginTop: "10px",
    },
    actionButton: {
        marginRight: "10px",
        padding: "5px 10px",
        backgroundColor: "#0073b1",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    actionButtonHover: {
        backgroundColor: "#005582",
    },
};

const FeedPage = () => {
    const [feeds, setFeeds] = useState([]);
    const [cursor, setCursor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [newPostContent, setNewPostContent] = useState("");
    const [currentUserId, setCurrentUserId] = useState(null);

    const fetchFeeds = useCallback(async () => {
        console.log("fetchFeeds called");
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const cursorQueryParams = cursor ? `cursor=${cursor}&` : "";
            const response = await fetch(`http://localhost:4001/api/feed?${cursorQueryParams}limit=10`, {
                credentials: "include",
            });
            const data = await response.json();
            const { feeds: newFeeds, cursor: newCursor, currentUserId: newCurrentUserId } = data.body;
            setFeeds((prevFeeds) => [...prevFeeds, ...newFeeds]);
            setCursor(newCursor);
            setHasMore(newCursor !== null);
            setCurrentUserId(newCurrentUserId);
        } catch (error) {
            console.error("Failed to fetch feeds", error);
        } finally {
            setLoading(false);
        }
    }, [cursor, loading, hasMore]);

    const handleCreatePost = async () => {
        if (newPostContent.length > 280) {
            alert("Post content exceeds 280 characters");
            return;
        }
        try {
            await fetch("http://localhost:4001/api/feed", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ content: newPostContent }),
            });
            setNewPostContent("");
            setFeeds([]);
            setCursor(null);
            setHasMore(true);
            fetchFeeds();
        } catch (error) {
            console.error("Failed to create post", error);
        }
    };

    const handleUpdatePost = async (postId, content) => {
        if (content === null) return;
        try {
            const response = await fetch(`http://localhost:4001/api/feed/${postId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ content }),
            });
            const updatedPost = await response.json();
            setFeeds((prevFeeds) =>
                prevFeeds.map((feed) => (feed.id === postId ? { ...feed, ...updatedPost.body } : feed))
            );
        } catch (error) {
            console.error("Failed to update post", error);
        }
    };

    const handleDeletePost = async (postId) => {
        console.log("delete post", postId);
        try {
            await fetch(`http://localhost:4001/api/feed/${postId}`, {
                method: "DELETE",
                credentials: "include",
            });
            setFeeds((prevFeeds) => prevFeeds.filter((feed) => feed.id !== postId));
            setNewPostContent("");
            setFeeds([]);
            setCursor(null);
            setHasMore(true);
            fetchFeeds();
        } catch (error) {
            console.error("Failed to delete post", error);
        }
    };

    const handleScroll = useCallback(() => {
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1) {
            fetchFeeds();
        }
    }, [fetchFeeds]);

    useEffect(() => {
        fetchFeeds();
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    return (
        <div style={styles.feedPage}>
            <h1>Feed Page</h1>
            <div style={styles.createPost}>
                <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    maxLength={280}
                    placeholder="What's on your mind?"
                    style={styles.textarea}
                />
                <button
                    onClick={handleCreatePost}
                    style={styles.button}
                    onMouseOver={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
                    onMouseOut={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
                >
                    Post
                </button>
            </div>
            <div style={styles.feedList}>
                {feeds.map(feed => (
                    feed && (
                        <div key={feed.id} style={styles.feedItem}>
                            {feed.user && (
                                <div style={styles.feedHeader}>
                                    <img src={feed.user.profile_photo_path || "/default-avatar.png"} alt="Profile" style={styles.profilePhoto} />
                                    <div>
                                        <p style={styles.userName}>{feed.user.full_name} (@{feed.user.username})</p>
                                        <p style={styles.postDate}>Posted on: {new Date(feed.created_at).toLocaleString()}</p>
                                        <p style={styles.postDate}>Updated on: {new Date(feed.updated_at).toLocaleString()}</p>
                                    </div>
                                </div>
                            )}
                            <p style={styles.feedContent}>{feed.content}</p>
                            {feed.user && feed.user.id === currentUserId && (
                                <div style={styles.feedActions}>
                                    <button
                                        onClick={() => {
                                            const newContent = prompt("Edit your post", feed.content);
                                            handleUpdatePost(feed.id, newContent);
                                        }}
                                        style={styles.actionButton}
                                        onMouseOver={(e) => e.target.style.backgroundColor = styles.actionButtonHover.backgroundColor}
                                        onMouseOut={(e) => e.target.style.backgroundColor = styles.actionButton.backgroundColor}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeletePost(feed.id)}
                                        style={styles.actionButton}
                                        onMouseOver={(e) => e.target.style.backgroundColor = styles.actionButtonHover.backgroundColor}
                                        onMouseOut={(e) => e.target.style.backgroundColor = styles.actionButton.backgroundColor}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    )
                ))}
            </div>
            {loading && <p>Loading...</p>}
        </div>
    );
};

export default FeedPage;
