import deviceModel from "../src/model/deviceModel.js";
import sensorModel from "../src/model/sensorModel.js";

export default function initialController(socket) {
  return async (data, cb) => {
    try {
      const uid = data.uid;
      const s = (await sensorModel.readSensor({ uid }))?.[0];
      if (s) {
        return cb({ status: "success" });
      }

      //   check device
      const d = (await deviceModel.readDevice({ id: data.device }))?.[0];
      if (!d) {
        return cb({ status: "failed" });
      }

      await sensorModel.writeSensor(data);
      return cb({ status: "success" });
    } catch (err) {
      cb({ status: "failed", message: err.message });
    }
  };
}
