import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

export default function TimeSelect({
  isChange,
  itemRef,
}: {
  isChange?: any;
  itemRef?: React.Ref<any>;
}) {
  const [duration, setDuration] = React.useState("-1");
  React.useEffect(() => {
    setDuration("-1");
  }, [isChange]);
  const handleChange = (event: SelectChangeEvent) => {
    setDuration(event.target.value as string);
  };

  if (itemRef) {
    React.useImperativeHandle(
      itemRef,
      () => ({
        getValue() {
          return +duration;
        },
      }),
      [duration]
    );
  }
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="time-update">Update</InputLabel>
        <Select
          labelId="time-update"
          id="time-select"
          value={duration}
          label="Update"
          onChange={handleChange}
        >
          <MenuItem selected value={-1}>
            None
          </MenuItem>
          <MenuItem value={1}>1s</MenuItem>
          <MenuItem value={5}>5s</MenuItem>
          <MenuItem value={10}>10s</MenuItem>
          <MenuItem value={15}>15s</MenuItem>
          <MenuItem value={60}>1m</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
