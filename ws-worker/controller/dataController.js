import dataModel from "../src/model/dataModel.js";

export default function dataController(socket) {
  return async (data, cb) => {
    try {
      const { class: c, uid, payload } = data;
      await dataModel.writeData({ class: c, sensor: uid }, payload);

      cb({ status: "success" });
    } catch (err) {
      cb({ status: "failed" });
    }
  };
}
