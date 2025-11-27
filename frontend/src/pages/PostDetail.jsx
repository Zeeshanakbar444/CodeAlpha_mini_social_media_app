import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import Card from '../components/Card';
import Button from '../components/Button';
import './PostDetail.css';

const PostDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchPostAndComments();
    }, [id, user]);

    const fetchPostAndComments = async () => {
        try {
            const [postRes, commentsRes] = await Promise.all([
                api.get(`/post/single-post/${id}`),
                api.get(`/comment/get-comment/${id}`),
            ]);

            setPost(postRes.data.data);
            setComments(commentsRes.data.data || []);
        } catch (error) {
            console.error('Failed to fetch post details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            await api.post(`/comment/create-comment/${id}`, {
                content: newComment,
            });

            setNewComment('');
            fetchPostAndComments();
        } catch (error) {
            console.error('Failed to create comment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await api.delete(`/comment/delete-comment/${commentId}`);
            fetchPostAndComments();
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    const handleLike = async () => {
        try {
            await api.post(`/post/like/${id}`);
            fetchPostAndComments();
        } catch (error) {
            console.error('Failed to like post:', error);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="btn-spinner" style={{ width: '3rem', height: '3rem' }}></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="container" style={{ padding: '2rem 0' }}>
                <p>Post not found</p>
            </div>
        );
    }

    const isLiked = post.likes?.includes(user?._id);

    return (
        <div className="post-detail-container">
            <div className="container">
                <Button variant="ghost" onClick={() => navigate('/')}>
                    ← Back to Posts
                </Button>

                <Card className="post-detail-card">
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
                                <div className="post-username">{post.author?.username || 'Unknown'}</div>
                                <div className="post-time">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
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
                            onClick={handleLike}
                        >
                            <span className="action-icon">{isLiked ? '❤️' : '🤍'}</span>
                            <span>{post.likes?.length || 0} Likes</span>
                        </button>

                        <div className="action-btn">
                            <span className="action-icon">💬</span>
                            <span>{comments.length} Comments</span>
                        </div>
                    </div>
                </Card>

                <Card className="comments-section">
                    <h3>Comments</h3>

                    <form onSubmit={handleSubmitComment} className="comment-form">
                        <textarea
                            className="comment-textarea"
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            rows={3}
                            maxLength={500}
                        />
                        <Button type="submit" loading={submitting}>
                            Post Comment
                        </Button>
                    </form>

                    <div className="comments-list">
                        {comments.length === 0 ? (
                            <p className="no-comments">No comments yet. Be the first to comment!</p>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment._id} className="comment-item">
                                    <div className="comment-header">
                                        <div className="comment-author">
                                            {comment.author?.avatar && (
                                                <img
                                                    src={comment.author.avatar}
                                                    alt={comment.author.username}
                                                    className="comment-avatar"
                                                />
                                            )}
                                            <div>
                                                <div className="comment-username">
                                                    {comment.author?.username || 'Unknown'}
                                                </div>
                                                <div className="comment-time">
                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        {user && comment.author?._id === user._id && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteComment(comment._id)}
                                            >
                                                🗑️
                                            </Button>
                                        )}
                                    </div>
                                    <p className="comment-content">{comment.content}</p>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PostDetail;
