import * as React from "react";
import ThumbUp from "@mui/icons-material/ThumbUp";

import {
  Button,
  useUpdateMany,
  useNotify,
  useUnselectAll,
  Identifier,
  useListContext,
} from "react-admin";

const noSelection: Identifier[] = [];

const BulkAcceptButton = () => {
  const { selectedIds = noSelection } = useListContext();
  const notify = useNotify();
  const unselectAll = useUnselectAll("Devices");

  const [updateMany, { isLoading }] = useUpdateMany(
    "Devices",
    { ids: selectedIds, data: { status: "accepted" } },
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
      label="resources.Devices.action.accept"
      onClick={() => updateMany()}
      disabled={isLoading}
    >
      <ThumbUp />
    </Button>
  );
};

export default BulkAcceptButton;
