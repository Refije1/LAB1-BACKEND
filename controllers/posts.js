//const Post = require("../models/Post.js");
const User = require("../models/User.js");
const Like = require("../models/Like.js");
const Comments = require("../models/CommentModule.js");
const SavedPost = require("../models/SavedPost.js");
const { insertMultipleObjects } = require("../aws/S3Client.js");
// const createLikeNotification = require("../models/notification.js");
// const Notification = require("../models/notificationModel.js");

const path = require("path");
const { fileURLToPath } = require("url");
const { dirname } = require("path");




const createPost = async (req, res) => {
  try {
    const { userId, description } = req.body;
    console.log("req.body", req.body);
    console.log("req.files", req.files);
    let pictures = [];

    if (req.files) {
      try {
        const keys = await insertMultipleObjects(req.files);
        pictures = keys;
      } catch (err) {
        console.error(err);
        throw err;
      }
    }

    const user = await User.findOne({
      _id: userId,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { firstName, lastName, profilePicture } = user;
    let picture = [];

    for (let i = 0; i < pictures.length; i++) {
      const url =
        "https://postify-development-images.s3.eu-central-1.amazonaws.com/";
      const pictureUrl = url + pictures[i];
      picture.push(pictureUrl);
    }

    const newPost = new Post({
      userId: userId,
      description: description,
      pictures: picture,
      author: firstName + " " + lastName,
      userProfilePicture: profilePicture,
    });

    await newPost.save();
    console.log(newPost);
    return res.status(201).json(newPost);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const uploadDirectory = path.join(dirname(__filename), "../uploads");

 const getPostPictures = async (req, res) => {
  try {
    const postId = req.params.postId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const pictures = post.pictures;

    return res.status(200).json(pictures);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

 const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("likes").populate("comments");
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

 const getFeedPosts = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId).populate("friends");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friendIds = user.friends.map((friend) => friend.id);
    friendIds.push(userId);

    const posts = await Post.find({ userId: { $in: friendIds } })
      .populate("likes")
      .populate("comments");

    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getPost = async (req, res) => {
  try {
    const id = req.params.postId;
    const post = await Post.findById(id).populate("likes").populate("comments");
    if (!post) {
      return res.status(404).json({ error: "Post does not exist" });
    }
    console.log("post", post);

    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId })
      .populate("likes")
      .populate("comments");
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const description = req.body.description;

    let pictures = [];

    if (req.files) {
      try {
        const keys = await insertMultipleObjects(req.files);
        pictures = keys;
      } catch (err) {
        console.error(err);
        throw err;
      }
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (description !== undefined) {
      post.description = description;
    }

    let picture = [];

    if (pictures.length > 0) {
      const url =
        "https://postify-development-images.s3.eu-central-1.amazonaws.com/";
      picture = pictures.map((key) => url + key);
      post.pictures = [];
      post.pictures = picture;
    }

    await post.save();

    return res.status(200).json({ edited: true, post });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await Comments.deleteMany({ postId: postId });
    await Like.deleteMany({ postId: postId });

    await post.deleteOne();

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const savePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.body.userId;

    const savedPost = await SavedPost.findOne({ postId, userId });
    if (savedPost !== null) {
      return res.status(400).json({ message: "Post is already saved" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }

    const newSavedPost = new SavedPost({
      postId,
      userId,
      folderId: req.body.folderId,
    });

    await newSavedPost.save();

    return res.status(200).json({ message: "Post saved successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const unsavePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.body.userId;

    const savedPost = await SavedPost.findOne({ postId, userId });
    if (savedPost === null) {
      return res.status(404).json({ message: "Post is not saved" });
    }

    await SavedPost.deleteOne({ _id: savedPost._id });

    return res.status(200).json({ message: "Post unsaved" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getUserSavedPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const userSavedPost = await SavedPost.find({ userId });
    return res.status(200).json(userSavedPost);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
const getAllSavedPosts = async (req, res) => {
  try {
    const savedPosts = await SavedPost.find();
    return res.status(200).json(savedPosts);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.body.userId;
    console.log(postId, userId);
    const like = await Like.findOne({
      postId,
      userId,
    });

    const user = await User.findOne({
      _id: userId,
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const { firstName, lastName } = user;
    const author = `${firstName} ${lastName}`;

    const newLike = new Like({
      postId,
      userId,
      author,
    });

    await newLike.save();

    const post = await Post.findById(postId);
    // await createLikeNotification(userId, postId, post.userId);
    await Post.findByIdAndUpdate(
      postId,
      { $push: { likes: newLike } },
      { new: true }
    );

    return res.status(201).json({
      message: "Post liked",
      newLike: { author, postId, userId },
    });
  } catch (error) {
    console.error("Error liking post:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// exports.getNotificationsByUserId = async (req, res) => {
//   try {
//     const userId = req.body.userId;
//     const notifications = await Notification.find({ userId: userId });
//     const messageArray = notifications.map(
//       (notification) => notification.message
//     );
//     res.status(200).json({ messages: messageArray });
//   } catch (error) {
//     console.error("Error getting notifications:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

const unlikePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.body.userId;

    const like = await Like.findOne({
      postId,
      userId,
    });

    const user = await User.findOne({
      _id: userId,
    });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (like === null) {
      return res.status(400).json({ message: "Post is not liked" });
    }

    const { firstName, lastName } = user;
    const author = firstName + " " + lastName;

    await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: like._id } },
      { new: true }
    );

    await Like.deleteOne({ _id: like._id });
    return res.status(201).json({ message: "Post unliked", userId, postId });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getLikesForPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const likes = await Like.find({ postId }).populate({
      path: "userId",
      select: "firstName lastName",
    });

    const getLikes = likes.map((like) => {
      return {
        userId: like.userId._id,
        firstName: like.userId.firstName,
        lastName: like.userId.lastName,
      };
    });

    return res.status(200).json(getLikes);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createPost,
  getPostPictures,
  getPosts,
  getFeedPosts,
  getPost,
  updatePost,
  deletePost,
  savePost,
  unsavePost,
  getUserSavedPosts,
  getAllSavedPosts,
  likePost,
  unlikePost,
  getLikesForPost,
  getUserPosts
};