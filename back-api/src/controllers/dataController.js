import transformDecorator, {
  transformWithKeys,
} from "../decorator/transformDecorator.js";
import { HttpError } from "../errors/HttpError.js";
import dataModel from "../models/dataModel.js";

class DataController {
  async getSensorData(req, res, next) {
    const { sensorId, sensorClass } = req.params;
    const { start, end, field } = req.query;

    const s = new Date(start ? start : "1970"),
      e = new Date(end ? end : Date.now());
    if (e.getTime() < s.getTime())
      return next(new HttpError(400, "start must be before end"));
    if (s.getTime() > Date.now())
      return next(new HttpError(400, "start must be before now"));
    // fetch data
    const data = await dataModel.readData({
      class: sensorClass,
      sensor_id: sensorId,
      start: s.toISOString(),
      end: e,
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
