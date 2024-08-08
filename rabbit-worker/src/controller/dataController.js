import dataModel from "../model/dataModel.js";
import sensorModel from "../model/sensorModel.js";
import { convert } from "../utils/convert.js";
import { transformMsg } from "../utils/transform.js";
import { validateClass, validateSensor } from "../utils/validation.js";

export default function dataController(channel) {
  return async (message) => {
    try {
      const d = transformMsg(message);
      const { class: c, id, df, ...payload } = d;

      if (!validateClass(c)) throw new Error("Invalid class");
      const v = await validateSensor({
        sensor_id: id,
        c,
        sensorModel,
      });
      if (!v.ok) throw new Error(v.message);

      const info = { class: c, sensor: id };
      const data = convert(payload, df, c);
      if (!data.length) {
        throw new Error("Invalid payload structure");
      }

      await dataModel.writeBatch(info, data);

      channel.ack(message);
    } catch (err) {
      console.error(err);
      channel.nack(message, false, false);
    }
  };
}
