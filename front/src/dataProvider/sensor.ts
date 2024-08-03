import api from "../api";

export interface ChartData {
  filed: string;
  value: any;
  time: string;
}

class SensorApi {
  async fetchData(
    sensor: any,
    field: string,
    start: Date,
    end: Date
  ): Promise<{ data?: ChartData[]; error?: unknown }> {
    try {
      const data = await api.get(`/data/${sensor.class}/${sensor.id}`, {
        params: {
          field,
          start,
          end,
        },
      });
      return { data: data.data };
    } catch (err) {
      return { error: err };
    }
  }
}

const sensorApi = new SensorApi();

export default sensorApi;
