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
  const unselectAll = useUnselectAll("Sensors");

  const [updateMany, { isLoading }] = useUpdateMany(
    "Sensors",
    { ids: selectedIds, data: { status: "rejected" } },
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
      label="resources.Sensors.action.reject"
      onClick={() => updateMany()}
      disabled={isLoading}
    >
      <ThumbDown />
    </Button>
  );
};

export default BulkRejectButton;
