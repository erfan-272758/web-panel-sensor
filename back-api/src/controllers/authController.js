import { db } from "../config.js";
import { HttpError } from "../errors/HttpError.js";
import userModel from "../models/userModel.js";
import { signToken, tokenExtractor, verifyToken } from "../utils/auth.js";

export class AuthController {
  async loginWithToken(req, res, next) {
    const token = tokenExtractor(req);
    if (!token) return next(new HttpError(401, "invalid token"));
    const userFromToken = verifyToken(token);
    console.log(userFromToken);
    if (!userFromToken) return next(new HttpError(401, "invalid token"));

    const [user] = await userModel.readUser({ id: userFromToken.id });
    if (!user) return next(new HttpError(401, "invalid user id"));
    req.user = user;

    if (res) return res.json({ data: user });
    return next();
  }
  async loginWithUserPass(req, res, next) {
    const { username, password } = req.body;
    if (!username || !password)
      return next(400, "username and password required");
    const [user] = await userModel.readUser({ username, password });
    if (!user) return next(401, "incorrect username or password");
    req.user = user;
    if (res) {
      // sign token
      const token = signToken(user.id);
      res.cookie("auth", token, {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      });
      return res.json({ data: { token, user } });
    }
    return next();
  }
}
const authController = new AuthController();
export default authController;
