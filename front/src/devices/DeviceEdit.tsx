import * as React from "react";
import {
  ArrayInput,
  AutocompleteInput,
  BooleanInput,
  DateField,
  DateInput,
  Edit,
  Form,
  Labeled,
  NumberInput,
  PrevNextButtons,
  ReferenceField,
  ReferenceInput,
  required,
  SelectInput,
  SimpleForm,
  SimpleFormIterator,
  Tab,
  TabbedForm,
  TextField,
  TextInput,
  Toolbar,
  useRecordContext,
  useTranslate,
} from "react-admin";
import { Link as RouterLink } from "react-router-dom";
import { Card, CardContent, Box, Grid, Typography, Link } from "@mui/material";

import { Device, Customer } from "../types";
import { SensorInfoInput } from "./SensorInfo";

const DeviceEdit = () => (
  <Edit component="div">
    <DeviceForm />
  </Edit>
);

const CustomerDetails = () => {
  const record = useRecordContext<Customer>();
  return (
    <div>
      <Typography
        component={RouterLink}
        color="primary"
        to={`/customers/${record?.id}`}
        style={{ textDecoration: "none" }}
      >
        {record?.first_name} {record?.last_name}
      </Typography>
      <br />
      <Typography
        component={Link}
        color="primary"
        href={`mailto:${record?.email}`}
        style={{ textDecoration: "none" }}
      >
        {record?.email}
      </Typography>
    </div>
  );
};

const Spacer = () => <Box mb={1}>&nbsp;</Box>;

const DeviceForm = () => {
  const translate = useTranslate();
  return (
    // <SimpleForm defaultValues={{ status: "pending" }}>
    <TabbedForm defaultValues={{ status: "pending" }}>
      <TabbedForm.Tab label={"General Information"}>
        {/* id */}
        <TextInput source="id" disabled />

        {/* Name */}
        <TextInput source="name" isRequired validate={required()} />

        {/* Owner */}
        <ReferenceInput reference="users" source="owner" isRequired>
          <AutocompleteInput
            optionText={(user) => user.username}
            optionValue="username"
            validate={required()}
          />
        </ReferenceInput>
      </TabbedForm.Tab>
      <TabbedForm.Tab label={"sensors"}>
        {/* Streams */}
        <ArrayInput source="sensors" label={false}>
          <SimpleFormIterator>
            <TextInput source="name" />
            <SelectInput
              // required
              validate={required()}
              source="class"
              choices={[
                {
                  id: "Env",
                  name: "Env",
                },
                {
                  id: "Acc",
                  name: "Acc",
                },
                {
                  id: "Info",
                  name: "Info",
                },
              ]}
            />
            <NumberInput label="latitude" source="inst_lat" />
            <NumberInput source="inst_lon" label="longitude" />
            <TextInput source="inst_operator_id" label="Operator ID" />
            <DateInput source="inst_time" label="Installation Time" />
            <TextInput source="inst_cellular_no" label="Cellular Number" />
            <TextInput
              source="inst_cellular_operator"
              label="Cellular Operator"
            />
            <TextInput source="inst_cert" label="Cert" />
            <NumberInput source="inst_lat" />
            <DateInput source={"createdAt"} label="Created At" disabled />
          </SimpleFormIterator>
        </ArrayInput>
      </TabbedForm.Tab>
    </TabbedForm>

    // </SimpleForm>
  );
};

export default DeviceEdit;
