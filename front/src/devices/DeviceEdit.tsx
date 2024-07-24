import * as React from "react";
import {
  ArrayInput,
  AutocompleteInput,
  BooleanInput,
  DateField,
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
  TextField,
  TextInput,
  Toolbar,
  useRecordContext,
  useTranslate,
} from "react-admin";
import { Link as RouterLink } from "react-router-dom";
import { Card, CardContent, Box, Grid, Typography, Link } from "@mui/material";

import { Device, Customer } from "../types";

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
    <SimpleForm defaultValues={{ status: "pending" }}>
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

      {/* Streams */}
      {/* <ArrayInput source="streams">
        <SimpleFormIterator>
          <TextInput source="name" />
          <NumberInput source="port" required />
          <SelectInput
            required
            source="protocol"
            choices={[
              {
                id: "ws",
                name: "WebSocket",
              },
              {
                id: "mqtt",
                name: "MQTT",
              },
            ]}
          />
          <SelectInput
            required
            source="data_type"
            choices={[
              {
                id: "int",
                name: "Integer",
              },
              {
                id: "float",
                name: "Float",
              },
              {
                id: "location",
                name: "Location",
              },
            ]}
          />
        </SimpleFormIterator>
      </ArrayInput> */}
    </SimpleForm>
  );
};

export default DeviceEdit;
