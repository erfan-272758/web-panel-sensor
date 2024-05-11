import * as React from "react";
import { useCallback } from "react";
import {
  CreateButton,
  ExportButton,
  FilterButton,
  List,
  SelectColumnsButton,
  TopToolbar,
} from "react-admin";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import { Box, Drawer, useMediaQuery, Theme } from "@mui/material";

import UserListMobile from "./UserListMobile";
import UserListDesktop from "./UserListDesktop";
import UserFilters from "./userFilters";
import UserEdit from "./UserEdit";

const UserListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
  </TopToolbar>
);

const UserList = () => {
  const isXSmall = useMediaQuery<Theme>((theme) =>
    theme.breakpoints.down("sm")
  );
  const location = useLocation();
  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    navigate("/users");
  }, [navigate]);

  const match = matchPath("/users/:id", location.pathname);

  return (
    <Box display="flex">
      <List
        sx={{
          flexGrow: 1,
          transition: (theme: any) =>
            theme.transitions.create(["all"], {
              duration: theme.transitions.duration.enteringScreen,
            }),
          marginRight: !!match ? "400px" : 0,
        }}
        filters={UserFilters}
        perPage={25}
        sort={{ field: "date", order: "DESC" }}
        actions={<UserListActions />}
      >
        {isXSmall ? (
          <UserListMobile />
        ) : (
          <UserListDesktop
            selectedRow={
              !!match ? parseInt((match as any).params.id, 10) : undefined
            }
          />
        )}
      </List>
      <Drawer
        variant="persistent"
        open={!!match}
        anchor="right"
        onClose={handleClose}
        sx={{ zIndex: 100 }}
      >
        {/* To avoid any errors if the route does not match, we don't render at all the component in this case */}
        {!!match && (
          <UserEdit id={(match as any).params.id} onCancel={handleClose} />
        )}
      </Drawer>
    </Box>
  );
};

export default UserList;
