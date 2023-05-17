import Post from "../models/Post.js";
import User from "../models/User.js";

class PostsController {
  //create
  createPost = async (req, res) => {
    try {
      const { description } = req.body;
      const picturePath = req.file?.filename || "";
      const userId = req.user.id;
      const user = await User.findById(userId);

      const newPost = new Post({
        userId,
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location,
        description,
        userPicturePath: user.picturePath,
        picturePath,
        likes: {},
        comments: [],
      });

      await newPost.save();
      const post = await Post.find();
      res.status(201).json(post);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  };

  //get
  getPosts = async (req, res) => {
    try {
      const post = await Post.find();
      res.status(200).json(post);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  };

  getUserPosts = async (req, res) => {
    try {
      const { userId } = req.params;
      const post = await Post.find({ userId });
      res.status(200).json(post);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  };

  getPostByPostId = async (req, res) => {
    try {
      const { postId } = req.params;
      const post = await Post.findById(postId);
      res.status(200).json(post);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  };

  //update
  likePost = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const post = await Post.findById(id);
      const isLiked = post.likes.get(userId);
      if (isLiked) {
        post.likes.delete(userId);
      } else {
        post.likes.set(userId, true);
      }
      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { likes: post.likes },
        { new: true }
      );
      res.status(200).json(updatedPost);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  };
  addComment = async (req, res) => {
    try {
      const { id } = req.params;
      const { comment } = req.body;
      if (comment.length <= 2 || comment.length >= 30) {
        res.status(400).json({ message: "failed" });
      } else {
        const updatedPost = await Post.findByIdAndUpdate(
          id,
          { $push: { comments: comment } },
          { new: true }
        );
        res.status(200).json(updatedPost);
      }
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  };

  //delete
  deletePost = async (req, res) => {
    try {
      const { postId } = req.params;
      const userId = req.user.id;
      const post = await Post.findById(postId);
      if (post.userId === userId) {
        await Post.findByIdAndDelete(postId);
        res.status(200).json({ success: true });
      } else {
        res.status(404).json({ status: false });
      }
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  };
}
export const postsController = new PostsController();
