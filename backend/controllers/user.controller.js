const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model.js");

module.exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { name, email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({message:"User already exists"})
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ email, name, password: hashedPassword });
    const token = newUser.generateToken();
    await newUser.save();
    
    delete newUser.password;
    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ message: "User registered successfully", token,newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "Wrong Email" });
    }
    if (!(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Wrong password" });
    }
    const token = user.generateToken();
    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ message: "User logged in successfully", token,user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getProfile = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports.getLiked = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await userModel.findById(req.user._id).populate("likedMemes");
    if(!user) {
        return res.status(404).json({ message: "No liked memes found" });
    }
    console.log(user)
    const memes=user.likedMemes;
    console.log(memes);
    res.status(200).json({ message: "Liked memes fetched successfully", memes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    }

    module.exports.updateProfile = async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await userModel.findByIdAndUpdate(req.user._id, req.body, { new: true });
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User updated successfully", user });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
        }


module.exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
