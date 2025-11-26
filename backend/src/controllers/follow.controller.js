import { PostUser } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const followUser = asyncHandler(async (req, res) => {
  const currentUser = await PostUser.findById(req.user?._id);
  const userToFollow = await PostUser.findById(req.params.userId);

  if (!userToFollow) {
    return res.this.status(400).json({
      message: "id required that specify which one you follow",
      success: false,
    });
  }

  // user cannot follow yourself

  if (req.params.userId === req.user._id) {
    return res.status(400).json({
      message: "cannot follow yourself",
      success: false,
    });
  }

  const isFollowing = currentUser.following.includes(req.params.userId);

  if (isFollowing) {
    // unfollow user
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== req.params.userId
    );
    userToFollow.followers = userToFollow.followers.filter(
      (id) => id.toString() !== req.user._id
    );
  }else{
    // follow
    currentUser.following.push(req.params.userId);
    userToFollow.followers.push(req.user._id)
  }
  currentUser.save();
  userToFollow.save();
   res.json({
            isFollowing: !isFollowing,
            followersCount: userToFollow.followers.length,
            followingCount: currentUser.following.length
        });
});
