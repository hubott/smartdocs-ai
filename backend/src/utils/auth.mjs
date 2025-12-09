import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const hashPassword = async (plain, rounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10)) =>
  bcrypt.hash(plain, rounds);

export const comparePassword = async (plain, hashed) =>
  bcrypt.compare(plain, hashed);

export const signAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m" });

export const signRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d" });

export const verifyAccessToken = (token) =>
  jwt.verify(token, process.env.JWT_ACCESS_SECRET);

export const verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET);
