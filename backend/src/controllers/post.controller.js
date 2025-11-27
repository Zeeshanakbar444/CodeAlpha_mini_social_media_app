import { upload } from "../middlewares/multer.middleware.js";
import { Post } from "../models/post.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const getPost = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const posts = await Post.find()
    .populate("author", "username avatar followers")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Post.countDocuments();

  res.json({
    message: "fetch data successfully",
    success: true,
    data: posts,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalPosts: total,
  });
});

export const createPost = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const image = req.file?.path;
  if (!content) {
    return res.status(400).json({
      message: "post data is requied",
      success: false,
    });
  }
  const upload = await uploadOnCloudinary(image);

  const post = await Post.create({
    content,
    image: upload.url,
    author: req.user,
  });

  return res.status(200).json({
    message: "post create successfully",
    success: true,
    post,
  });
});

export const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      message: "user id is required",
      success: false,
    });
  }
  const post = await Post.findById(id);
  if (!post) {
    return res.status(400).json({
      message: "post is not found",
      success: false,
    });
  }

  await post.deleteOne();
  return res.status(200).json({
    message: "post deleted successfully",
    success: true,
  });
});

export const getSinglePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "post id is required",
      success: false,
    });
  }

  const post = await Post.findById(id).populate('author', 'username avatar');
  if (!post) {
    return res.status(400).json({
      message: "post is not found",
      success: false,
    });
  }
  return res.status(200).json({
    message: "single data fetch successfully",
    success: true,
    data: post,
  });
});

export const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params?.id);
  if (!post) {
    return res.status(400).json({
      message: "post is not found",
      success: false,
    });
  }

  const { content } = req.body;
  const image = req.file;

  let imageUrl = post.image;

  if (image) {
    const uploadNew = await uploadOnCloudinary(image.path);
    if (!uploadNew) {
      return res.status(400).json({
        message: "image upload failed",
        success: false,
      });
    }
    imageUrl = uploadNew.url;
  }

  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      content: content,
      image: imageUrl,
    },
    { new: true }
  );

  return res.status(200).json({
    message: "post updated successfully",
    success: true,
    data: updatedPost,
  });
});





export const likeOrUnlike = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {

  }

  const likeIndex = post.likes.indexOf(req.user._id);
  if (likeIndex > -1) {
    //unlike
    post.likes.splice(likeIndex, 1)
  } else {
    post.likes.push(req.user._id)

  }
  await post.save();
  await post.populate('author');

  return res.status(200).json({
    message: "operaion update successfully",
    success: true,
    post
  })
})

// Get all posts by user ID
export const getUserPosts = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const posts = await Post.find({ author: userId })
    .populate("author", "username avatar followers")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    message: "User posts fetched successfully",
    success: true,
    data: posts,
    count: posts.length,
  });
});
