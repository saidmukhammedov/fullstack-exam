import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateTokens = (user) => {
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    },
  );
  return { accessToken, refreshToken };
};

export const register = async (req, res) => {
  const { fullName, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing)
    return res.status(409).json({
      statusCode: 409,
      message: "Already logged in with this email",
    });
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ fullName, email, passwordHash: hash });
  const tokens = generateTokens(user);
  res.status(201).json({
    data: { _id: user._id, fullName: user.fullName, email: user.email },
    tokens,
    message: "Successfully registrated",
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credits" });
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ message: "Invalid credits" });
  const tokens = generateTokens(user);
  res.json({
    data: { _id: user._id, fullName: user.fullName, email: user.email },
    tokens,
  });
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(401).json({ statusCode: 401, message: "Tizimga kiring" });
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    const tokens = generateTokens(user);
    res.json({ tokens });
  } catch {
    res.status(401).json({ statusCode: 401, message: "Token muddati tugagan" });
  }
};

export const logout = async (req, res) => {
  res.json({ message: "Tizimdan chiqdingiz" });
};
