import { useEffect, useMemo, useState } from "react";
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
      case "Acc":
        const xResp = await sensorApi.fetchData(
          sensor,
          "x",
          startDate,
          endDate
        );
        const yResp = await sensorApi.fetchData(
          sensor,
          "y",
          startDate,
          endDate
        );
        const zResp = await sensorApi.fetchData(
          sensor,
          "z",
          startDate,
          endDate
        );

        if (xResp.error) {
          console.error(xResp.error);
          notif("Error on fetch data for chart x", { type: "error" });
        } else {
          response.x = xResp.data;
        }
        if (yResp.error) {
          console.error(yResp.error);
          notif("Error on fetch data for chart y", { type: "error" });
        } else {
          response.y = yResp.data;
        }
        if (zResp.error) {
          console.error(zResp.error);
          notif("Error on fetch data for chart z", { type: "error" });
        } else {
          response.z = zResp.data;
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
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LoadingOverlay loading={loading} />
      <CustomDateTimeRangePicker
        onChange={handleDateChange}
        isChange={sensor?.id}
      />
      <div
        style={{
          marginTop: "20px",
          marginBottom: "5px",
        }}
      >
        <EnvChart temp={chartDataMap.temp} hum={chartDataMap.hum} />
        <AccChart x={chartDataMap.x} y={chartDataMap.y} z={chartDataMap.z} />
      </div>
    </div>
  ) : null;
}

interface EnvChartProps {
  temp?: ChartData[];
  hum?: ChartData[];
}
interface AccChartProps {
  x?: ChartData[];
  y?: ChartData[];
  z?: ChartData[];
}

const EnvChart: React.FC<EnvChartProps> = ({ temp, hum }) => {
  if (!temp && !hum) return null;
  const tempFormat = temp ? generateTimeFormat(temp) : null;
  const humFormat = hum ? generateTimeFormat(hum) : null;

  return (
    <>
      {temp ? (
        <LineChart width={800} height={400} data={temp}>
          <CartesianGrid stroke="#dddd" />
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
            name="Temperature"
            stroke="#90caf9"
            dot={<></>}
          />
        </LineChart>
      ) : null}
      {hum ? (
        <LineChart width={800} height={400} data={hum}>
          <CartesianGrid stroke="#dddd" />
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
            name="Humidity"
            stroke="#8884d8"
            dot={<></>}
          />
        </LineChart>
      ) : null}
    </>
  );
};

const AccChart: React.FC<AccChartProps> = ({ x, y, z }) => {
  if (!x || !y || !z) return null;
  const acc = x || y || z;
  const accFormat = acc ? generateTimeFormat(acc) : null;
  // Calculate acceleration based on the provided data
  const accelerationData = useMemo(() => {
    return (
      x
        // map to point
        .map((_, i) => ({
          x: x[i].value,
          y: y[i].value,
          z: z[i].value,
          time: new Date(x[i].time),
        }))
        // map to speed
        .map((point, index, data) => {
          if (index === 0) {
            return { time: point.time, speed: 0 }; // Assuming initial speed is 0
          } else {
            const prevPoint = data[index - 1];
            const locChange = Math.sqrt(
              (point.x - prevPoint.x) ** 2 +
                (point.y - prevPoint.y) ** 2 +
                (point.z - prevPoint.z) ** 2
            );
            const timeChange =
              (point.time.getTime() - prevPoint.time.getTime()) / 1000;
            return { time: point.time, speed: locChange / timeChange };
          }
        })
        // map to acc
        .map((s, index, d) => {
          if (index === 0) {
            return { time: s.time, acc: 0 }; // Assuming initial acc is 0
          } else {
            const prevS = d[index - 1];
            const speedChange = s.speed - prevS.speed;
            const timeChange = (s.time.getTime() - prevS.time.getTime()) / 1000;
            return { time: s.time, acc: speedChange / timeChange };
          }
        })
    );
  }, [x, y, z]);

  return (
    <LineChart width={800} height={400} data={accelerationData}>
      <CartesianGrid />
      <XAxis
        dataKey="time"
        stroke="#dddd"
        tickFormatter={(v, i) => {
          const d = new Date(v);
          if (i == 0) {
            return new Intl.DateTimeFormat("en-US", {
              day: "2-digit",
              hour: "numeric",
              minute: "numeric",
            }).format(d);
          }

          return accFormat?.format(d) ?? "";
        }}
      />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="acc"
        name="Acceleration"
        stroke="#8884d8"
        dot={<></>}
      />
    </LineChart>
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
