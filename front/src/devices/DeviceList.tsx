import * as React from "react";
import { useCallback } from "react";
import {
  CreateButton,
  ExportButton,
  FilterButton,
  List,
  SelectColumnsButton,
  TopToolbar,
} from "react-admin";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import { Box, Drawer, useMediaQuery, Theme } from "@mui/material";

import DeviceListMobile from "./DeviceListMobile";
import DeviceListDesktop from "./DeviceListDesktop";
import DeviceFilters from "./deviceFilters";

const DeviceListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

const DeviceList = () => {
  return (
    <Box display="flex">
      <List
        filters={DeviceFilters}
        perPage={25}
        sort={{ field: "date", order: "DESC" }}
        actions={<DeviceListActions />}
      >
        <DeviceListDesktop />
      </List>
    </Box>
  );
};

export default DeviceList;
