import React from "react";
import styled from "@emotion/styled";
import { Divider as MuiDivider, Typography } from "@mui/material";
import { spacing } from "@mui/system";
import { Helmet } from "react-helmet-async";
import AdvocacyMonitoringForm from "./AdvocacyMonitoringForm";

const Divider = styled(MuiDivider)(spacing);

const AdvocacyMonitoring = () => {
  return (
    <React.Fragment>
      <Helmet title="Advocacy Monitoring" />
      <Typography variant="h3" gutterBottom display="inline">
        Advocacy Monitoring
      </Typography>
      <Divider my={6} />
      <AdvocacyMonitoringForm />
    </React.Fragment>
  );
};
export default AdvocacyMonitoring;
