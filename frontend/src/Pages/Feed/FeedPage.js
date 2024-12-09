import React, { useState, useEffect, useCallback } from "react";
import api from "../../Utils/api";

const FeedPage = () => {
	const [feeds, setFeeds] = useState([]);
	const [cursor, setCursor] = useState(null);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [newPostContent, setNewPostContent] = useState("");
	const [currentUserId, setCurrentUserId] = useState(null);

	const styles = {
		container: {
			maxWidth: "680px",
			margin: "0 auto",
			padding: "24px 16px",
			backgroundColor: "#f3f2ef",
			minHeight: "100vh",
			"@media (max-width: 768px)": {
				padding: "16px",
			},
		},
		createPostCard: {
			backgroundColor: "white",
			borderRadius: "8px",
			padding: "24px",
			marginBottom: "16px",
			boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
		},
		textareaWrapper: {
			position: "relative",
		},
		textarea: {
			width: "100%",
			minHeight: "96px",
			padding: "12px",
			border: "1px solid rgba(0,0,0,0.08)",
			borderRadius: "4px",
			fontSize: "16px",
			resize: "none",
			outline: "none",
			marginBottom: "8px",
		},
		charCount: {
			position: "absolute",
			right: "12px",
			bottom: "24px",
			fontSize: "12px",
			color: "rgba(0,0,0,0.6)",
		},
		postButton: {
			padding: "6px 16px",
			backgroundColor: "#0a66c2",
			color: "white",
			border: "none",
			borderRadius: "16px",
			fontSize: "16px",
			fontWeight: "600",
			cursor: "pointer",
			transition: "background-color 0.2s",
		},
		postButtonDisabled: {
			backgroundColor: "rgba(0,0,0,0.08)",
			cursor: "not-allowed",
		},
		feedList: {
			display: "flex",
			flexDirection: "column",
			gap: "8px",
		},
		feedCard: {
			backgroundColor: "white",
			borderRadius: "8px",
			padding: "24px",
			boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
		},
		postHeader: {
			display: "flex",
			gap: "12px",
			marginBottom: "16px",
		},
		avatar: {
			width: "48px",
			height: "48px",
			borderRadius: "50%",
			objectFit: "cover",
		},
		userInfo: {
			flex: 1,
		},
		userName: {
			fontSize: "16px",
			fontWeight: "600",
			color: "rgba(0,0,0,0.9)",
			marginBottom: "4px",
		},
		userUsername: {
			fontSize: "14px",
			color: "rgba(0,0,0,0.6)",
			marginBottom: "4px",
		},
		postTime: {
			fontSize: "12px",
			color: "rgba(0,0,0,0.6)",
		},
		postContent: {
			fontSize: "14px",
			lineHeight: "1.5",
			color: "rgba(0,0,0,0.9)",
			marginBottom: "16px",
			whiteSpace: "pre-wrap",
			wordBreak: "break-word",
		},
		actionButtons: {
			display: "flex",
			gap: "8px",
		},
		actionButton: {
			padding: "6px 16px",
			backgroundColor: "transparent",
			border: "1px solid rgba(0,0,0,0.6)",
			borderRadius: "16px",
			fontSize: "14px",
			fontWeight: "600",
			color: "rgba(0,0,0,0.6)",
			cursor: "pointer",
			transition: "all 0.2s",
		},
		loadingText: {
			textAlign: "center",
			padding: "20px",
			color: "rgba(0,0,0,0.6)",
		},
	};

	const fetchFeeds = useCallback(async () => {
		if (loading || !hasMore) return;
		setLoading(true);
		try {
			const response = await api.get(
				`/feed?${cursor ? `cursor=${cursor}&` : ""}limit=10`
			);
			const {
				feeds: newFeeds,
				cursor: newCursor,
				currentUserId: newCurrentUserId,
			} = response.data.body;

			setFeeds((prev) => [...prev, ...newFeeds]);
			setCursor(newCursor);
			setHasMore(newCursor !== null);
			setCurrentUserId(newCurrentUserId);
		} catch (error) {
			console.error("Failed to fetch feeds:", error);
		} finally {
			setLoading(false);
		}
	}, [cursor, loading, hasMore]);

	const createPost = async () => {
		if (!newPostContent.trim()) return;
		try {
			await api.post("/feed", { content: newPostContent });
			setNewPostContent("");
			setFeeds([]);
			setCursor(null);
			setHasMore(true);
			fetchFeeds();
		} catch (error) {
			console.error("Failed to create post:", error);
		}
	};

	const updatePost = async (postId, content) => {
		try {
			await api.put(`/feed/${postId}`, { content });
			setFeeds((prev) =>
				prev.map((feed) =>
					feed.id === postId
						? { ...feed, content, updated_at: new Date().toISOString() }
						: feed
				)
			);
		} catch (error) {
			console.error("Failed to update post:", error);
		}
	};

	const deletePost = async (postId) => {
		try {
			await api.delete(`/feed/${postId}`);
			setFeeds((prev) => prev.filter((feed) => feed.id !== postId));
		} catch (error) {
			console.error("Failed to delete post:", error);
		}
	};

	const handleScroll = useCallback(() => {
		if (
			window.innerHeight + window.scrollY >=
			document.documentElement.scrollHeight - 100
		) {
			fetchFeeds();
		}
		console.log(feeds);
	}, [fetchFeeds]);

	useEffect(() => {
		fetchFeeds();
	}, []);

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [handleScroll]);

	return (
		<div style={styles.container}>
			<div style={styles.createPostCard}>
				<div style={styles.textareaWrapper}>
					<textarea
						value={newPostContent}
						onChange={(e) => setNewPostContent(e.target.value)}
						placeholder="What do you want to talk about?"
						maxLength={280}
						style={styles.textarea}
					/>
					<span style={styles.charCount}>{newPostContent.length}/280</span>
				</div>
				<button
					onClick={createPost}
					disabled={!newPostContent.trim() || loading}
					style={{
						...styles.postButton,
						...(!newPostContent.trim() && styles.postButtonDisabled),
					}}
				>
					Post
				</button>
			</div>

			<div style={styles.feedList}>
				{feeds.map((feed) => (
					<div key={feed.id} style={styles.feedCard}>
						<div style={styles.postHeader}>
							<img
								src={`http://localhost:4001/${feed.user.profile_photo_path}`}
								alt={feed.user.username}
								style={styles.avatar}
							/>
							<div style={styles.userInfo}>
								<h3 style={styles.userName}>{feed.user.full_name}</h3>
								<p style={styles.userUsername}>@{feed.user.username}</p>
								<p style={styles.postTime}>
									{feed.updated_at !== feed.created_at
										? `Edited ${new Date(feed.updated_at).toLocaleString()}`
										: new Date(feed.created_at).toLocaleString()}
								</p>
							</div>
						</div>

						<p style={styles.postContent}>{feed.content}</p>

						{feed.user.id === currentUserId && (
							<div style={styles.actionButtons}>
								<button
									onClick={() => {
										const newContent = prompt("Edit your post:", feed.content);
										if (newContent && newContent !== feed.content) {
											updatePost(feed.id, newContent);
										}
									}}
									style={styles.actionButton}
								>
									Edit
								</button>
								<button
									onClick={() => {
										if (window.confirm("Delete this post?")) {
											deletePost(feed.id);
										}
									}}
									style={styles.actionButton}
								>
									Delete
								</button>
							</div>
						)}
					</div>
				))}
				{loading && <div style={styles.loadingText}>Loading more posts...</div>}
			</div>
		</div>
	);
};

export default FeedPage;
