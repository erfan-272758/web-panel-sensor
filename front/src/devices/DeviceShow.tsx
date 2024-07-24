import { Card, Stack } from "@mui/material";
import {
  ArrayField,
  Button,
  Datagrid,
  DatagridHeader,
  DateField,
  EditButton,
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
  WrapperField,
} from "react-admin";

export default function DeviceShow(props: any) {
  return (
    <Show {...props}>
      <TabbedShowLayout>
        <Tab label="General Information">
          <TextField source="name" />
          <TextField source="t_zone" label="Time Zone" />
          <Card variant="outlined">
            <Stack title="Installation" style={{ paddingLeft: "10px" }}>
              <Labeled style={{ margin: "5px" }}>
                <TextField source="installation.lat" label="latitude" />
              </Labeled>
              <Labeled style={{ margin: "5px" }}>
                <TextField source="installation.lon" label="longitude" />
              </Labeled>
              <Labeled style={{ margin: "5px" }}>
                <TextField
                  source="installation.operator_id"
                  label="Operator ID"
                />
              </Labeled>
              <Labeled style={{ margin: "5px" }}>
                <DateField
                  source="installation.installation_time"
                  label="Installation Time"
                />
              </Labeled>
              <Labeled style={{ margin: "5px" }}>
                <TextField
                  source="installation.cellular_no"
                  label="Cellular Number"
                />
              </Labeled>
              <Labeled style={{ margin: "5px" }}>
                <TextField
                  source="installation.cellular_operator"
                  label="Cellular Operator"
                />
              </Labeled>
              <Labeled style={{ margin: "5px" }}>
                <TextField source="installation.cert" label="Cert" />
              </Labeled>
            </Stack>
          </Card>
          <TextField source="owner" />
          <DateField label="Creation date" source="createdAt" />
        </Tab>
        <Tab label="Sensors">
          <ArrayField source="sensors" sortable label={false}>
            <Datagrid
              bulkActionButtons={false}
              header={(props) => {
                const newChildren = [] as any;
                if (props.children) {
                  const children = props.children as any;
                  for (const child of children) {
                    if (child?.props?.label === "Show") {
                      newChildren.push({
                        ...child,
                        props: { ...child, label: "Chart" },
                      });
                    } else newChildren.push(child);
                  }
                }

                return <DatagridHeader {...props} children={newChildren} />;
              }}
            >
              <TextField source="name" />
              <TextField source="protocol" />
              <TextField source="port" />
              <TextField source="data_type" />
              <ShowButton
                label="Show"
                onClick={(e) => {
                  e.preventDefault();
                  console.log("call", e.target);
                }}
              />
            </Datagrid>
          </ArrayField>
        </Tab>
      </TabbedShowLayout>
    </Show>
  );
}
