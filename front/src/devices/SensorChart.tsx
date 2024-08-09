import { useCallback, useEffect, useMemo, useState } from "react";
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
import FavBtn from "../UI/FavBtn";
import localProvider from "../dataProvider/local";

type ChartDataMap = { [k: string]: ChartData[] | undefined };
type onFav = (active: boolean, field: string) => void;

export default function SensorChart({ sensor }: { sensor: any }) {
  const [chartDataMap, setChartDataMap] = useState<ChartDataMap>({});
  const [loading, setLoading] = useState(false);
  const notif = useNotify();
  const [dd, setDD] = useState({ start: new Date(), end: new Date() });

  const onFav = useCallback(
    (active: boolean, field: string) => {
      const favItem = {
        sensor,
        start: dd.start,
        end: dd.end,
        field,
      };
      if (active) {
        localProvider.addFav(favItem);
        notif("Add to favorite list", { type: "success" });
      } else {
        localProvider.delFav(favItem);
        notif("Delete from favorite list", { type: "success" });
      }
    },
    [sensor, dd]
  );

  const isFavFor = (field: string) => {
    return localProvider.isFav({
      sensor,
      field,
      start: dd.start,
      end: dd.end,
    });
  };

  const handleDateChange = async (startDate: Date, endDate: Date) => {
    setDD({ start: startDate, end: endDate });

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
        <EnvChart
          temp={chartDataMap.temp}
          hum={chartDataMap.hum}
          onFav={onFav}
          isTempFav={isFavFor("temp")}
          isHumFav={isFavFor("hum")}
        />
        <AccChart
          x={chartDataMap.x}
          y={chartDataMap.y}
          z={chartDataMap.z}
          isXFav={isFavFor("x")}
          isYFav={isFavFor("y")}
          isZFav={isFavFor("z")}
          onFav={onFav}
        />
        <InfoTable
          num={chartDataMap.num}
          text={chartDataMap.text}
          isNumFav={isFavFor("num")}
          isTextFav={isFavFor("text")}
          onFav={onFav}
        />
      </div>
    </div>
  ) : null;
}

interface EnvChartProps {
  temp?: ChartData[];
  hum?: ChartData[];
  onFav?: onFav;
  isTempFav?: boolean;
  isHumFav?: boolean;
}
interface AccChartProps {
  x?: ChartData[];
  y?: ChartData[];
  z?: ChartData[];
  onFav?: onFav;
  isXFav?: boolean;
  isYFav?: boolean;
  isZFav?: boolean;
}
interface InfoTableProps {
  text?: ChartData[];
  num?: ChartData[];
  onFav?: onFav;
  isTextFav?: boolean;
  isNumFav?: boolean;
}

const ContentWrapper: React.FC<{
  onFav?: onFav;
  field: string;
  isFav?: boolean;
}> = ({ onFav, isFav, field, ...props }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        padding: "5px",
        margin: "5px",
      }}
    >
      {props.children}
      {onFav ? (
        <FavBtn
          onClick={(active) => {
            onFav(Boolean(active), field);
          }}
          activeDefault={isFav}
          size="large"
          style={{
            height: "100%",
          }}
        />
      ) : null}
    </div>
  );
};

const EnvChart: React.FC<EnvChartProps> = ({
  temp,
  hum,
  onFav,
  isHumFav,
  isTempFav,
}) => {
  if (!temp && !hum) return null;
  const tempFormat = temp ? generateTimeFormat(temp) : null;
  const humFormat = hum ? generateTimeFormat(hum) : null;

  return (
    <>
      {temp ? (
        <ContentWrapper field="temp" onFav={onFav} isFav={isTempFav}>
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
        </ContentWrapper>
      ) : null}
      {hum ? (
        <ContentWrapper field="hum" onFav={onFav} isFav={isHumFav}>
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
        </ContentWrapper>
      ) : null}
    </>
  );
};

const AccChart: React.FC<AccChartProps> = ({
  x,
  y,
  z,
  onFav,
  isXFav,
  isYFav,
  isZFav,
}) => {
  if (!x && !y && !z) return null;

  const xFormat = x ? generateTimeFormat(x) : null;
  const yFormat = y ? generateTimeFormat(y) : null;
  const zFormat = z ? generateTimeFormat(z) : null;

  return (
    <>
      {x ? (
        <ContentWrapper field="x" onFav={onFav} isFav={isXFav}>
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
        </ContentWrapper>
      ) : null}
      {y ? (
        <ContentWrapper field="y" onFav={onFav} isFav={isYFav}>
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
        </ContentWrapper>
      ) : null}
      {z ? (
        <ContentWrapper field="z" onFav={onFav} isFav={isZFav}>
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
        </ContentWrapper>
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

const InfoTable: React.FC<InfoTableProps> = ({
  text,
  num,
  onFav,
  isNumFav,
  isTextFav,
}) => {
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
        <ContentWrapper field="text" onFav={onFav} isFav={isTextFav}>
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
        </ContentWrapper>
      ) : null}
      {num?.length ? (
        <ContentWrapper field="num" onFav={onFav} isFav={isNumFav}>
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
        </ContentWrapper>
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
