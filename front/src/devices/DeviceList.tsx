import * as React from "react";
import {
  CreateButton,
  ExportButton,
  FilterButton,
  List,
  TopToolbar,
} from "react-admin";
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
    <List
      filters={DeviceFilters}
      perPage={25}
      sort={{ field: "date", order: "DESC" }}
      actions={<DeviceListActions />}
    >
      <DeviceListDesktop />
    </List>
  );
};

export default DeviceList;
