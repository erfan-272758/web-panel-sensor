import deviceModel from "../model/deviceModel.js";
import sensorModel from "../model/sensorModel.js";
import { validateClass } from "../utils/validation.js";

export default function initialController(socket) {
  return async (data, cb) => {
    try {
      if (!validateClass(data.class)) throw new Error("Invalid class");
      const id = data.id;
      const s = (await sensorModel.readSensor({ id }))?.[0];
      if (s) {
        return cb({ status: "success" });
      }

      //   check device
      const d = (await deviceModel.readDevice({ id: data.device }))?.[0];
      if (!d) {
        return cb({ status: "failed", message: "device id is wrong" });
      }

      await sensorModel.writeSensor(data);
      return cb({ status: "success" });
    } catch (err) {
      cb({ status: "failed", message: err.message });
    }
  };
}
