import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getDisaggregate } from "../../../api/disaggregate";
import { Typography } from "@mui/material";

const AggregateDisAggregateLabel = ({ resultChainAggregate }) => {
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
    <Typography variant="body2" gutterBottom display="inline">
      {!isLoadingDisaggregate &&
      !isLoadingDisaggregate2 &&
      !isErrorDisaggregate &&
      !isErrorDisaggregate2
        ? DisaggregateData.data.name + ": " + DisaggregateData2.data.name
        : ""}
    </Typography>
  );
};
export default AggregateDisAggregateLabel;
