import * as React from "react";
import {
  BulkDeleteButton,
  DatagridConfigurable,
  DateField,
  Identifier,
  TextField,
} from "react-admin";

import ProductReferenceField from "../products/ProductReferenceField";
import CustomerReferenceField from "../visitors/CustomerReferenceField";
import StarRatingField from "./StarRatingField";
import rowSx from "./rowSx";

import BulkAcceptButton from "./BulkAcceptButton";
import BulkRejectButton from "./BulkRejectButton";

export interface DeviceListDesktopProps {
  selectedRow?: Identifier;
}

const DevicesBulkActionButtons = () => (
  <>
    <BulkAcceptButton />
    <BulkRejectButton />
    <BulkDeleteButton />
  </>
);

const DeviceListDesktop = ({ selectedRow }: DeviceListDesktopProps) => (
  <DatagridConfigurable
    rowClick="edit"
    rowSx={rowSx(selectedRow)}
    bulkActionButtons={<DevicesBulkActionButtons />}
    sx={{
      "& .RaDatagrid-thead": {
        borderLeftColor: "transparent",
        borderLeftWidth: 5,
        borderLeftStyle: "solid",
      },
      "& .column-comment": {
        maxWidth: "18em",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
    }}
  >
    <TextField source="name" />
    <TextField source="owner" />
    <TextField source="sensors" />
    <DateField source="initialAt" />
  </DatagridConfigurable>
);

export default DeviceListDesktop;
