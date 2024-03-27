import React, { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAchievedResultsByResultChainIndicatorId,
  getProjectResults,
  newAchievedResult,
} from "../../../../api/achieved-result";
import { useForm } from "react-hook-form";
import { Button, Grid, TextField as MuiTextField } from "@mui/material";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { Guid } from "../../../../utils/guid";
import { toast } from "react-toastify";

const TextField = styled(MuiTextField)(spacing);

const ResultChainIndicatorModal = ({
  resultChainIndicator,
  year,
  monthId,
  processLevelItemId,
  processLevelTypeId,
  projectLocationId,
  resultChainIndicators,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({ mutationFn: newAchievedResult });

  const {
    data: projectResults,
    isLoading: isLoadingProjectResults,
    isError: isErrorProjectResults,
  } = useQuery(
    ["getProjectResults", processLevelItemId, year, monthId],
    getProjectResults,
    {
      refetchOnWindowFocus: false,
    }
  );

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

  const onSaveData = async (data) => {
    try {
      const InData = [];
      for (const resultChainIndicator of resultChainIndicators) {
        if (
          resultChainIndicator.resultChainAttributes.length === 0 &&
          resultChainIndicator.resultChainAggregates.length === 0
        ) {
          let projRes;
          if (!isLoadingProjectResults && !isErrorProjectResults) {
            projRes = projectResults.data.filter(
              (obj) =>
                obj.resultChainIndicatorId === resultChainIndicator.id &&
                obj.resultChainAttributeId === null &&
                obj.resultChainAggregateId === null
            );
          }
          const achievedValue = Number(data[resultChainIndicator.id]);
          if (!isNaN(achievedValue)) {
            const achievedResult = {
              id:
                projRes && projRes.length > 0
                  ? projRes[0].id
                  : new Guid().toString(),
              processLevelItemId: processLevelItemId,
              processLevelTypeId: processLevelTypeId,
              createDate: new Date(),
              resultChainIndicatorId: resultChainIndicator.id,
              achievedValue: achievedValue,
              comments: "",
              monthsId: monthId,
              projectGeographicalFocusId: projectLocationId,
              yearId: year,
            };
            InData.push(achievedResult);
          }
        }
      }

      await mutation.mutateAsync(InData);
      toast("Successfully saved data", {
        type: "success",
      });
    } catch (error) {
      console.log(error);
      if (error && error.response && error.response.data) {
        toast(error.response.data, {
          type: "error",
        });
      } else {
        toast(error, {
          type: "error",
        });
      }
    }
  };

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit((data) => onSaveData(data))}>
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

        <Grid container spacing={6}>
          <Grid item>
            <Button type="submit" variant="contained" color="primary" mt={3}>
              Save changes
            </Button>
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  );
};
export default ResultChainIndicatorModal;
