import React, { useEffect } from "react";
import { Grid, TextField as MuiTextField } from "@mui/material";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { useQuery } from "@tanstack/react-query";
import { getAchievedResultsByResultChainIndicatorId } from "../../../api/achieved-result";

const TextField = styled(MuiTextField)(spacing);

const ResultChainIndicatorField = ({
  resultChainIndicator,
  register,
  setValue,
  year,
  monthId,
}) => {
  const {
    data: AchievedResult,
    isLoading: isLoadingAchievedResult,
    isError: isErrorAchievedResult,
  } = useQuery(
    [
      "getAchievedResultsByResultChainIndicatorId",
      resultChainIndicator.id,
      year,
      monthId,
    ],
    getAchievedResultsByResultChainIndicatorId,
    {
      enabled: !!resultChainIndicator.id,
    }
  );
  useEffect(() => {
    function setCurrentFormValues() {
      if (
        !isLoadingAchievedResult &&
        !isErrorAchievedResult &&
        AchievedResult.data.length > 0
      ) {
        setValue(resultChainIndicator.id, AchievedResult.data[0].achievedValue);
      } else {
        setValue(resultChainIndicator.id, "");
      }
    }
    setCurrentFormValues();
  }, [
    AchievedResult,
    isLoadingAchievedResult,
    isErrorAchievedResult,
    resultChainIndicator.id,
  ]);
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item md={4}>
          <TextField
            name={resultChainIndicator.id}
            fullWidth
            {...register(resultChainIndicator.id)}
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
export default ResultChainIndicatorField;
