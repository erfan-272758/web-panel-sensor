import { Card, Stack } from "@mui/material";
import {
  ArrayField,
  Button,
  Datagrid,
  DatagridHeader,
  DateField,
  EditButton,
  FunctionField,
  Labeled,
  ListActions,
  RichTextField,
  Show,
  ShowActions,
  ShowButton,
  SimpleList,
  SimpleShowLayout,
  SingleFieldList,
  Tab,
  TabbedShowLayout,
  TextField,
  useRecordContext,
  WrapperField,
} from "react-admin";
import { SensorInfoField } from "./SensorInfo";
import SensorChart from "./SensorChart";
import { useState } from "react";

export default function DeviceShow(props: any) {
  const record = useRecordContext();
  const [sensor, setSensor] = useState();

  return (
    <Show {...props}>
      <TabbedShowLayout>
        <Tab label="General Information">
          <TextField source="id" />
          <TextField source="name" />
          <TextField source="owner" />
          <DateField label="Creation date" source="createdAt" />
        </Tab>
        <Tab label="Sensors">
          <ArrayField source="sensors" sortable label={false}>
            <Datagrid
              bulkActionButtons={false}
              header={(props) => {
                return <DatagridHeader {...props} />;
              }}
            >
              <TextField source="id" />
              <TextField source="name" />
              <TextField source="class" />
              <TextField source="createdAt" />
              <ShowButton
                label="Show"
                onClick={(e) => {
                  e.preventDefault();
                  console.log("call", e.target);
                }}
              />
            </Datagrid>
          </ArrayField>
          <SensorInfoField sensor={sensor} />
          <SensorChart sensor={sensor} />
        </Tab>
      </TabbedShowLayout>
    </Show>
  );
}
