import { verifyAccessToken } from "../utils/auth.mjs";

export default function requireAuth(req, res, next) {
  const token = req.cookies.accessToken; // <-- read from cookie
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
