import React from "react";
import styled from "@emotion/styled";
import { Divider as MuiDivider, Typography } from "@mui/material";
import { spacing } from "@mui/system";
import { Helmet } from "react-helmet-async";
import InnovationMonitoringForm from "./InnovationMonitoringForm";

const Divider = styled(MuiDivider)(spacing);

const InnovationMonitoring = () => {
  return (
    <React.Fragment>
      <Helmet title="Innovation Monitoring" />
      <Typography variant="h3" gutterBottom display="inline">
        Innovation Monitoring
      </Typography>
      <Divider my={6} />
      <InnovationMonitoringForm />
    </React.Fragment>
  );
};
export default InnovationMonitoring;
