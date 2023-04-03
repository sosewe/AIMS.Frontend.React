import React from "react";
import { Button as MuiButton, Grid } from "@mui/material";
import { toast } from "react-toastify";
import EnterQuantitativeResultField from "./EnterQuantitativeResultField";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { newAchievedResult } from "../../../api/achieved-result";
import { Guid } from "../../../utils/guid";

const Button = styled(MuiButton)(spacing);

const EnterQuantitativeResultsForm = ({
  resultChainIndicators,
  processLevelItemId,
  processLevelTypeId,
  projectLocationId,
  monthId,
  year,
}) => {
  const { register, handleSubmit, setValue } = useForm();
  const navigate = useNavigate();
  const mutation = useMutation({ mutationFn: newAchievedResult });
  const onSaveData = async (data) => {
    try {
      const InData = [];
      for (const resultChainIndicator of resultChainIndicators) {
        if (
          resultChainIndicator.resultChainAggregates.length > 0 &&
          resultChainIndicator.resultChainAttributes.length > 0
        ) {
          for (const resultChainIndicatorAggregateElement of resultChainIndicator.resultChainAggregates) {
            for (const resultChainIndicatorAttributeElement of resultChainIndicator.resultChainAttributes) {
              const achievedResult = {
                id: new Guid().toString(),
                processLevelItemId: processLevelItemId,
                processLevelTypeId: processLevelTypeId,
                createDate: new Date(),
                resultChainIndicatorId: resultChainIndicator.id,
                achievedValue: Number(
                  data[
                    resultChainIndicatorAggregateElement.id +
                      "/" +
                      resultChainIndicatorAttributeElement.id
                  ]
                ),
                comments: "",
                monthsId: monthId,
                projectGeographicalFocusId: projectLocationId,
                resultChainAttributeId: resultChainIndicatorAttributeElement.id,
                resultChainAggregateId: resultChainIndicatorAggregateElement.id,
                yearId: year,
              };
              InData.push(achievedResult);
            }
          }
        } else if (
          resultChainIndicator.resultChainAggregates.length > 0 &&
          resultChainIndicator.resultChainAttributes.length === 0
        ) {
          for (const resultChainIndicatorAggregateElement of resultChainIndicator.resultChainAggregates) {
            const achievedResult = {
              id: new Guid().toString(),
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
        } else if (
          resultChainIndicator.resultChainAttributes.length > 0 &&
          resultChainIndicator.resultChainAggregates.length === 0
        ) {
          for (const resultChainIndicatorAttributeElement of resultChainIndicator.resultChainAttributes) {
            const achievedResult = {
              id: new Guid().toString(),
              processLevelItemId: processLevelItemId,
              processLevelTypeId: processLevelTypeId,
              createDate: new Date(),
              resultChainIndicatorId: resultChainIndicator.id,
              achievedValue: Number(
                data[resultChainIndicatorAttributeElement.id]
              ),
              comments: "",
              monthsId: monthId,
              projectGeographicalFocusId: projectLocationId,
              resultChainAttributeId: resultChainIndicatorAttributeElement.id,
              yearId: year,
            };
            InData.push(achievedResult);
          }
        } else if (
          resultChainIndicator.resultChainAttributes.length === 0 &&
          resultChainIndicator.resultChainAggregates.length === 0
        ) {
          const achievedResult = {
            id: new Guid().toString(),
            processLevelItemId: processLevelItemId,
            processLevelTypeId: processLevelTypeId,
            createDate: new Date(),
            resultChainIndicatorId: resultChainIndicator.id,
            achievedValue: Number(data[resultChainIndicator.id]),
            comments: "",
            monthsId: monthId,
            projectGeographicalFocusId: projectLocationId,
            yearId: year,
          };
          InData.push(achievedResult);
        }
      }
      await mutation.mutateAsync(InData);
      toast("Successfully saved data", {
        type: "success",
      });
      navigate(
        `/project/monitoring/table-quantitative-results/${processLevelItemId}/${processLevelTypeId}/${projectLocationId}/${year}`
      );
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
        <Grid
          container
          direction="row"
          justifyContent="left"
          alignItems="left"
          spacing={6}
        >
          {resultChainIndicators.map((resultChainIndicator, i) => {
            return (
              <React.Fragment key={Math.random().toString(36)}>
                <Grid item md={1}>
                  {i}
                </Grid>
                <Grid item md={11}>
                  <EnterQuantitativeResultField
                    resultChainIndicator={resultChainIndicator}
                    register={register}
                    setValue={setValue}
                  />
                </Grid>
              </React.Fragment>
            );
          })}
        </Grid>
        <Button type="submit" variant="contained" color="primary" mt={3}>
          Save changes
        </Button>
      </form>
    </React.Fragment>
  );
};
export default EnterQuantitativeResultsForm;
