import React from "react";
import { useForm } from "react-hook-form";
import { Button, Grid } from "@mui/material";
import { AggregateField } from "../ResultChainAggregateOnlyField";
import { Guid } from "../../../../utils/guid";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getProjectResults,
  newAchievedResult,
} from "../../../../api/achieved-result";
import { toast } from "react-toastify";

const ResultChainAggregateOnlyModal = ({
  resultChainAggregates,
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

  const onSaveData = async (data) => {
    try {
      const InData = [];
      for (const resultChainIndicator of resultChainIndicators) {
        if (
          resultChainIndicator.resultChainAggregates.length > 0 &&
          resultChainIndicator.resultChainAttributes.length === 0
        ) {
          for (const resultChainIndicatorAggregateElement of resultChainIndicator.resultChainAggregates) {
            let projRes;
            if (!isLoadingProjectResults && !isErrorProjectResults) {
              projRes = projectResults.data.filter(
                (obj) =>
                  obj.resultChainIndicatorId === resultChainIndicator.id &&
                  obj.resultChainAttributeId === null &&
                  obj.resultChainAggregateId ===
                    resultChainIndicatorAggregateElement.id
              );
            }
            const achievedValue = Number(
              data[
                resultChainIndicatorAggregateElement.disaggregateId1 +
                  "/" +
                  resultChainIndicatorAggregateElement.disaggregateId2
              ]
            );
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
                achievedValue: Number(
                  data[
                    resultChainIndicatorAggregateElement.disaggregateId1 +
                      "/" +
                      resultChainIndicatorAggregateElement.disaggregateId2
                  ]
                ),
                comments: "",
                monthsId: monthId,
                projectGeographicalFocusId: projectLocationId,
                resultChainAggregateId: resultChainIndicatorAggregateElement.id,
                yearId: year,
              };
              InData.push(achievedResult);
            }
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
export default ResultChainAggregateOnlyModal;
