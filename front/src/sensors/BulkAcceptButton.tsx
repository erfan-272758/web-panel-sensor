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
  const unselectAll = useUnselectAll("Sensors");

  const [updateMany, { isLoading }] = useUpdateMany(
    "Sensors",
    { ids: selectedIds, data: { status: "accepted" } },
    {
      mutationMode: "undoable",
      onSuccess: () => {
        notify("resources.Sensors.notification.approved_success", {
          type: "info",
          undoable: true,
        });
        unselectAll();
      },
      onError: () => {
        notify("resources.Sensors.notification.approved_error", {
          type: "error",
        });
      },
    }
  );

  return (
    <Button
      label="resources.Sensors.action.accept"
      onClick={() => updateMany()}
      disabled={isLoading}
    >
      <ThumbUp />
    </Button>
  );
};

export default BulkAcceptButton;
