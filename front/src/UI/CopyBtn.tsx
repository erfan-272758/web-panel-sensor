import { FC } from "react";
import {
  Button,
  EditButtonProps,
  RaRecord,
  useNotify,
  useRecordContext,
} from "react-admin";
import ContentCopy from "@mui/icons-material/ContentCopy";

const CopyBtn: FC<
  EditButtonProps<RaRecord> & { getContent: (record: any) => string }
> = (props) => {
  const notify = useNotify();
  const record = useRecordContext(props);
  return (
    <Button
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await navigator.clipboard.writeText(props.getContent(record as any));
        notify("id copy successfully", { type: "success" });
      }}
    >
      <ContentCopy />
    </Button>
  );
};

export default CopyBtn;
