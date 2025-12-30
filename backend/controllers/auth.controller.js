import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res
      .status(200)
      .json({ message: "User created successfully", success: true, user });
  } catch (error) {
    res.json({ message: "Internal server error", success: false });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "User does not exist", success: false });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res
      .status(200)
      .json({ message: "Login successful", success: true, user, token });
  } catch (error) {
    res.json({ message: "Internal server error", success: false });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
  });
  res.json({ message: "Logout successful", success: true });
};

export const checkAuth = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);

    return res.status(200).json({ success: true });
  } catch (error) {
    res.json({ message: "Internal server error", success: false });
  }
};