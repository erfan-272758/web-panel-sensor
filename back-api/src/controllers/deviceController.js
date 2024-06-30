import crypto from "crypto";
import { HttpError } from "../errors/HttpError.js";
import deviceModel from "../models/deviceModel.js";
import transformDecorator from "../decorator/transformDecorator.js";

class DeviceController {
  async getAll(req, res, next) {
    const user = req.user;
    const { q } = req.query;
    const query = {};

    // add ownership
    if (user.role !== "admin") query.owner = user.username;

    // add q
    if (q) query.name = `$regex_${q}`;

    // exec
    const devices = await deviceModel.readDevice(query);
    return res.json(transformDecorator({ data: devices }));
  }
  async getOne(req, res, next) {
    const user = req.user;
    const { id } = req.params;
    const query = {};

    // add ownership
    if (user.role !== "admin") query.owner = user.username;

    // add id
    query.id = id;

    // exec
    const [device] = await deviceModel.readDevice(query);

    if (!device) return next(new HttpError(404, "device not found"));

    return res.json(transformDecorator({ data: device }));
  }
  async create(req, res, next) {
    if (!req.body.name) return next(new HttpError(400, "name is required"));
    if (
      !req.body.streams ||
      !Array.isArray(req.body.streams) ||
      !req.body.streams[0]
    )
      return next(
        new HttpError(
          400,
          "streams is required and must be an array with at least one item"
        )
      );
    const body = {
      id: crypto.randomUUID(),
      name: req.body.name,
      owner:
        req.user.role === "admin"
          ? req.body.owner || req.user.username
          : req.user.username,
      streams: req.body.streams ?? [],
    };

    await deviceModel.writeDevice(body);

    return res.status(201).json({ message: "device successfully created" });
  }
  async updateOne(req, res, next) {
    const user = req.user;
    const { id } = req.params;
    const query = {};

    // add ownership
    if (user.role !== "admin") query.owner = user.username;

    // add id
    query.id = id;

    const [device] = await deviceModel.readDevice(query);

    if (!device) return next(new HttpError(404, "device not found"));

    // delete
    const canDelete = await deviceModel.deleteDevice(query);
    if (!canDelete)
      return next(new HttpError(500, "Can not update please try again later"));

    // merge
    const { name, owner, streams } = req.body;
    const newDevice = {
      id: device.id,
      name: name || device.name,
      owner: user.role === "admin" ? owner || device.owner : device.owner,
      streams: streams || device.streams,
    };

    // create
    await deviceModel.writeDevice(newDevice);

    return res.json({ message: "update successfully" });
  }
  async deleteOne(req, res, next) {
    const user = req.user;
    const { id } = req.params;
    const query = {};

    // add ownership
    if (user.role !== "admin") query.owner = user.username;

    // add id
    query.id = id;

    // exec
    const canDelete = await deviceModel.deleteDevice(query);
    if (!canDelete) return next(new HttpError(500, "can not delete device"));
    return res.status(204).send();
  }
}

const deviceController = new DeviceController();
export default deviceController;
