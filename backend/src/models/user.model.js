import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
const userPostSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    bio: { type: String, default: "" },
    avatar: { type: String, default: "" },

    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "PostUser" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "PostUser" }],
  },
  { timestamps: true }
);

userPostSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare passwords
userPostSchema.methods.comparePassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

userPostSchema.methods.generateToken = async function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
export const PostUser = mongoose.model("PostUser", userPostSchema);
