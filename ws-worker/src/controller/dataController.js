import dataModel from "../model/dataModel.js";
import sensorModel from "../model/sensorModel.js";
import { validateClass, validateSensor } from "../utils/validation.js";

export default function dataController(socket) {
  return async (d, cb) => {
    try {
      const { class: c, id, payload: p } = d;
      if (!validateClass(c)) throw new Error("Invalid class");

      const v = await validateSensor({
        sensor_id: id,
        c,
        sensorModel,
      });
      if (!v.ok) throw new Error(v.message);

      const info = { class: c, sensor: id };
      const payload = {};

      switch (c) {
        case "Env":
          if (typeof p.temp == "number") {
            payload.temp = p.temp;
          }
          if (typeof p.hum == "number") {
            payload.hum = p.hum;
          }
          break;
        case "Acc":
          if (typeof p.coordinate === "string") {
            const [x, y, z] = p.coordinate.split(",").map((c) => +c);

            if (typeof x === "number" && !Number.isNaN(x)) {
              payload.x = x;
            }
            if (typeof y === "number" && !Number.isNaN(y)) {
              payload.y = y;
            }
            if (typeof z === "number" && !Number.isNaN(z)) {
              payload.z = z;
            }
          }
          break;
        case "Info":
          if (typeof p.text === "string") {
            payload.text = p.text;
          }
          if (typeof p.num === "number") {
            payload.num = p.num;
          }
          break;

        default:
          return cb({ status: "failed", message: "Invalid class" });
      }

      if (!Object.keys(payload).length) {
        return cb({ status: "failed", message: "Invalid payload structure" });
      }

      payload.at = p.at;
      await dataModel.writeData(info, payload);

      cb({ status: "success" });
    } catch (err) {
      cb({ status: "failed", message: err.message });
    }
  };
}
