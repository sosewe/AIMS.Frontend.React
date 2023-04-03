import React from "react";
import { Grid, TextField as MuiTextField } from "@mui/material";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { useQuery } from "@tanstack/react-query";
import { getDisaggregate } from "../../../api/disaggregate";

const TextField = styled(MuiTextField)(spacing);

const AggregateField = ({ resultChainAggregate, register }) => {
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
    <Grid container spacing={6} justifyContent="left" direction="row">
      <Grid item md={4}>
        {!isLoadingDisaggregate && !isErrorDisaggregate
          ? DisaggregateData.data.name
          : ""}
        &nbsp;
        {!isLoadingDisaggregate2 && !isErrorDisaggregate2
          ? DisaggregateData2.data.name
          : ""}
      </Grid>
      <Grid item md={4}>
        <TextField
          id={
            resultChainAggregate.disaggregateId1 +
            "/" +
            resultChainAggregate.disaggregateId2
          }
          label={
            !isLoadingDisaggregate &&
            !isLoadingDisaggregate2 &&
            !isErrorDisaggregate2 &&
            !isErrorDisaggregate
              ? DisaggregateData.data.name + " " + DisaggregateData2.data.name
              : ""
          }
          variant="outlined"
          {...register(
            resultChainAggregate.disaggregateId1 +
              "/" +
              resultChainAggregate.disaggregateId2
          )}
        />
      </Grid>
    </Grid>
  );
};

const ResultChainAggregateOnlyField = ({ resultChainAggregates, register }) => {
  return (
    <Grid container spacing={6} justifyContent="center">
      <Grid item md={12}>
        {resultChainAggregates.map((resultChainAggregate) => {
          return (
            <React.Fragment key={Math.random().toString(36)}>
              <AggregateField
                resultChainAggregate={resultChainAggregate}
                register={register}
              />
            </React.Fragment>
          );
        })}
      </Grid>
    </Grid>
  );
};
export default ResultChainAggregateOnlyField;
