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

  const onSuccess = (_: any) => {
    notify("ra.notification.created");
    redirect(`/users`);
  };

  return (
    <Create mutationOptions={{ onSuccess }}>
      <SimpleForm defaultValues={{ status: "pending" }}>
        <TextInput
          source="name"
          fullWidth
          resettable
          validate={required()}
          isRequired
        />
        <TextInput
          source="username"
          fullWidth
          resettable
          validate={required()}
          isRequired
        />
        <PasswordInput
          source="password"
          fullWidth
          resettable
          validate={required()}
          isRequired
        />
      </SimpleForm>
    </Create>
  );
};

export default UserCreate;
