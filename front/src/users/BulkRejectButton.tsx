import * as React from "react";
import ThumbDown from "@mui/icons-material/ThumbDown";

import {
  Button,
  useUpdateMany,
  useNotify,
  useUnselectAll,
  Identifier,
  useListContext,
} from "react-admin";

const noSelection: Identifier[] = [];

const BulkRejectButton = () => {
  const { selectedIds = noSelection } = useListContext();
  const notify = useNotify();
  const unselectAll = useUnselectAll("Users");

  const [updateMany, { isLoading }] = useUpdateMany(
    "Users",
    { ids: selectedIds, data: { status: "rejected" } },
    {
      mutationMode: "undoable",
      onSuccess: () => {
        notify("resources.Users.notification.approved_success", {
          type: "info",
          undoable: true,
        });
        unselectAll();
      },
      onError: () => {
        notify("resources.Users.notification.approved_error", {
          type: "error",
        });
      },
    }
  );

  return (
    <Button
      label="resources.Users.action.reject"
      onClick={() => updateMany()}
      disabled={isLoading}
    >
      <ThumbDown />
    </Button>
  );
};

export default BulkRejectButton;
