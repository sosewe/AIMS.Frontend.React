import React from "react";
import { Helmet } from "react-helmet-async";
import { Typography } from "@mui/material";

const ViewProgramme = () => {
  return (
    <React.Fragment>
      <Helmet title="View Programme" />
      <Typography variant="h3" gutterBottom display="inline">
        View Programme
      </Typography>
    </React.Fragment>
  );
};
export default ViewProgramme;
