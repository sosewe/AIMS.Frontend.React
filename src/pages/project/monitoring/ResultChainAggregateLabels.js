import React from "react";
import { getDisaggregate } from "../../../api/disaggregate";
import { useQuery } from "@tanstack/react-query";
import { Grid } from "@mui/material";

const ResultChainAggregateLabels = ({ resultChainAggregate }) => {
  const {
    data: DisaggregateData,
    isLoading: isLoadingDisaggregate,
    isError: isErrorDisaggregate,
  } = useQuery(
    ["getDisaggregate", resultChainAggregate.disaggregateId1],
    getDisaggregate,
    {
      enabled: !!resultChainAggregate.disaggregateId1,
    }
  );
  const {
    data: DisaggregateData2,
    isLoading: isLoadingDisaggregate2,
    isError: isErrorDisaggregate2,
  } = useQuery(
    ["getDisaggregate", resultChainAggregate.disaggregateId2],
    getDisaggregate,
    {
      enabled: !!resultChainAggregate.disaggregateId2,
    }
  );

  return (
    <React.Fragment>
      <Grid item md={4}>
        {!isLoadingDisaggregate && !isErrorDisaggregate
          ? DisaggregateData.data.name
          : ""}
        &nbsp;
        {!isLoadingDisaggregate2 && !isErrorDisaggregate2
          ? DisaggregateData2.data.name
          : ""}
      </Grid>
    </React.Fragment>
  );
};
export default ResultChainAggregateLabels;
