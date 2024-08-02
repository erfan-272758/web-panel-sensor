import transformDecorator, {
  transformWithKeys,
} from "../decorator/transformDecorator.js";
import dataModel from "../models/dataModel.js";

class DataController {
  async getSensorData(req, res, next) {
    const { sensorId, sensorClass } = req.params;
    const { start, end, field } = req.query;

    // fetch data
    const data = await dataModel.readData({
      class: sensorClass,
      sensor_id: sensorId,
      start,
      end,
      _field: field,
    });

    return res.json(
      transformWithKeys(
        { data },
        { _value: "value", _field: "field", _time: "time" },
        ["sensor_id"]
      )
    );
  }
}

const dataController = new DataController();

export default dataController;
