import User from "../models/user.model.js";
import {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateUserTokens,
} from "../utils/jwt.js";
import { StatusCodes } from "http-status-codes";
import createError from "http-errors";

export const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  const user = await User.create({
    fullName,
    email,
    password,
  });

  return res.status(StatusCodes.CREATED).json({
    message: "User registered successfully",
    data: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  const isPasswordValid = user ? await user.comparePassword(password) : false;

  if (!user || !isPasswordValid) {
    throw createError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
  }

  const { accessToken, refreshToken } = generateUserTokens(user);

  user.refreshToken = refreshToken;
  await user.save();

  return res.status(StatusCodes.OK).json({
    message: "Login successful",
    data: {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: "Bearer",
      id: user._id,
      fullName: user.fullName,
      email: user.email,
    },
  });
};

export const refreshAccessToken = async (req, res) => {
  const { refresh_token: refreshToken } = req.body;

  if (!refreshToken) {
    throw createError(StatusCodes.BAD_REQUEST, "refresh_token is required");
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw createError(
      StatusCodes.UNAUTHORIZED,
      "Invalid or expired refresh token",
    );
  }

  const user = await User.findById(decoded.sub);

  if (!user || user.refreshToken !== refreshToken) {
    throw createError(
      StatusCodes.UNAUTHORIZED,
      "Invalid or expired refresh token",
    );
  }

  const { accessToken, refreshToken: newRefreshToken } = generateUserTokens(user);

  user.refreshToken = newRefreshToken;
  await user.save();

  return res.status(StatusCodes.OK).json({
    message: "Token refreshed successfully",
    data: {
      access_token: accessToken,
      refresh_token: newRefreshToken,
      token_type: "Bearer",
    },
  });
};

export const logoutUser = async (req, res) => {
  const user = await User.findById(req.user.sub);

  if (user) {
    user.refreshToken = null;
    await user.save();
  }

  return res.status(StatusCodes.OK).json({
    message: "Logged out successfully",
  });
};

export const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.sub).select("-password");

  if (!user) {
    throw createError(StatusCodes.NOT_FOUND, "User not found");
  }

  return res.status(StatusCodes.OK).json({
    message: "User fetched successfully",
    data: user,
  });
};
