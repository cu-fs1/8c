import jwt from "jsonwebtoken";

export const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env");
  }

  return process.env.JWT_SECRET;
};

export const getRefreshSecret = () => {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is not defined in .env");
  }

  return process.env.JWT_REFRESH_SECRET;
};

export const generateToken = (userId, role) => {
  return jwt.sign({ sub: userId, role }, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ sub: userId }, getRefreshSecret(), {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, getJwtSecret());
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, getRefreshSecret());
};

export const generateUserTokens = (user) => {
  const accessToken = generateToken(user._id.toString(), user.role);
  const refreshToken = generateRefreshToken(user._id.toString());
  return { accessToken, refreshToken };
};
