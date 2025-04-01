import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataUrl.js";
import cloudinary from "../utils/Cloudinary.js";
const jwtSecret = "sahilyadavsahilyadavsahilyadav";

// User Register
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(401).json({
        success: false,
        message: "All fields are required",
      });
    }

    const userExists = await User.findOne({ email });
    console.log(userExists);
    if (userExists) {
      return res.status(401).json({
        success: false,
        message: `This ${email} email already exists`,
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    console.log(hashPassword, "HashedPassword");

    const user = new User({
      username,
      email,
      password: hashPassword,
    });
    await user.save();
    return res.status(201).json({
      message: "User registered successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// User Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "All fields are required",
      });
    }

    let user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not registered! Please register",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid, "HashedPassword");

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const userResponse = {
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      gender: user.gender,
      followers: user.followers,
      following: user.following,
      posts: user.posts,
    };

    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: "1h",
    });
    return res
      .cookie("cookie", token, {
        httpOnly: true,
        secure: true,
        sameSite: true,
        maxAge: 1 * 60 * 60 * 1000, // Aligns with token expiration
      })
      .json({
        message: `Welcome ${user.username}`,
        success: true,
        user: userResponse,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// User Logout
export const logout = async (req, res) => {
  try {
    return res.cookie("cookie", "", { maxAge: 0 }).json({
      message: "User logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get Profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId);
    const user = await User.findById(userId); // Changed to findById
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Edit Profile
export const editProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Ensure this retrieves the correct user ID
    const { bio, gender } = req.body;
    const profilePicture = req.file;

    let cloudResponse;
    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();
    return res.status(200).json({
      // Changed to 200 for updates
      message: "Profile updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const getSuggestedUsers = async(req, res) =>{
  try {
    const getSuggestedUsers = await User.find({
      _id:{
        $ne:req.id
      }
    }).select("-password")
    return res.status(200).json({
      success: true,
      message: "Get suggested user",
      getSuggestedUsers
    });
  } catch (error) {
    console.log(error, "error");
    
  }
}