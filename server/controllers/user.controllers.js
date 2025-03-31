import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const jwtSecret = "sahilyadavsahilyadavsahilyadav";
//TODO:- User Register
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(401).json({
        success: false,
        message: "All Field Required",
      });
    }

    const userExists = await User.findOne({ email });
    console.log(userExists);
    if (userExists) {
      return res.statu(401).json({
        success: false,
        message: `This ${email} Email Already Exists`,
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
      message: "User Register suceesfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "All field Required",
      });
    }

    const userExists = await User.findOne({ email });
    console.log(userExists);
    if (!userExists) {
      return res.statu(401).json({
        success: false,
        message: `User Not Register! Please login`,
      });
    }
    const hashPassword = await bcrypt.compare(password, userExists.password);
    console.log(hashPassword, "HashedPassword");

    if (!hashPassword) {
      return res.status(401).json({
        success: false,
        message: `Invalid Credientials`,
      });
    }
    const userData = {
      userId: userExists._id,
      email: userExists.email,
    };
    console.log(userData, "userData");

    const token = jwt.sign(userData, jwtSecret, {
      expiresIn: "1h",
    });
    return res
      .cookie("cookie", token, {
        httpOnly: true,
        secure: true,
        sameSite: true,
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome ${userExists.username}`,
        success: true,
      });
    // console.log(token, "token");

    return res.status(200).json({
      message: "User Register suceesfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};
