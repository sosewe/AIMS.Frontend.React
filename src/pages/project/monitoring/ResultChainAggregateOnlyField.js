import React, { useEffect } from "react";
import { Grid, TextField as MuiTextField } from "@mui/material";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { useQuery } from "@tanstack/react-query";
import { getDisaggregate } from "../../../api/disaggregate";
import { getAchievedResultsByResultChainIndicatorIdAndAggregateId } from "../../../api/achieved-result";

const TextField = styled(MuiTextField)(spacing);

const AggregateField = ({
  resultChainAggregate,
  register,
  setValue,
  year,
  monthId,
}) => {
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
  const {
    data: AchievedResultData,
    isLoading: isLoadingAchievedResult,
    isError: isErrorAchievedResult,
  } = useQuery(
    [
      "getAchievedResultsByResultChainIndicatorIdAndAggregateId",
      resultChainAggregate.resultChainIndicatorId,
      resultChainAggregate.id,
      year,
      monthId,
    ],
    getAchievedResultsByResultChainIndicatorIdAndAggregateId,
    {
      enabled:
        !!resultChainAggregate.resultChainIndicatorId &&
        !!resultChainAggregate.id,
    }
  );
  useEffect(() => {
    function setCurrentFormValues() {
      if (
        !isLoadingAchievedResult &&
        !isErrorAchievedResult &&
        AchievedResultData.data.length > 0
      ) {
        setValue(
          resultChainAggregate.disaggregateId1 +
            "/" +
            resultChainAggregate.disaggregateId2,
          AchievedResultData.data[0].achievedValue
        );
      } else {
        setValue(
          resultChainAggregate.disaggregateId1 +
            "/" +
            resultChainAggregate.disaggregateId2,
          ""
        );
      }
    }
    setCurrentFormValues();
  }, [
    AchievedResultData,
    isLoadingAchievedResult,
    isErrorAchievedResult,
    resultChainAggregate.disaggregateId1,
    resultChainAggregate.disaggregateId2,
  ]);
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
          type="number"
          sx={{ marginBottom: 5 }}
        />
      </Grid>
    </Grid>
  );
};

const ResultChainAggregateOnlyField = ({
  resultChainAggregates,
  register,
  setValue,
  year,
  monthId,
}) => {
  return (
    <Grid container spacing={6} justifyContent="center">
      <Grid item md={12}>
        {resultChainAggregates.map((resultChainAggregate) => {
          return (
            <React.Fragment key={Math.random().toString(36)}>
              <AggregateField
                resultChainAggregate={resultChainAggregate}
                register={register}
                setValue={setValue}
                year={year}
                monthId={monthId}
              />
            </React.Fragment>
          );
        })}
      </Grid>
    </Grid>
  );
};
export default ResultChainAggregateOnlyField;
