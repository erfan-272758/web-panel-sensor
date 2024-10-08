import { Card, Stack } from "@mui/material";
import {
  ArrayField,
  Datagrid,
  DatagridHeader,
  DateField,
  Show,
  ShowButton,
  Tab,
  TabbedShowLayout,
  TextField,
  useRecordContext,
} from "react-admin";
import { SensorInfoField } from "./SensorInfo";
import SensorChart from "./SensorChart";
import { useState } from "react";

export default function DeviceShow(props: any) {
  const record = useRecordContext();
  const [sensor, setSensor] = useState<any>(null);

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
              rowClick={(id, res, record) => {
                setSensor(record);
                return false;
              }}
            >
              <TextField source="id" />
              <TextField source="name" />
              <TextField source="class" />
              <DateField source="createdAt" />
            </Datagrid>
          </ArrayField>
          <SensorInfoField sensor={sensor} />
          <SensorChart sensor={sensor} />
        </Tab>
      </TabbedShowLayout>
    </Show>
  );
}
