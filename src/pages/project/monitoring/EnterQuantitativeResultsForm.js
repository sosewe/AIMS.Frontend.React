import React from "react";
import { Button as MuiButton, Grid } from "@mui/material";
import { toast } from "react-toastify";
import EnterQuantitativeResultField from "./EnterQuantitativeResultField";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getProjectResults,
  newAchievedResult,
} from "../../../api/achieved-result";
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
  const {
    data: projectResults,
    isLoading: isLoadingProjectResults,
    isError: isErrorProjectResults,
  } = useQuery(
    ["getProjectResults", processLevelItemId, year, monthId, projectLocationId],
    getProjectResults,
    {
      refetchOnWindowFocus: false,
    }
  );
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
          const resultChainAttribute =
            resultChainIndicator.resultChainAttributes[0];
          if (resultChainAttribute.primaryResultChainAttributes.length > 0) {
            for (const primaryResultChainAttribute of resultChainAttribute.primaryResultChainAttributes) {
              if (
                primaryResultChainAttribute.secondaryResultChainAttributes
                  .length > 0
              ) {
                for (const secondaryResultChainAttribute of primaryResultChainAttribute.secondaryResultChainAttributes) {
                  for (const resultChainIndicatorAggregateElement of resultChainIndicator.resultChainAggregates) {
                    let projRes;
                    if (!isLoadingProjectResults && !isErrorProjectResults) {
                      projRes = projectResults.data.filter(
                        (obj) =>
                          obj.resultChainIndicatorId ===
                            resultChainIndicator.id &&
                          obj.resultChainAttributeId ===
                            resultChainAttribute.id &&
                          obj.resultChainAggregateId ===
                            resultChainIndicatorAggregateElement.id &&
                          obj.primaryResultChainAttributeId ===
                            primaryResultChainAttribute.id &&
                          obj.secondaryResultChainAttributeId ===
                            secondaryResultChainAttribute.id
                      );
                    }
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
                          resultChainIndicatorAggregateElement.id +
                            "/" +
                            resultChainAttribute.id +
                            "/" +
                            primaryResultChainAttribute.id +
                            "/" +
                            secondaryResultChainAttribute.id
                        ]
                      ),
                      comments: "",
                      monthsId: monthId,
                      projectGeographicalFocusId: projectLocationId,
                      resultChainAttributeId: resultChainAttribute.id,
                      resultChainAggregateId:
                        resultChainIndicatorAggregateElement.id,
                      yearId: year,
                      primaryResultChainAttributeId:
                        primaryResultChainAttribute.id,
                      secondaryResultChainAttributeId:
                        secondaryResultChainAttribute.id,
                    };
                    InData.push(achievedResult);
                  }
                }
              } else {
                for (const resultChainIndicatorAggregateElement of resultChainIndicator.resultChainAggregates) {
                  let projRes;
                  if (!isLoadingProjectResults && !isErrorProjectResults) {
                    projRes = projectResults.data.filter(
                      (obj) =>
                        obj.resultChainIndicatorId ===
                          resultChainIndicator.id &&
                        obj.resultChainAttributeId ===
                          resultChainAttribute.id &&
                        obj.resultChainAggregateId ===
                          resultChainIndicatorAggregateElement.id &&
                        obj.primaryResultChainAttributeId ===
                          primaryResultChainAttribute.id
                    );
                  }
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
                        resultChainIndicatorAggregateElement.id +
                          "/" +
                          resultChainAttribute.id +
                          "/" +
                          primaryResultChainAttribute.id
                      ]
                    ),
                    comments: "",
                    monthsId: monthId,
                    projectGeographicalFocusId: projectLocationId,
                    resultChainAttributeId: resultChainAttribute.id,
                    resultChainAggregateId:
                      resultChainIndicatorAggregateElement.id,
                    yearId: year,
                    primaryResultChainAttributeId:
                      primaryResultChainAttribute.id,
                  };
                  InData.push(achievedResult);
                }
              }
            }
          }
        } else if (
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
        } else if (
          resultChainIndicator.resultChainAttributes.length > 0 &&
          resultChainIndicator.resultChainAggregates.length === 0
        ) {
          for (const resultChainIndicatorAttributeElement of resultChainIndicator.resultChainAttributes) {
            if (
              resultChainIndicatorAttributeElement.primaryResultChainAttributes
                .length > 0
            ) {
              for (const primaryResultChainAttribute of resultChainIndicatorAttributeElement.primaryResultChainAttributes) {
                if (
                  primaryResultChainAttribute.secondaryResultChainAttributes
                    .length > 0
                ) {
                  for (const secondaryResultChainAttribute of primaryResultChainAttribute.secondaryResultChainAttributes) {
                    let projRes;
                    if (!isLoadingProjectResults && !isErrorProjectResults) {
                      projRes = projectResults.data.filter(
                        (obj) =>
                          obj.resultChainIndicatorId ===
                            resultChainIndicator.id &&
                          obj.resultChainAttributeId ===
                            resultChainIndicatorAttributeElement.id &&
                          obj.resultChainAggregateId === null &&
                          obj.primaryResultChainAttributeId ===
                            primaryResultChainAttribute.id &&
                          obj.secondaryResultChainAttributeId ===
                            secondaryResultChainAttribute.id
                      );
                    }
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
                          resultChainIndicatorAttributeElement.id +
                            "/" +
                            primaryResultChainAttribute.id +
                            "/" +
                            secondaryResultChainAttribute.id
                        ]
                      ),
                      comments: "",
                      monthsId: monthId,
                      projectGeographicalFocusId: projectLocationId,
                      resultChainAttributeId:
                        resultChainIndicatorAttributeElement.id,
                      yearId: year,
                      primaryResultChainAttributeId:
                        primaryResultChainAttribute.id,
                      secondaryResultChainAttributeId:
                        secondaryResultChainAttribute.id,
                    };
                    InData.push(achievedResult);
                  }
                } else {
                  let projRes;
                  if (!isLoadingProjectResults && !isErrorProjectResults) {
                    projRes = projectResults.data.filter(
                      (obj) =>
                        obj.resultChainIndicatorId ===
                          resultChainIndicator.id &&
                        obj.resultChainAttributeId ===
                          resultChainIndicatorAttributeElement.id &&
                        obj.resultChainAggregateId === null &&
                        obj.primaryResultChainAttributeId ===
                          primaryResultChainAttribute.id
                    );
                  }
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
                        resultChainIndicatorAttributeElement.id +
                          "/" +
                          primaryResultChainAttribute.id
                      ]
                    ),
                    comments: "",
                    monthsId: monthId,
                    projectGeographicalFocusId: projectLocationId,
                    resultChainAttributeId:
                      resultChainIndicatorAttributeElement.id,
                    yearId: year,
                    primaryResultChainAttributeId:
                      primaryResultChainAttribute.id,
                  };
                  InData.push(achievedResult);
                }
              }
            }
          }
        } else if (
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
          const achievedResult = {
            id:
              projRes && projRes.length > 0
                ? projRes[0].id
                : new Guid().toString(),
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
                  {i + 1}
                </Grid>
                <Grid item md={11}>
                  <EnterQuantitativeResultField
                    resultChainIndicator={resultChainIndicator}
                    register={register}
                    setValue={setValue}
                    year={year}
                    monthId={monthId}
                    projectLocationId={projectLocationId}
                  />
                </Grid>
              </React.Fragment>
            );
          })}
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="left"
          alignItems="left"
          spacing={6}
        >
          <Grid item md={1}></Grid>
          <Grid item md={4}>
            <Button type="submit" variant="contained" color="primary" mt={3}>
              Save changes
            </Button>
          </Grid>
        </Grid>
        <br />
      </form>
    </React.Fragment>
  );
};
export default EnterQuantitativeResultsForm;
