import * as React from "react";
import { List } from "@mui/material";
import { RecordContextProvider, useListContext } from "react-admin";

import { SensorItem } from "./SensorItem";
import { Sensor } from "../types";

const SensorListMobile = () => {
  const { data, isLoading, total } = useListContext<Sensor>();
  if (isLoading || Number(total) === 0) {
    return null;
  }
  return (
    <List sx={{ width: "calc(100vw - 33px)" }}>
      {data.map((Sensor) => (
        <RecordContextProvider value={Sensor} key={Sensor.id}>
          <SensorItem />
        </RecordContextProvider>
      ))}
    </List>
  );
};

export default SensorListMobile;
