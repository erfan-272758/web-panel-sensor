import * as React from "react";
import {
  Create,
  ReferenceInput,
  TextInput,
  AutocompleteInput,
  useNotify,
  useRedirect,
  required,
  SimpleForm,
} from "react-admin";

const DeviceCreate = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  const onSuccess = (_: any) => {
    notify("ra.notification.created");
    redirect(`/devices`);
  };

  return (
    <Create mutationOptions={{ onSuccess }}>
      <SimpleForm defaultValues={{ status: "pending" }}>
        {/* ID */}
        <TextInput source="id" />

        {/* Name */}
        <TextInput source="name" isRequired validate={required()} />

        {/* Owner */}
        <ReferenceInput reference="users" source="owner">
          <AutocompleteInput
            optionText={(user) => user.username}
            optionValue="username"
            isRequired
            validate={required()}
          />
        </ReferenceInput>
      </SimpleForm>
    </Create>
  );
};

export default DeviceCreate;
