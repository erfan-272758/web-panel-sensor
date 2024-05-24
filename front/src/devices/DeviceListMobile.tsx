import * as React from "react";
import { List } from "@mui/material";
import { RecordContextProvider, useListContext } from "react-admin";

import { DeviceItem } from "./DeviceItem";
import { Device } from "../types";

const DeviceListMobile = () => {
  const { data, isLoading, total } = useListContext<Device>();
  if (isLoading || Number(total) === 0) {
    return null;
  }
  return (
    <List sx={{ width: "calc(100vw - 33px)" }}>
      {data.map((Device) => (
        <RecordContextProvider value={Device} key={Device.id}>
          <DeviceItem />
        </RecordContextProvider>
      ))}
    </List>
  );
};

export default DeviceListMobile;
