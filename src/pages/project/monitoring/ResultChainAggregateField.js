import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getResultChainAggregate } from "../../../api/result-chain-aggregate";
import { getDisaggregate } from "../../../api/disaggregate";
import { Grid, TextField as MuiTextField } from "@mui/material";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";

const TextField = styled(MuiTextField)(spacing);

const ResultChainAggregateField = ({ resultChainAggregate, formik }) => {
  let disaggregateId1;
  let disaggregateId2;
  const {
    data: resultData,
    isLoading: isLoadingResultData,
    isError: isErrorResultData,
  } = useQuery(
    ["getResultChainAggregate", resultChainAggregate.id],
    getResultChainAggregate,
    { enabled: !!resultChainAggregate.id }
  );
  if (!isLoadingResultData && !isErrorResultData) {
    disaggregateId1 = resultData.data.disaggregateId1;
    disaggregateId2 = resultData.data.disaggregateId2;
  }
  const {
    data: DisaggregateData,
    isLoading: isLoadingDisaggregate,
    isError: isErrorDisaggregate,
  } = useQuery(["getDisaggregate", disaggregateId1], getDisaggregate, {
    enabled: !!disaggregateId1,
  });
  const {
    data: DisaggregateData2,
    isLoading: isLoadingDisaggregate2,
    isError: isErrorDisaggregate2,
  } = useQuery(["getDisaggregate", disaggregateId2], getDisaggregate, {
    enabled: !!disaggregateId2,
  });
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item md={4}>
          {!isLoadingDisaggregate && !isErrorDisaggregate
            ? DisaggregateData.data.name
            : ""}
        </Grid>
        <Grid item md={4}>
          {!isLoadingDisaggregate2 && !isErrorDisaggregate2
            ? DisaggregateData2.data.name
            : ""}
        </Grid>
        <Grid item md={4}>
          <TextField
            name={resultChainAggregate.id}
            value={formik.values[resultChainAggregate.id] || ""}
            error={Boolean(
              formik.touched[resultChainAggregate.id] &&
                formik.errors[resultChainAggregate.id]
            )}
            fullWidth
            helperText={
              formik.touched[resultChainAggregate.id] &&
              formik.errors[resultChainAggregate.id]
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            variant="outlined"
            my={2}
            type="number"
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                backgroundColor: "#e9ecef",
              },
            }}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
export default ResultChainAggregateField;
