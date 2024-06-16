import { Point } from "@influxdata/influxdb-client";
import { db } from "../config.js";

class UserModel {
  getWriteClient() {
    return db.getWriteApi("organ", "default", "ms");
  }
  getQueryClient() {
    return db.getQueryApi("organ");
  }
  async writeUser(user) {
    const point = new Point("users");

    for (const key in user) {
      const value = user[key];
      point.tag(key, value);
    }
    point.booleanField("active", true);
    point.timestamp(new Date());

    //    write
    const writeClient = this.getWriteClient();
    writeClient.writePoint(point);
    return await writeClient.close();
  }

  readUser(query, notRemovePass) {
    const queryApi = this.getQueryClient();

    // convert extraKeys
    const parsedQuery = Object.entries(query)
      .map(([k, v]) => `r.${k} == "${v}"`)
      .join(" and ");

    const finalQuery = `
      from(bucket: "default")
        |> range(start: -1h)
        |> filter(fn: (r) => r._measurement == "users" ${
          parsedQuery ? `and ${parsedQuery}` : ""
        })
    `;

    return new Promise((resolve, reject) => {
      const result = [];
      queryApi.queryRows(finalQuery, {
        next(row, tableMeta) {
          const user = tableMeta.toObject(row);
          result.push(user);
        },
        error(error) {
          reject(error);
        },
        complete() {
          if (!notRemovePass) {
            for (const user of result) {
              delete user.password;
            }
          }
          resolve(result);
        },
      });
    });
  }
}

const userModel = new UserModel();
export default userModel;
