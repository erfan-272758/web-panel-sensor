import deviceModel from "../model/deviceModel.js";
import sensorModel from "../model/sensorModel.js";
import { transformMsg } from "../utils/transform.js";
import { validateClass } from "../utils/validation.js";

export default function initialController(channel) {
  return async (message) => {
    try {
      const data = transformMsg(message);
      if (!validateClass(data.class)) throw new Error("Invalid class");

      const id = data.id;
      const s = (await sensorModel.readSensor({ id }))?.[0];
      if (s) {
        return channel.ack(message, false);
      }

      //   check device
      const d = (await deviceModel.readDevice({ id: data.device }))?.[0];
      if (!d) {
        return channel.nack(message, false, false);
      }

      await sensorModel.writeSensor(data);
      return channel.ack(message, false);
    } catch (err) {
      console.error(err);
      channel.nack(message, false, false);
    }
  };
}
