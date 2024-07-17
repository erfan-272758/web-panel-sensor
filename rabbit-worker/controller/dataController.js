import dataModel from "../src/model/dataModel.js";
import { transformMsg } from "../src/utils/transform.js";

export default function dataController(channel) {
  return async (message) => {
    try {
      const { class: c, uid, payload } = transformMsg(message);
      await dataModel.writeData({ class: c, sensor: uid }, payload);
      channel.ack(message);
    } catch (err) {
      channel.nack(message, false, false);
    }
  };
}
