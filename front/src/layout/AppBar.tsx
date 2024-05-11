import * as React from "react";
import { AppBar, TitlePortal, useTranslate } from "react-admin";
import { Box, useMediaQuery, Theme } from "@mui/material";

import Logo from "./Logo";
import { AppBarToolbar } from "./AppBarToolbar";

const CustomAppBar = () => {
  const isLargeEnough = useMediaQuery<Theme>((theme) =>
    theme.breakpoints.up("sm")
  );
  const translate = useTranslate();
  return (
    <AppBar color="secondary" toolbar={<AppBarToolbar />}>
      <TitlePortal id="ra-title">{translate("appName")}</TitlePortal>
      {/* {isLargeEnough && <Logo />} */}
      {isLargeEnough && <Box component="span" sx={{ flex: 1 }} />}
    </AppBar>
  );
};

export default CustomAppBar;
