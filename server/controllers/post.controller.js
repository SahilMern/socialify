import sharp from "sharp";
import cloudinary from "../utils/Cloudinary.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;
    if (!image)
      return res.status(400).json({
        message: "Image required to upload",
        status: false,
      });

    //Image Upload
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({
        width: 800,
        height: 800,
        fit: "inside",
      })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    console.log(optimizedImageBuffer, "optimizedImageBuffer");
    //Buffer to data uri
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    console.log(fileUri, "fileUri");
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);
    console.log(user, "user");
    if (user) {
      user.post.push(post._id);
      await user.save();
    }
    await post.populate({
      path: "author",
      select: "-password",
    });
    return res.status(201).json({
      message: "Post create sucessfully",
      post,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPost = async (req, res) => {
  try {
    const post = await Post.find()
      .sort({
        createdAt: -1,
      })
      .populate({ path: "author", select: "username, profilePicture" })
      .populate({
        path: "comments",
        sort: {
          createdAt: -1,
        },
        populate: {
          path: "author",
          select: "username, profilePicture",
        },
      });

    return res.status(200).json({
      post,
      message: "Get post",
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "author",
        select: "username, profilePicture",
      })
      .populate({
        path: "comments",
        sort: {
          createdAt: -1,
        },
        populate: {
          path: "author",
          select: "username, profilePicture",
        },
      });
    return res.status(200).json({
      posts,
      message: "Get User post",
    });
  } catch (error) {
    console.log(error, "error");
  }
};

export const likePost = async (req, res) => {
  try {
    const userWholikePost = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({
        message: "No post Found",
        success: false,
      });
    }

    //? like logic
    await Post.updateOne({
      $addToSet: {
        likes: userWholikePost,
      },
    });
    await Post.save();

    //Socket

    return res.status(200).json({
      success: true,
      message: "Post likd",
    });
  } catch (error) {
    console.log(error);
  }
};

export const dislikePost = async (req, res) => {
  try {
    const userWholikePost = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({
        message: "No post Found",
        success: false,
      });
    }

    //? like logic
    await Post.updateOne({
      $pull: {
        likes: userWholikePost,
      },
    });
    await Post.save();

    //Socket

    return res.status(200).json({
      success: true,
      message: "Dis like Post",
    });
  } catch (error) {
    console.log(error);
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const likekarnewalekiId = req.id;

    const { text } = req.body;
    const post = await Post.findById(postId);
    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Comment is requires",
      });
    }
    const comment = await Comment.create({
      text,
      author: likekarnewalekiId,
      post: postId,
    }).populate({
      path: "author",
      select: "username, profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Comment Added sucessfully",
      comment
    });
  } catch (error) {
    console.log(error);
  }
};
