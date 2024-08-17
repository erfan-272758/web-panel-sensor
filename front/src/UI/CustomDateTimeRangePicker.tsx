import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import {
  renderDigitalClockTimeView,
  renderTimeViewClock,
} from "@mui/x-date-pickers";
import { useCallback, useEffect, useRef, useState } from "react";
import { Label } from "@mui/icons-material";
import { Button } from "react-admin";
import TimeSlider from "./TimeSelect";
import TimeSelect from "./TimeSelect";

export default function CustomDateTimeRangePicker({
  onChange,
  isChange,
}: {
  onChange: (start: Date, end: Date, onAutoUpdate?: boolean) => void;
  isChange?: any;
}) {
  const [start, setStart] = useState<dayjs.Dayjs>(dayjs().subtract(1, "w"));
  const [end, setEnd] = useState<dayjs.Dayjs>(dayjs());
  const updateRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);
  useEffect(() => {
    setStart(dayjs().subtract(1, "w"));
    setEnd(dayjs());
  }, [isChange]);

  const onApply = useCallback(() => {
    if (!onChange) return;

    if (intervalRef.current) clearTimeout(intervalRef.current);

    const updatePeriod = updateRef.current?.getValue();
    const core = (s: Dayjs, e: Dayjs, extra = 0) => {
      const newStart = s.add(extra, "s");
      const newEnd = e.add(extra, "s");
      onChange(newStart.toDate(), newEnd.toDate(), updatePeriod > 0);
      setStart(newStart);
      setEnd(newEnd);

      if (!updatePeriod || updatePeriod == -1) return;

      intervalRef.current = setTimeout(
        () => core(newStart, newEnd, updatePeriod),
        updatePeriod * 1000
      );
    };
    core(start, end, updatePeriod);
  }, [start, end, onChange]);

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
          <TimeSelect isChange={isChange} itemRef={updateRef} />
          <Button
            size="medium"
            variant="contained"
            sx={{
              marginLeft: "40px",
              marginTop: "10px",
            }}
            onClick={onApply}
          >
            <>Apply</>
          </Button>
        </div>
      </LocalizationProvider>
    </>
  );
}
