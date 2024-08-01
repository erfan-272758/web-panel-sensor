import crypto from "crypto";
import { HttpError } from "../errors/HttpError.js";
import deviceModel from "../models/deviceModel.js";
import transformDecorator from "../decorator/transformDecorator.js";
import sensorModel from "../models/sensorModel.js";
import dataModel from "../models/dataModel.js";

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

    // sensors
    const dWithS = await Promise.all(
      devices.map(async (d) => ({
        ...d,
        sensors: (await sensorModel.readSensor({ device: d.id })).length,
      }))
    );

    return res.json(transformDecorator({ data: dWithS }));
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

    // add sensors
    device.sensors = await sensorModel.readSensor({ device: device.id });

    return res.json(transformDecorator({ data: device }));
  }
  async create(req, res, next) {
    if (!req.body.name) return next(new HttpError(400, "name is required"));
    const body = {
      id: crypto.randomUUID(),
      name: req.body.name,
      owner:
        req.user.role === "admin"
          ? req.body.owner || req.user.username
          : req.user.username,
    };

    await deviceModel.writeDevice(body);

    const [d] = await deviceModel.readDevice({ id: body.id });

    return res.status(201).json({ data: transformDecorator(d) });
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
    const { name, owner } = req.body;
    const newDevice = {
      id: device.id,
      name: name || device.name,
      owner: user.role === "admin" ? owner || device.owner : device.owner,
    };

    // create
    await deviceModel.writeDevice(newDevice);

    const [d] = await deviceModel.readDevice({ id: newDevice.id });

    return res.json({ data: transformDecorator(d) });
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

    // get sensors
    const sensors = await sensorModel.readSensor({ device: id });

    await Promise.all(
      sensors.map(async (s) => {
        // delete sensors
        await sensorModel.deleteSensor({ id: s.id });
        // delete data
        await dataModel.deleteData({ class: s.class, sensor_id: s.id });
      })
    );

    return res.status(204).send();
  }
  async deleteSensor(req, res, next) {
    const user = req.user;
    const { deviceId, sensorId } = req.params;
    const query = {
      id: deviceId,
    };

    // add ownership
    if (user.role !== "admin") query.owner = user.username;

    const sq = {
      device: deviceId,
      id: sensorId,
    };

    // get device
    const [device] = await deviceModel.readDevice(query);
    if (!device) {
      return next(new HttpError(404, "device not found"));
    }

    // get sensor
    const [sensor] = await sensorModel.readSensor(sq);
    if (!sensor) {
      return next(new HttpError(404, "sensor not found"));
    }

    // delete sensor
    const canDelete = await sensorModel.deleteSensor(sq);
    if (!canDelete) return next(new HttpError(500, "can not delete sensor"));

    // delete data
    await dataModel.deleteData({ class: sensor.class, sensor_id: sensor.id });

    return res.status(204).send();
  }
}

const deviceController = new DeviceController();
export default deviceController;
