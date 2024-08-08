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
import { Datagrid, DatagridBody, useNotify } from "react-admin";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

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
      case "Info":
        const textResp = await sensorApi.fetchData(
          sensor,
          "text",
          startDate,
          endDate
        );
        const numResp = await sensorApi.fetchData(
          sensor,
          "num",
          startDate,
          endDate
        );

        if (textResp.error) {
          console.error(textResp.error);
          notif("Error on fetch data for chart text", { type: "error" });
        } else {
          response.text = textResp.data;
        }
        if (numResp.error) {
          console.error(numResp.error);
          notif("Error on fetch data for chart number", { type: "error" });
        } else {
          response.num = numResp.data;
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
        <InfoTable num={chartDataMap.num} text={chartDataMap.text} />
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
interface InfoTableProps {
  text?: ChartData[];
  num?: ChartData[];
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
  if (!x && !y && !z) return null;

  const xFormat = x ? generateTimeFormat(x) : null;
  const yFormat = y ? generateTimeFormat(y) : null;
  const zFormat = z ? generateTimeFormat(z) : null;

  return (
    <>
      {x ? (
        <LineChart width={800} height={400} data={x}>
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

              return xFormat?.format(d) ?? "";
            }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            name="Acceleration X"
            stroke="#8884d8"
            dot={<></>}
          />
        </LineChart>
      ) : null}
      {y ? (
        <LineChart width={800} height={400} data={y}>
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

              return yFormat?.format(d) ?? "";
            }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            name="Acceleration Y"
            stroke="#90caf9"
            dot={<></>}
          />
        </LineChart>
      ) : null}
      {z ? (
        <LineChart width={800} height={400} data={z}>
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

              return zFormat?.format(d) ?? "";
            }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            name="Acceleration Z"
            stroke="#8884d8"
            dot={<></>}
          />
        </LineChart>
      ) : null}
    </>
  );
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const InfoTable: React.FC<InfoTableProps> = ({ text, num }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      {text?.length ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Text</StyledTableCell>
                <StyledTableCell align="right">Time</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {text.map((row, i) => (
                <StyledTableRow key={row.time + i}>
                  <StyledTableCell component="th" scope="row">
                    {row.value}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {new Date(row.time).toDateString()}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}
      {num?.length ? (
        <TableContainer
          component={Paper}
          style={{
            marginTop: text ? "20px" : "0",
          }}
        >
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Number</StyledTableCell>
                <StyledTableCell align="right">Time</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {num.map((row, i) => (
                <StyledTableRow key={row.time + i}>
                  <StyledTableCell component="th" scope="row">
                    {row.value}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {new Date(row.time).toDateString()}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}
    </div>
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
