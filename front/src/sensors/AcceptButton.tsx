import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import ThumbUp from "@mui/icons-material/ThumbUp";
import {
  useTranslate,
  useUpdate,
  useNotify,
  useRedirect,
  useRecordContext,
} from "react-admin";
import { Sensor } from "./../types";

/**
 * This custom button demonstrate using useUpdate to update data
 */
const AcceptButton = () => {
  const translate = useTranslate();
  const notify = useNotify();
  const redirectTo = useRedirect();
  const record = useRecordContext<Sensor>();

  const [approve, { isLoading }] = useUpdate(
    "Sensors",
    { id: record.id, data: { status: "accepted" }, previousData: record },
    {
      mutationMode: "undoable",
      onSuccess: () => {
        notify("resources.Sensors.notification.approved_success", {
          type: "info",
          undoable: true,
        });
        redirectTo("/Sensors");
      },
      onError: () => {
        notify("resources.Sensors.notification.approved_error", {
          type: "error",
        });
      },
    }
  );
  return record && record.status === "pending" ? (
    <Button
      variant="outlined"
      color="primary"
      size="small"
      onClick={() => approve()}
      sx={{ borderColor: (theme) => theme.palette.success.main }}
      startIcon={
        <ThumbUp sx={{ color: (theme) => theme.palette.success.main }} />
      }
      disabled={isLoading}
    >
      {translate("resources.Sensors.action.accept")}
    </Button>
  ) : (
    <span />
  );
};

AcceptButton.propTypes = {
  record: PropTypes.any,
};

export default AcceptButton;
