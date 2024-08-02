export interface ChartData {
  date: string;
  value: number;
}

class SensorApi {
  async fetchData(
    sensorId: string,
    start: Date,
    end: Date
  ): Promise<ChartData[]> {
    await new Promise((resolve) => {
      setTimeout(resolve, 5000);
    });
    return [];
  }
}

const sensorApi = new SensorApi();

export default sensorApi;
