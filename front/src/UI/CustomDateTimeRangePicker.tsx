import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import {
  renderDigitalClockTimeView,
  renderTimeViewClock,
} from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { Label } from "@mui/icons-material";
import { Button } from "react-admin";

export default function CustomDateTimeRangePicker({
  onChange,
  isChange,
}: {
  onChange: (start: Date, end: Date) => void;
  isChange?: any;
}) {
  const [start, setStart] = useState<dayjs.Dayjs>(dayjs().subtract(1, "w"));
  const [end, setEnd] = useState<dayjs.Dayjs>(dayjs());

  useEffect(() => {
    setStart(dayjs().subtract(1, "w"));
    setEnd(dayjs());
  }, [isChange]);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            margin: "10px",
          }}
        >
          <DateTimePicker
            label="Start"
            value={start}
            onChange={(d) => {
              let dd: dayjs.Dayjs;
              if (d == null) {
                dd = dayjs().subtract(1, "w");
              } else {
                dd = d;
              }
              setStart(dd);
            }}
          />
          <DateTimePicker
            label="End"
            value={end}
            onChange={(d) => {
              let dd: dayjs.Dayjs;
              if (d == null) {
                dd = dayjs();
              } else {
                dd = d;
              }
              setEnd(dd);
            }}
          />
          <Button
            size="medium"
            variant="contained"
            sx={{
              marginLeft: "40px",
              marginTop: "10px",
            }}
            onClick={() => onChange(start.toDate(), end.toDate())}
          >
            <>Apply</>
          </Button>
        </div>
      </LocalizationProvider>
    </>
  );
}
