import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Loading = () => {
  return (
    <Box style={{ position: "relative" }}>
      <CircularProgress
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transfrorm: "translate(-50%, -50%)",
        }}
      />
    </Box>
  );
};

export default Loading;
