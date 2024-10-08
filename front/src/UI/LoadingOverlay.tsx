import { CircularProgress } from "@mui/material";
import React from "react";

const LoadingOverlay = ({ loading }: { loading?: boolean | null }) => {
  if (!loading) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <CircularProgress color="primary" />
    </div>
  );
};

export default LoadingOverlay;
