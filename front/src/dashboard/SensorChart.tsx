import { useCallback, useEffect, useState } from "react";
import {
  AccChart,
  ChartDataMap,
  EnvChart,
  InfoTable,
} from "../devices/SensorChart";
import { useNotify } from "react-admin";
import localProvider from "../dataProvider/local";
import sensorApi, { ChartData } from "../dataProvider/sensor";
import LoadingOverlay from "../UI/LoadingOverlay";
import { Typography } from "@mui/material";

export default function SensorChart({
  sensor,
  start,
  end,
  field,
}: {
  sensor: any;
  start: Date;
  end: Date;
  field: string;
}) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);
  const notif = useNotify();

  const onFav = useCallback(
    (active: boolean, field: string) => {
      const favItem = {
        sensor,
        start: start,
        end: end,
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
    [sensor, start, end]
  );

  const isFavFor = (field: string) => {
    return localProvider.isFav({
      sensor,
      field,
      start: start,
      end: end,
    });
  };

  const fetchData = async () => {
    // Fetch data from InfluxDB based on the selected date range
    setLoading(true);
    let response: ChartDataMap = {};
    const resp = await sensorApi.fetchData(sensor, field, start, end);
    if (resp.error) {
      console.error(resp.error);
      notif("Error on fetch data for chart", { type: "error" });
    } else {
      setChartData(resp.data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [sensor?.id]);

  const chart = () => {
    switch (sensor?.class) {
      case "Env":
        return (
          <EnvChart
            temp={field == "temp" ? chartData : undefined}
            hum={field == "hum" ? chartData : undefined}
            onFav={onFav}
            isTempFav={isFavFor("temp")}
            isHumFav={isFavFor("hum")}
          />
        );
      case "Acc":
        return (
          <AccChart
            x={field == "x" ? chartData : undefined}
            y={field == "y" ? chartData : undefined}
            z={field == "z" ? chartData : undefined}
            isXFav={isFavFor("x")}
            isYFav={isFavFor("y")}
            isZFav={isFavFor("z")}
            onFav={onFav}
          />
        );
      case "Info":
        return (
          <InfoTable
            num={field == "num" ? chartData : undefined}
            text={field == "text" ? chartData : undefined}
            isNumFav={isFavFor("num")}
            isTextFav={isFavFor("text")}
            onFav={onFav}
          />
        );

      default:
        return <></>;
    }
  };

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
      <div
        style={{
          marginTop: "20px",
          marginBottom: "5px",
        }}
      >
        <Typography>{sensor.name}</Typography>
        {chart()}
      </div>
    </div>
  ) : null;
}
