import { useState } from "react";
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

export default function SensorChart({ sensor }: { sensor: any }) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);

  const handleDateChange = async (startDate: Date, endDate: Date) => {
    // Fetch data from InfluxDB based on the selected date range
    setLoading(true);
    const data = await sensorApi.fetchData(sensor.id, startDate, endDate);
    setChartData(data);
    setLoading(false);
  };

  return sensor ? (
    <>
      <LoadingOverlay loading={loading} />
      <CustomDateTimeRangePicker
        onChange={handleDateChange}
        isChange={sensor?.id}
      />
      <EnvChart data={chartData} />
    </>
  ) : null;
}

interface ChartProps {
  data: ChartData[];
}

const EnvChart: React.FC<ChartProps> = ({ data }) => (
  <LineChart width={800} height={400} data={data}>
    <CartesianGrid stroke="#f5f5f5" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="value" stroke="#8884d8" />
  </LineChart>
);
