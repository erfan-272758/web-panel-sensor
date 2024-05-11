import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import ThumbDown from "@mui/icons-material/ThumbDown";
import {
  useTranslate,
  useUpdate,
  useNotify,
  useRedirect,
  useRecordContext,
} from "react-admin";
import { User } from "../types";

/**
 * This custom button demonstrate using a custom action to update data
 */
const RejectButton = () => {
  const translate = useTranslate();
  const notify = useNotify();
  const redirectTo = useRedirect();
  const record = useRecordContext<User>();

  const [reject, { isLoading }] = useUpdate(
    "Users",
    { id: record.id, data: { status: "rejected" }, previousData: record },
    {
      mutationMode: "undoable",
      onSuccess: () => {
        notify("resources.Users.notification.rejected_success", {
          type: "info",
          undoable: true,
        });
        redirectTo("/Users");
      },
      onError: () => {
        notify("resources.Users.notification.rejected_error", {
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
      onClick={() => reject()}
      sx={{ borderColor: (theme) => theme.palette.error.main }}
      startIcon={
        <ThumbDown sx={{ color: (theme) => theme.palette.error.main }} />
      }
      disabled={isLoading}
    >
      {translate("resources.Users.action.reject")}
    </Button>
  ) : (
    <span />
  );
};

RejectButton.propTypes = {
  record: PropTypes.any,
};

export default RejectButton;
