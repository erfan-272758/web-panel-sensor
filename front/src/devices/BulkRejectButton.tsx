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
  const unselectAll = useUnselectAll("Devices");

  const [updateMany, { isLoading }] = useUpdateMany(
    "Devices",
    { ids: selectedIds, data: { status: "rejected" } },
    {
      mutationMode: "undoable",
      onSuccess: () => {
        notify("resources.Devices.notification.approved_success", {
          type: "info",
          undoable: true,
        });
        unselectAll();
      },
      onError: () => {
        notify("resources.Devices.notification.approved_error", {
          type: "error",
        });
      },
    }
  );

  return (
    <Button
      label="resources.Devices.action.reject"
      onClick={() => updateMany()}
      disabled={isLoading}
    >
      <ThumbDown />
    </Button>
  );
};

export default BulkRejectButton;
