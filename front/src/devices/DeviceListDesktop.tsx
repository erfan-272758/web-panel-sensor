import * as React from "react";
import {
  BulkDeleteButton,
  DatagridConfigurable,
  DateField,
  DeleteButton,
  EditButton,
  Identifier,
  TextField,
} from "react-admin";

import rowSx from "./rowSx";

import BulkAcceptButton from "./BulkAcceptButton";
import BulkRejectButton from "./BulkRejectButton";
import { IconButton } from "@mui/material";
import CopyBtn from "../UI/CopyBtn";

export interface DeviceListDesktopProps {
  selectedRow?: Identifier;
}

const DevicesBulkActionButtons = () => (
  <>
    <BulkAcceptButton />
    <BulkRejectButton />
    <BulkDeleteButton mutationMode="pessimistic" />
  </>
);

const DeviceListDesktop = ({ selectedRow }: DeviceListDesktopProps) => (
  <DatagridConfigurable
    rowClick="show"
    rowSx={rowSx(selectedRow)}
    bulkActionButtons={<DevicesBulkActionButtons />}
    sx={{
      "& .RaDatagrid-thead": {
        borderLeftColor: "transparent",
        borderLeftWidth: 5,
        borderLeftStyle: "solid",
      },
      "& .column-comment": {
        maxWidth: "15em",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
    }}
  >
    <TextField source="name" />
    <TextField source="owner" />
    <TextField source="sensors" />
    <DateField source="createdAt" />
    <CopyBtn getContent={(r) => r.id} />
    <EditButton />
    <DeleteButton mutationMode="pessimistic" />
  </DatagridConfigurable>
);

export default DeviceListDesktop;
