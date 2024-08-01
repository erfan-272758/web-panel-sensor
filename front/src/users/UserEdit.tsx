import * as React from "react";
import {
  EditBase,
  useTranslate,
  TextInput,
  SimpleForm,
  DateField,
  EditProps,
  Labeled,
  required,
  PasswordInput,
} from "react-admin";
import { Box, Grid, Stack, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import ProductReferenceField from "../products/ProductReferenceField";
import CustomerReferenceField from "../visitors/CustomerReferenceField";
import StarRatingField from "./StarRatingField";
import UserEditToolbar from "./UserEditToolbar";
import { User } from "../types";

interface Props extends EditProps<User> {
  onCancel: () => void;
}

const UserEdit = ({ id, onCancel }: Props) => {
  const translate = useTranslate();
  return (
    <>
      {/* <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#000a",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      /> */}
      <EditBase id={id} mutationMode="pessimistic">
        <Box pt={5} width={{ xs: "100vW", sm: 400 }} mt={{ xs: 2, sm: 1 }}>
          <Stack direction="row" p={2}>
            <Typography variant="h6" flex="1">
              {translate("resources.users.edit_title")}
            </Typography>
            <IconButton onClick={onCancel} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
          <SimpleForm sx={{ pt: 0, pb: 0 }} toolbar={<UserEditToolbar />}>
            <TextInput
              source="name"
              fullWidth
              resettable
              validate={required()}
            />
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
        </Box>
      </EditBase>
    </>
  );
};

export default UserEdit;
