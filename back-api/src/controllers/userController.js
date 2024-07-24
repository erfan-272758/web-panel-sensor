import crypto from "crypto";
import userModel from "../models/userModel.js";
import transformDecorator from "../decorator/transformDecorator.js";
import { HttpError } from "../errors/HttpError.js";

export class UserController {
  async getAll(req, res) {
    const user = req.user;
    if (user.role !== "admin") {
      return res.json(transformDecorator({ data: [user] }));
    }
    const q = req.query.q;
    const users = await userModel.readUser(q ? { name: `$regex_${q}` } : {});
    return res.json(transformDecorator({ data: users }));
  }
  async getOne(req, res, next) {
    const user = req.user;
    const { id } = req.params;
    if (user.role !== "admin") {
      if (id !== user.id)
        return next(new HttpError(403, "Only admin can see other users"));
      return res.json(transformDecorator({ data: user }));
    }
    const users = await userModel.readUser({ id });
    if (!users?.[0]) return res.status(404).json({ message: "user not found" });
    return res.json(transformDecorator({ data: users[0] }));
  }
  async createOne(req, res) {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Only admin can create user" });
    const { username, password, name } = req.body ?? {};
    for (const [k, v] of Object.entries({ username, password, name })) {
      if (!v) return res.status(400).json({ message: `${k} must be send` });
    }
    const users = await userModel.readUser({ username });
    if (users?.[0])
      return res
        .status(400)
        .json({ message: "username is duplicate please change it" });
    await userModel.writeUser({
      id: crypto.randomUUID(),
      username,
      password,
      name,
      role: "user",
    });
    const [u] = await userModel.readUser({ username }, false);
    return res.status(201).json({ data: transformDecorator(u) });
  }
  async updateOne(req, res, next) {
    const { id } = req.params;
    const [user] = await userModel.readUser({ id }, true);

    if (!user) return next(new HttpError(404, "user not found"));

    if (req.user.role !== "admin" && id !== user.id)
      return next(new HttpError(403, "Only admin can delete other users"));

    // delete
    const canDelete = await userModel.deleteUser(id);
    if (!canDelete)
      return next(new HttpError(500, "Can not update please try again later"));

    // merge
    const { username, password, name } = req.body;
    const newUser = {
      id: user.id,
      name: name || user.name,
      username: username || user.username,
      password: password || user.password,
      role: user.role,
    };

    // create
    await userModel.writeUser(newUser);

    const [u] = await userModel.readUser({ username: newUser.username }, false);

    return res.json({ data: transformDecorator(u) });
  }
  async deleteOne(req, res, next) {
    if (req.user.role !== "admin")
      return next(new HttpError(403, "Only admin can delete user"));
    const canDelete = await userModel.deleteUser(req.params.id);
    if (!canDelete)
      return next(new HttpError(500, "can not delete, please try again later"));
    return res.status(204).send();
  }
}

const userController = new UserController();
export default userController;
