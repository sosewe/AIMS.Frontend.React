import { useQuery } from "@tanstack/react-query";
import { lookupItem } from "../../../api/lookup";
import { Grid, Typography } from "@mui/material";
import React from "react";

const ResultIndicatorReportingFrequency = ({ reportingFrequencyId }) => {
  const { data, isLoading, isError } = useQuery(
    ["lookupItem", reportingFrequencyId],
    lookupItem,
    { enabled: !!reportingFrequencyId }
  );
  return `Reporting Frequency: ${!isLoading && !isError ? data.data.name : ""}`;
};

const ResultIndicatorHeader = ({ resultChainIndicator }) => {
  // const { data, isLoading, isError } = useQuery(
  //   ["lookupItem", resultChainIndicator.indicatorMeasureId],
  //   lookupItem,
  //   { enabled: !!resultChainIndicator.indicatorMeasureId }
  // );
  return (
    <Grid container direction="row" justifyContent="left" alignItems="center">
      <Grid item md={12}>
        <Typography variant="h6" gutterBottom display="inline">
          {resultChainIndicator.indicator.name}
          &nbsp;Baseline Value: &nbsp;
          {resultChainIndicator ? resultChainIndicator.baseline : ""}
          &nbsp;
          <ResultIndicatorReportingFrequency
            reportingFrequencyId={resultChainIndicator.reportingFrequencyId}
          />
        </Typography>
      </Grid>
    </Grid>
  );
};
export default ResultIndicatorHeader;
