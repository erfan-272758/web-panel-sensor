import { Point } from "@influxdata/influxdb-client";
import { DeleteAPI } from "@influxdata/influxdb-client-apis";
import { db } from "../config.js";
import bfs from "../utils/bfs.js";

export const sensorSample = {
  id: "",
  name: "",
  device: "",
  security_code: "",
  tZone: "+03:30",
  tSource: "GPS",
  inst_lat: 0,
  inst_lon: 0,
  inst_operator_id: 0,
  inst_time: "",
  inst_cellular_no: "",
  inst_cellular_operator: "",
  class: "",
};

class SensorModel {
  getWriteClient() {
    return db.getWriteApi("organ", "default", "ms");
  }
  getQueryClient() {
    return db.getQueryApi("organ");
  }
  async writeSensor(sensor) {
    const point = new Point("sensors");

    for (const key in sensor) {
      const value = sensor[key];
      point.tag(key, typeof value === "object" ? JSON.stringify(value) : value);
    }
    point.booleanField("active", true);
    point.timestamp(new Date());

    //    write
    const writeClient = this.getWriteClient();
    writeClient.writePoint(point);
    return await writeClient.close();
  }
  async deleteSensor(query) {
    const parsedQ = `_measurement=\"sensors\" and ${Object.entries(query)
      .map(([k, v]) => `${k}=\"${v}\"`)
      .join(" and ")} `;

    const deleteApi = new DeleteAPI(db);
    try {
      await deleteApi.postDelete({
        bucket: "default",
        org: "organ",
        body: {
          start: new Date(0).toISOString(),
          stop: new Date().toISOString(),
          predicate: parsedQ,
        },
      });
      return true;
    } catch (err) {
      return false;
    }
  }
  readSensor(query) {
    const queryApi = this.getQueryClient();

    // convert extraKeys
    const parsedQuery = Object.entries(query)
      .map(([k, v]) => {
        let useRegex = false;
        if (v.startsWith("$regex_")) {
          useRegex = true;
          v = v.split("$regex_")[1];
        }
        return `r.${k} ${useRegex ? `=~ /${v}/` : `== "${v}"`}`;
      })
      .join(" and ");

    const finalQuery = `
      from(bucket: "default")
        |> range(start: 1970-01-01)
        |> filter(fn: (r) => r._measurement == "sensors" ${
          parsedQuery ? `and ${parsedQuery}` : ""
        })
    `;

    // convert result
    const convertResult = (result = []) => {
      bfs(result, ({ parent, key, value }) => {
        try {
          parent[key] = JSON.parse(value);
        } catch (err) {}
      });
    };
    return new Promise((resolve, reject) => {
      const result = [];
      queryApi.queryRows(finalQuery, {
        next(row, tableMeta) {
          const sensor = tableMeta.toObject(row);
          result.push(sensor);
        },
        error(error) {
          reject(error);
        },
        complete() {
          convertResult(result);
          resolve(result);
        },
      });
    });
  }
}

const sensorModel = new SensorModel();
export default sensorModel;
