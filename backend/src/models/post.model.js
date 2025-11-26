import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        maxlength: 1000
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PostUser',
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PostUser'
    }],
    commentCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

export const Post = mongoose.model('Post', postSchema);
