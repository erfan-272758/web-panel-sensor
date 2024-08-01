import { Card, Stack } from "@mui/material";
import {
  DateField,
  DateInput,
  FunctionField,
  Labeled,
  NumberInput,
  TextField,
  TextInput,
} from "react-admin";

export function SensorInfoField({ sensor }: any) {
  return sensor ? (
    <Card variant="outlined">
      <Stack title="Installation" style={{ paddingLeft: "10px" }}>
        <Labeled style={{ margin: "5px" }}>
          <TextField label="latitude" source="inst_lat" record={sensor} />
        </Labeled>
        <Labeled style={{ margin: "5px" }}>
          <TextField source="inst_lon" label="longitude" record={sensor} />
        </Labeled>
        <Labeled style={{ margin: "5px" }}>
          <TextField
            source="inst_operator_id"
            label="Operator ID"
            record={sensor}
          />
        </Labeled>
        <Labeled style={{ margin: "5px" }}>
          <DateField
            source="inst_time"
            label="Installation Time"
            record={sensor}
          />
        </Labeled>
        <Labeled style={{ margin: "5px" }}>
          <TextField
            source="inst_cellular_no"
            label="Cellular Number"
            record={sensor}
          />
        </Labeled>
        <Labeled style={{ margin: "5px" }}>
          <TextField
            source="inst_cellular_operator"
            label="Cellular Operator"
            record={sensor}
          />
        </Labeled>
        <Labeled style={{ margin: "5px" }}>
          <TextField source="inst_cert" label="Cert" record={sensor} />
        </Labeled>
      </Stack>
    </Card>
  ) : null;
}
export function SensorInfoInput() {
  return (
    <>
      {/* <Labeled>
      </Labeled> */}
      {/* <Labeled>
      </Labeled> */}
      {/* <Labeled>
      </Labeled> */}
      {/* <Labeled>
      </Labeled> */}
      {/* <Labeled>
      </Labeled>
      <Labeled>
      </Labeled>
      <Labeled>
      </Labeled> */}
    </>
  );
}
