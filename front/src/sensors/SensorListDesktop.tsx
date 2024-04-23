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

export interface SensorListDesktopProps {
  selectedRow?: Identifier;
}

const SensorsBulkActionButtons = () => (
  <>
    <BulkAcceptButton />
    <BulkRejectButton />
    <BulkDeleteButton />
  </>
);

const SensorListDesktop = ({ selectedRow }: SensorListDesktopProps) => (
  <DatagridConfigurable
    rowClick="edit"
    rowSx={rowSx(selectedRow)}
    bulkActionButtons={<SensorsBulkActionButtons />}
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
    <DateField source="date" />
    <CustomerReferenceField link={false} />
    <ProductReferenceField source="product_id" link={false} />
    <StarRatingField size="small" />
    <TextField source="comment" />
    <TextField source="status" />
  </DatagridConfigurable>
);

export default SensorListDesktop;
