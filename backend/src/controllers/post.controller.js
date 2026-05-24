import Post from "../models/post.model.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;

    let imageUrl = "";

    // Upload image if exists
    if (req.file) {
      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "social_posts",
            },
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload();

      imageUrl = result.secure_url;
    }

    const post = await Post.create({
      user: req.user._id,
      text,
      image: imageUrl,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      user: req.params.userId,
    })
      .populate("user", "username profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Check already liked
    const alreadyLiked = post.likes.includes(req.user._id);

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      // Like
      post.likes.push(req.user._id);
    }

    await post.save();

    res.status(200).json({
      message: alreadyLiked
        ? "Post unliked"
        : "Post liked",
      likes: post.likes,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const newComment = {
      user: req.user._id,
      text,
    };

    post.comments.push(newComment);

    await post.save();

    res.status(201).json({
      message: "Comment added",
      comments: post.comments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Authorization check
    if (
      post.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can delete only your posts",
      });
    }

    await post.deleteOne();

    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { text } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Authorization
    if (
      post.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can update only your posts",
      });
    }

    post.text = text || post.text;

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};