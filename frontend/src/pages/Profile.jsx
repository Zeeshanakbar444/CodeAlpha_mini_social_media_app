import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import Card from '../components/Card';
import Button from '../components/Button';
import PostCard from '../components/PostCard';
import EditProfileModal from '../components/EditProfileModal';
import EditPostModal from '../components/EditPostModal';
import './Profile.css';

const Profile = () => {
    const { userId } = useParams();
    const { user: currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const [profileUser, setProfileUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showEditPostModal, setShowEditPostModal] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [following, setFollowing] = useState(false);

    useEffect(() => {
        fetchUserProfile();
        fetchUserPosts();
    }, [userId]);

    const fetchUserProfile = async () => {
        try {
            const response = await api.get(`/user/profile/${userId}`);
            setProfileUser(response.data.data);

            // Check if current user is following this user
            if (currentUser && response.data.data.followers) {
                setFollowing(response.data.data.followers.includes(currentUser._id));
            }
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        }
    };

    const fetchUserPosts = async () => {
        try {
            const response = await api.get(`/post/user/${userId}`);
            setPosts(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch user posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async () => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        try {
            await api.post(`/follow/${userId}`);
            setFollowing(!following);
            fetchUserProfile(); // Refresh to update follower count
        } catch (error) {
            console.error('Failed to follow/unfollow:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleProfileUpdate = () => {
        fetchUserProfile();
        setShowEditModal(false);
    };

    const handleDeletePost = async (postId) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await api.delete(`/post/delete-post/${postId}`);
                fetchUserPosts(); // Refresh posts
            } catch (error) {
                console.error('Failed to delete post:', error);
            }
        }
    };

    const handleEditPost = (post) => {
        setEditingPost(post);
        setShowEditPostModal(true);
    };

    const handlePostUpdate = () => {
        fetchUserPosts();
        setShowEditPostModal(false);
        setEditingPost(null);
    };

    const handleLike = async (postId) => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        try {
            await api.post(`/post/like/${postId}`);
            fetchUserPosts(); // Refresh posts
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

    if (!profileUser) {
        return (
            <div className="container" style={{ padding: '2rem 0' }}>
                <p>User not found</p>
            </div>
        );
    }

    const isOwnProfile = currentUser && currentUser._id === userId;

    return (
        <div className="profile-container">
            <div className="container">
                <Card className="profile-header">
                    <div className="profile-info">
                        <div className="profile-avatar-wrapper">
                            {profileUser.avatar ? (
                                <img
                                    src={profileUser.avatar}
                                    alt={profileUser.username}
                                    className="profile-avatar"
                                />
                            ) : (
                                <div className="profile-avatar-placeholder">
                                    {profileUser.username.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        <div className="profile-details">
                            <h1 className="profile-username">{profileUser.username}</h1>
                            {profileUser.bio && (
                                <p className="profile-bio">{profileUser.bio}</p>
                            )}

                            <div className="profile-stats">
                                <div className="stat-item">
                                    <span className="stat-value">{posts.length}</span>
                                    <span className="stat-label">Posts</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{profileUser.followers?.length || 0}</span>
                                    <span className="stat-label">Followers</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{profileUser.following?.length || 0}</span>
                                    <span className="stat-label">Following</span>
                                </div>
                            </div>

                            <div className="profile-actions">
                                {isOwnProfile ? (
                                    <>
                                        <Button onClick={() => setShowEditModal(true)}>
                                            Edit Profile
                                        </Button>
                                        <Button variant="ghost" onClick={handleLogout} className="logout-btn">
                                            Logout
                                        </Button>
                                    </>
                                ) : currentUser ? (
                                    <Button
                                        variant={following ? 'secondary' : 'primary'}
                                        onClick={handleFollow}
                                    >
                                        {following ? 'Unfollow' : 'Follow'}
                                    </Button>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="profile-posts-section">
                    <h2 className="section-title">Posts</h2>

                    {posts.length === 0 ? (
                        <Card className="empty-posts">
                            <p>No posts yet</p>
                        </Card>
                    ) : (
                        <div className="profile-posts-grid">
                            {posts.map((post) => (
                                <PostCard
                                    key={post._id}
                                    post={post}
                                    onLike={handleLike}
                                    onDelete={isOwnProfile ? handleDeletePost : null}
                                    onEdit={isOwnProfile ? handleEditPost : null}
                                    currentUser={currentUser}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showEditModal && (
                <EditProfileModal
                    user={profileUser}
                    onClose={() => setShowEditModal(false)}
                    onUpdate={handleProfileUpdate}
                />
            )}

            {showEditPostModal && editingPost && (
                <EditPostModal
                    post={editingPost}
                    onClose={() => setShowEditPostModal(false)}
                    onUpdate={handlePostUpdate}
                />
            )}
        </div>
    );
};

export default Profile;
