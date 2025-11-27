import { useState } from 'react';
import api from '../api/axios';
import Button from './Button';
import './EditProfileModal.css'; // Reuse styles

const EditPostModal = ({ post, onClose, onUpdate }) => {
    const [content, setContent] = useState(post.content || '');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(post.image || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('content', content);
            if (image) {
                formData.append('image', image);
            }

            await api.post(`/post/update-post/${post._id}`, formData);

            onUpdate();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="gradient-text">Edit Post</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="edit-profile-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What's on your mind?"
                            rows={4}
                            className="bio-textarea"
                            required
                        />
                    </div>

                    <div className="avatar-upload-section">
                        {imagePreview && (
                            <div className="post-image-preview" style={{ width: '100%', maxHeight: '300px', overflow: 'hidden', borderRadius: '8px', marginBottom: '1rem' }}>
                                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        )}
                        <label className="avatar-upload-label">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                hidden
                            />
                            <Button type="button" variant="secondary" size="sm">
                                {imagePreview ? 'Change Image' : 'Add Image'}
                            </Button>
                        </label>
                    </div>

                    <div className="modal-actions">
                        <Button type="button" variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" loading={loading}>
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPostModal;
