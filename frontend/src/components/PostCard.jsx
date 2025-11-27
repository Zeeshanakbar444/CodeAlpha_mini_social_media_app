import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import Button from './Button';
import './PostCard.css';

const PostCard = ({ post, onLike, onDelete, onEdit, currentUser }) => {
    const navigate = useNavigate();
    const isLiked = currentUser && post.likes?.includes(currentUser._id);
    const isAuthor = currentUser && post.author?._id === currentUser._id;

    const handleCommentClick = () => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        navigate(`/post/${post._id}`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    return (
        <Card className="post-card">
            <div className="post-header">
                <div className="post-author">
                    {post.author?.avatar && (
                        <img
                            src={post.author.avatar}
                            alt={post.author.username}
                            className="post-avatar"
                        />
                    )}
                    <div>
                        <div className="post-username-row">
                            <div
                                className="post-username clickable"
                                onClick={() => navigate(`/profile/${post.author?._id}`)}
                            >
                                {post.author?.username || 'Unknown'}
                            </div>
                            {post.author?.followers && (
                                <span className="follower-badge">
                                    {post.author.followers.length} follower{post.author.followers.length !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                        <div className="post-time">{formatDate(post.createdAt)}</div>
                    </div>
                </div>
                {isAuthor && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {onEdit && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit(post)}
                            >
                                ✏️
                            </Button>
                        )}
                        {onDelete && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(post._id)}
                            >
                                🗑️
                            </Button>
                        )}
                    </div>
                )}
            </div>

            <div className="post-content">
                <p>{post.content}</p>
                {post.image && (
                    <img src={post.image} alt="Post" className="post-image" />
                )}
            </div>

            <div className="post-actions">
                <button
                    className={`action-btn ${isLiked ? 'liked' : ''}`}
                    onClick={() => onLike(post._id)}
                >
                    <span className="action-icon">{isLiked ? '❤️' : '🤍'}</span>
                    <span>{post.likes?.length || 0}</span>
                </button>

                <button
                    className="action-btn"
                    onClick={handleCommentClick}
                >
                    <span className="action-icon">💬</span>
                    <span>{post.commentCount || 0}</span>
                </button>
            </div>
        </Card>
    );
};

export default PostCard;
