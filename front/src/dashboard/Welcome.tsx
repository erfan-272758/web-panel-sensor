import * as React from "react";
import { Box, Card, CardActions, Button, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import CodeIcon from "@mui/icons-material/Code";
import { useTranslate } from "react-admin";

import publishArticleImage from "./welcome_illustration.svg";
import { Store } from "../Global";

const Welcome = () => {
  const translate = useTranslate();
  let name = Store.user?.name || Store.user?.username || "";
  name = (name[0]?.toUpperCase() || "") + (name?.slice(1) || "");
  return (
    <Card
      sx={{
        background: (theme) =>
          `linear-gradient(45deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.light} 50%, ${theme.palette.primary.dark} 100%)`,
        color: (theme) => theme.palette.primary.contrastText,
        padding: "20px",
        marginTop: 2,
        marginBottom: "1em",
      }}
    >
      <Box display="flex">
        <Box flex="1">
          <Typography variant="h5" component="h2" gutterBottom>
            Hi {name}, {translate("pos.dashboard.welcome.title")}
          </Typography>
          <Box maxWidth="40em" marginTop={"20px"}>
            <Typography variant="body1" component="p" gutterBottom>
              {translate("pos.dashboard.welcome.subtitle")}
            </Typography>
          </Box>
        </Box>
        <Box
          display={{ xs: "none", sm: "none", md: "block" }}
          sx={{
            background: `url(${publishArticleImage}) top right / cover`,
            marginLeft: "auto",
          }}
          width="16em"
          height="9em"
          overflow="hidden"
        />
      </Box>
    </Card>
  );
};

export default Welcome;
