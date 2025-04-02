import bcryptjs from "bcryptjs";
import { User } from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js"; 
import jwt from "jsonwebtoken"; // Add this import


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
    res.status(500).json({ message: error.message });
  }
};

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
