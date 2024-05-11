import * as React from "react";
import { List } from "@mui/material";
import { RecordContextProvider, useListContext } from "react-admin";

import { UserItem } from "./UserItem";
import { User } from "../types";

const UserListMobile = () => {
  const { data, isLoading, total } = useListContext<User>();
  if (isLoading || Number(total) === 0) {
    return null;
  }
  return (
    <List sx={{ width: "calc(100vw - 33px)" }}>
      {data.map((User) => (
        <RecordContextProvider value={User} key={User.id}>
          <UserItem />
        </RecordContextProvider>
      ))}
    </List>
  );
};

export default UserListMobile;
