import { useEffect, useState } from "react";
import {
  Tooltip,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import sensorApi, { ChartData } from "../dataProvider/sensor";
import CustomDateTimeRangePicker from "../UI/CustomDateTimeRangePicker";
import LoadingOverlay from "../UI/LoadingOverlay";
import { useNotify } from "react-admin";

type ChartDataMap = { [k: string]: ChartData[] | undefined };

export default function SensorChart({ sensor }: { sensor: any }) {
  const [chartDataMap, setChartDataMap] = useState<ChartDataMap>({});
  const [loading, setLoading] = useState(false);
  const notif = useNotify();

  const handleDateChange = async (startDate: Date, endDate: Date) => {
    // Fetch data from InfluxDB based on the selected date range
    setLoading(true);
    let response: ChartDataMap = {};
    switch (sensor.class) {
      case "Env":
        const humResp = await sensorApi.fetchData(
          sensor,
          "hum",
          startDate,
          endDate
        );
        const tempResp = await sensorApi.fetchData(
          sensor,
          "temp",
          startDate,
          endDate
        );

        if (tempResp.error) {
          console.error(tempResp.error);
          notif("Error on fetch data for chart temperature", { type: "error" });
        } else {
          response.temp = tempResp.data;
        }
        if (humResp.error) {
          console.error(humResp.error);
          notif("Error on fetch data for chart humidity", { type: "error" });
        } else {
          response.hum = humResp.data;
        }

        break;

      default:
        break;
    }
    setChartDataMap(response);
    setLoading(false);
  };

  useEffect(() => {
    setChartDataMap({});
  }, [sensor?.id]);

  return sensor ? (
    <>
      <LoadingOverlay loading={loading} />
      <CustomDateTimeRangePicker
        onChange={handleDateChange}
        isChange={sensor?.id}
      />
      <EnvChart temp={chartDataMap.temp} hum={chartDataMap.hum} />
    </>
  ) : null;
}

interface ChartProps {
  temp?: ChartData[];
  hum?: ChartData[];
}

const EnvChart: React.FC<ChartProps> = ({ temp, hum }) => {
  if (!temp && !hum) return null;
  const tempFormat = temp ? generateTimeFormat(temp) : null;
  const humFormat = hum ? generateTimeFormat(hum) : null;

  return (
    <>
      {temp ? (
        <LineChart width={800} height={400} data={temp}>
          <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            tickFormatter={(v, i) => {
              const d = new Date(v);
              if (i == 0) {
                return new Intl.DateTimeFormat("en-US", {
                  day: "2-digit",
                  hour: "numeric",
                  minute: "numeric",
                }).format(d);
              }
              return tempFormat?.format(d) ?? "";
            }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            name="temperature"
            stroke="#8884d8"
            dot={<></>}
          />
        </LineChart>
      ) : null}
      {hum ? (
        <LineChart width={800} height={400} data={hum}>
          <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            tickFormatter={(v, i) => {
              const d = new Date(v);
              if (i == 0) {
                return new Intl.DateTimeFormat("en-US", {
                  day: "2-digit",
                  hour: "numeric",
                  minute: "numeric",
                }).format(d);
              }

              return humFormat?.format(d) ?? "";
            }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            name="humidity"
            stroke="#8884d8"
            dot={<></>}
          />
        </LineChart>
      ) : null}
    </>
  );
};

function generateTimeFormat(chart: ChartData[]) {
  const [f, l] = [chart[0], chart[chart.length - 1]];

  if (!f || !l) {
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  }

  const duration = Math.abs(
    new Date(f.time).getTime() - new Date(l.time).getTime()
  );

  const ops: Intl.DateTimeFormatOptions = {};
  const m = 60 * 1000;
  const h = 1 * 60 * m;
  const d = 24 * h;
  const mon = 30 * d;
  if (duration <= m) {
    ops.second = "numeric";
    ops.minute = "2-digit";
  } else if (duration <= h) {
    ops.minute = "2-digit";
    ops.hour = "2-digit";
  } else if (duration <= d) {
    ops.hour = "numeric";
    ops.day = "2-digit";
  } else if (duration <= mon) {
    ops.day = "2-digit";
  } else {
    ops.day = "numeric";
  }
  return new Intl.DateTimeFormat("en-US", ops);
}
