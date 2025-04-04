import bcryptjs from "bcryptjs";
import { User } from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { email, password, name, address, phoneNo } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash Password
    const hashedPassword = await bcryptjs.hash(password, 10);
    console.log("Hashed password:", hashedPassword);

    // Upload image to Cloudinary if provided
    let avatar = { public_id: "", url: "" };
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      avatar = { public_id: result.public_id, url: result.secure_url };
    }

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      address,
      phoneNo,
      avatar,
    });

    await newUser.save();
    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (user && (await bcryptjs.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        address: user.address,
        phoneNo: user.phoneNo,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        phoneNo: user.phoneNo,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, address, phoneNo } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let avatar = user.avatar;
    if (req.file) {
      // Delete old avatar from Cloudinary
      if (user.avatar.public_id) {
        await cloudinary.uploader.destroy(user.avatar.public_id);
      }

      // Upload new avatar
      const result = await cloudinary.uploader.upload(req.file.path);
      avatar = { public_id: result.public_id, url: result.secure_url };
    }

    user.name = name || user.name;
    user.address = address || user.address;
    user.phoneNo = phoneNo || user.phoneNo;
    user.avatar = avatar;

    await user.save();
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user profile (for authenticated users)
export const getUserProfile = async (req, res) => {
  try {
    // req.user should be available from the protect middleware
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        phoneNo: user.phoneNo,
        avatar: user.avatar,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Logout user
export const logoutUser = async (req, res) => {
  try {
    // Since we're using JWT, actual token invalidation would require a token blacklist
    // For a simple implementation, we'll just return a success response
    // The frontend will handle removing the token from storage
    
    // If you want to implement a token blacklist in the future:
    // 1. Create a blacklist collection in MongoDB
    // 2. Add the token to that blacklist with an expiry date
    
    res.status(200).json({ 
      success: true, 
      message: "Logged out successfully" 
    });
  } catch (error) {
    console.error("Error during logout:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
