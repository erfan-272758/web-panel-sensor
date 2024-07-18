import deviceModel from "../src/model/deviceModel.js";
import sensorModel from "../src/model/sensorModel.js";
import { transformMsg } from "../src/utils/transform.js";

export default function initialController(channel) {
  return async (message) => {
    try {
      const data = transformMsg(message);
      const uid = data.uid;
      const s = (await sensorModel.readSensor({ uid }))?.[0];
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
