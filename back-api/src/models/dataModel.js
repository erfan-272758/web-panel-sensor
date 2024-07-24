import { Point } from "@influxdata/influxdb-client";
import { DeleteAPI } from "@influxdata/influxdb-client-apis";
import { db } from "../config.js";
import bfs from "../utils/bfs.js";

export const envSample = {
  sensor_id: "",
  data: "",
  timestamp: "",
};
export const accelSample = {
  sensor_id: "",
};
export const infoSample = {
  sensor_id: "",
};
export const outSample = {
  sensor_id: "",
};

class DataModel {
  getWriteClient() {
    return db.getWriteApi("organ", "default", "ms");
  }
  getQueryClient() {
    return db.getQueryApi("organ");
  }
  async writeData(info, payload) {
    const point = new Point(info.class);

    point.tag("sensor_id", info.sensor);
    const field = Object.keys(payload).filter((k) => k != "at")[0];
    switch (typeof payload[field]) {
      case "number":
        if (Number.isInteger(payload[field])) {
          point.intField(field, payload[field]);
        } else {
          point.floatField(field, payload[field]);
        }
        break;
      case "string":
        point.stringField(field, payload[field]);
        break;
      case "boolean":
        point.booleanField(field, payload[field]);
        break;
    }

    point.timestamp(payload.at ? new Date(payload.at) : new Date());

    //    write
    const writeClient = this.getWriteClient();
    writeClient.writePoint(point);
    return await writeClient.close();
  }
  async deleteData(query) {
    const parsedQ = `_measurement=\"${query.class}\" and ${Object.entries(query)
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
  readData(query) {
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
        |> filter(fn: (r) => r._measurement == "${query.class}" ${
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
          const data = tableMeta.toObject(row);
          result.push(data);
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

const dataModel = new DataModel();
export default dataModel;
