import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        maxlength: 500
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PostUser',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    }
}, {
    timestamps: true
});

export const Comment = mongoose.model('Comment', commentSchema);

