import dataModel from "../model/dataModel.js";
import sensorModel from "../model/sensorModel.js";
import { convert } from "../utils/convert.js";
import { validateClass, validateSensor } from "../utils/validation.js";

export default function dataController(socket) {
  return async (d, cb) => {
    try {
      const { class: c, id, df, ...payload } = d;
      if (!validateClass(c)) throw new Error("Invalid class");

      // const v = await validateSensor({
      //   sensor_id: id,
      //   c,
      //   sensorModel,
      // });
      // if (!v.ok) throw new Error(v.message);

      const info = { class: c, sensor: id };
      const data = convert(payload, df, c);
      if (!data.length) {
        return cb({ status: "failed", message: "Invalid payload structure" });
      }
      await dataModel.writeBatch(info, data);
      cb({ status: "success" });
    } catch (err) {
      cb({ status: "failed", message: err.message });
    }
  };
}
