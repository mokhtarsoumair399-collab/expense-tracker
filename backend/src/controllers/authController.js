import User from "../models/User.js";
import { cookieOptions, signToken } from "../utils/token.js";

const sendAuth = (res, user, status = 200) => {
  const token = signToken(user._id);
  res.cookie("token", token, cookieOptions());
  res.status(status).json({ user });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });

    if (existing) {
      res.status(409);
      throw new Error("Email is already registered");
    }

    const user = await User.create({ name, email, password });
    sendAuth(res, user, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    sendAuth(res, user);
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", cookieOptions());
  res.json({ message: "Logged out" });
};

export const me = (req, res) => {
  res.json({ user: req.user });
};
