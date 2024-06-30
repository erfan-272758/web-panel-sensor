import crypto from "crypto";
import jwt from "jsonwebtoken";
import { getEnv } from "../config.js";

export function signToken(userId) {
  return jwt.sign({ payload: { id: userId } }, getEnv("auth-secret"), {
    expiresIn: "90d",
  });
}
export function verifyToken(token) {
  try {
    const doc = jwt.verify(token, getEnv("auth-secret"));
    return doc.payload;
  } catch (err) {
    return false;
  }
}

export function tokenExtractor(req) {
  return (
    (req.headers.authorization?.split("Bearer")?.[1] || req.cookies.auth) ??
    ""
  ).trim();
}
