import * as React from "react";
import {
  SimpleForm,
  Create,
  ReferenceInput,
  TextInput,
  DateInput,
  AutocompleteInput,
  required,
  useNotify,
  useRedirect,
  getRecordFromLocation,
} from "react-admin";
import { useLocation } from "react-router";

import StarRatingInput from "./StarRatingInput";
import { PasswordInput } from "react-admin";

const UserCreate = () => {
  const notify = useNotify();
  const redirect = useRedirect();
  const location = useLocation();

  const onSuccess = (_: any) => {
    const record = getRecordFromLocation(location);
    notify("ra.notification.created");
    redirect(`/users`);
  };

  return (
    <Create mutationOptions={{ onSuccess }}>
      <SimpleForm defaultValues={{ status: "pending" }}>
        <TextInput source="name" fullWidth resettable validate={required()} />
        <TextInput
          source="username"
          fullWidth
          resettable
          validate={required()}
        />
        <PasswordInput
          source="password"
          fullWidth
          resettable
          validate={required()}
        />
      </SimpleForm>
    </Create>
  );
};

export default UserCreate;
