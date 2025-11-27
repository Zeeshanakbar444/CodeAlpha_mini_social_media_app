import { useState } from 'react';
import api from '../api/axios';
import Card from './Card';
import Button from './Button';
import './CreatePost.css';

const CreatePost = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
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
        if (!content.trim()) {
            setError('Please write something');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('content', content);
            if (image) {
                formData.append('image', image);
            }

            await api.post('/post/create-post', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setContent('');
            setImage(null);
            setImagePreview('');
            onPostCreated();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="create-post">
            <h3>Create New Post</h3>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <textarea
                    className="post-textarea"
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    maxLength={1000}
                />

                {imagePreview && (
                    <div className="image-preview">
                        <img src={imagePreview} alt="Preview" />
                        <button
                            type="button"
                            className="remove-image"
                            onClick={() => {
                                setImage(null);
                                setImagePreview('');
                            }}
                        >
                            ✕
                        </button>
                    </div>
                )}

                <div className="create-post-actions">
                    <label className="image-upload-btn">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            hidden
                        />
                        <span>📷 Add Image</span>
                    </label>

                    <Button type="submit" loading={loading}>
                        Post
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default CreatePost;
