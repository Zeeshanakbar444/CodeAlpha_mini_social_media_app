import { useState } from 'react';
import api from '../api/axios';
import Button from './Button';
import Input from './Input';
import './EditProfileModal.css';

const EditProfileModal = ({ user, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        username: user.username || '',
        bio: user.bio || '',
    });
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(user.avatar || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = new FormData();
            data.append('username', formData.username);
            data.append('bio', formData.bio);
            if (avatar) {
                data.append('avatar', avatar);
            }

            await api.put('/user/profile', data);

            onUpdate();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="gradient-text">Edit Profile</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="edit-profile-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="avatar-upload-section">
                        <div className="avatar-preview-large">
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar preview" />
                            ) : (
                                <div className="avatar-placeholder-large">
                                    {formData.username.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <label className="avatar-upload-label">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                hidden
                            />
                            <Button type="button" variant="secondary" size="sm">
                                Change Avatar
                            </Button>
                        </label>
                    </div>

                    <Input
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />

                    <div className="form-group">
                        <label htmlFor="bio">Bio</label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell us about yourself..."
                            rows={4}
                            maxLength={500}
                            className="bio-textarea"
                        />
                        <span className="char-count">{formData.bio.length}/500</span>
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

export default EditProfileModal;
