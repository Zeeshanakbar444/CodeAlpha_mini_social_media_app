import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import Button from '../components/Button';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import './Posts.css';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreatePost, setShowCreatePost] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await api.get('/post/get');
            setPosts(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePostCreated = () => {
        setShowCreatePost(false);
        fetchPosts();
    };

    const handleLike = async (postId) => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            await api.post(`/post/like/${postId}`);
            fetchPosts();
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

    return (
        <div className="posts-container">
            <div className="container">
                <div className="posts-header">
                    <h1 className="gradient-text">Latest Posts</h1>
                    {user && (
                        <Button onClick={() => setShowCreatePost(!showCreatePost)}>
                            {showCreatePost ? 'Cancel' : '+ Create Post'}
                        </Button>
                    )}
                </div>

                {showCreatePost && (
                    <CreatePost onPostCreated={handlePostCreated} />
                )}

                <div className="posts-grid">
                    {posts.length === 0 ? (
                        <div className="empty-state">
                            <p>No posts yet. Be the first to share something!</p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <PostCard
                                key={post._id}
                                post={post}
                                onLike={handleLike}
                                currentUser={user}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Posts;
