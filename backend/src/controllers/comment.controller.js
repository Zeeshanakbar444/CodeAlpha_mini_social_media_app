import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
export const getComment = asyncHandler(async (req, res) => {
  let comment = await Comment.find({ post: req.params.postId }).populate(
    "author"
  );

  return res.status(200).json({
    message: "fetch comment successfully",
    success: true,
  });
});
export const createComment = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ message: "Content is required" });
  }

  // Check if post exists
  const post = await Post.findById(req.params.postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const comment = new Comment({
    content,
    author: req.userId,
    post: req.params.postId,
  });

  await comment.save();
  await comment.populate("author", "username avatar");

  // Update comment count on post
  post.commentCount += 1;
  await post.save();

  return res.status(201).json({
    comment,
    message: "comment created successfully",
    success: true,
  });
});
export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  // Check if user is the author
  if (comment.author.toString() !== req.userId) {
    return res.status(403).json({ message: "Not authorized" });
  }

  // Update comment count on post
  const post = await Post.findById(comment.post);
  if (post) {
    post.commentCount = Math.max(0, post.commentCount - 1);
    await post.save();
  }

  await Comment.findByIdAndDelete(req.params.id);

  res
    .status(200)
    .json({ message: "Comment deleted successfully", success: true });
});
