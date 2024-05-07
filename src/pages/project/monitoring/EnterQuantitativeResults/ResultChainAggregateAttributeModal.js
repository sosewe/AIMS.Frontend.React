import React from "react";
import { useForm } from "react-hook-form";
import styled from "@emotion/styled";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { Button, TableBody, TableHead } from "@mui/material";
import PrimaryAttributeLabel from "../PrimaryAttributeLabel";
import SecondaryAttributeLabel from "../SecondaryAttributeLabel";
import PrimaryAttributeOptionLabel from "../PrimaryAttributeOptionLabel";
import ResultChainAggregatePrimaryAttributeOnlyField from "../ResultChainAggregatePrimaryAttributeOnlyField";
import AggregateDisAggregateLabel from "../AggregateDisAggregateLabel";
import { Guid } from "../../../../utils/guid";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getProjectResults,
  newAchievedResult,
} from "../../../../api/achieved-result";
import { toast } from "react-toastify";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const PrimaryResultChainAttributesField = ({
  primaryResultChainAttributes,
  resultChainAggregates,
  register,
  setValue,
  year,
  monthId,
  resultChainAttribute,
  errors,
  projectLocationId,
}) => {
  return (
    <React.Fragment>
      <TableHead sx={{ backgroundColor: "#4472C4" }}>
        <TableRow>
          <StyledTableCell>
            Attribute1 (
            <PrimaryAttributeLabel
              primaryResultChainAttribute={
                resultChainAttribute.primaryResultChainAttributes[0]
              }
            />
            )
          </StyledTableCell>
          {resultChainAttribute.primaryResultChainAttributes[0]
            .secondaryResultChainAttributes.length > 0 && (
            <StyledTableCell>
              Attribute2 (
              <SecondaryAttributeLabel
                secondaryResultChainAttribute={
                  resultChainAttribute.primaryResultChainAttributes[0]
                    .secondaryResultChainAttributes[0]
                }
              />
              )
            </StyledTableCell>
          )}
          {resultChainAggregates.map((resultChainAggregate, i) => (
            <StyledTableCell key={i}>
              {!resultChainAggregate.void && (
                <AggregateDisAggregateLabel
                  resultChainAggregate={resultChainAggregate}
                />
              )}
            </StyledTableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {primaryResultChainAttributes.map((primaryResultChainAttribute, i) => (
          <React.Fragment key={Math.random().toString(36)}>
            <StyledTableRow key={i}>
              <StyledTableCell
                rowSpan={
                  primaryResultChainAttribute.secondaryResultChainAttributes
                    .length + 1
                }
              >
                <PrimaryAttributeOptionLabel
                  primaryResultChainAttribute={primaryResultChainAttribute}
                />
              </StyledTableCell>
              {primaryResultChainAttribute.secondaryResultChainAttributes
                .length === 0 && (
                <React.Fragment>
                  {resultChainAggregates.map((resultChainAggregate, i) => (
                    <StyledTableCell key={i}>
                      {!resultChainAggregate.void && (
                        <ResultChainAggregatePrimaryAttributeOnlyField
                          resultChainAttribute={resultChainAttribute}
                          resultChainAggregate={resultChainAggregate}
                          register={register}
                          setValue={setValue}
                          year={year}
                          monthId={monthId}
                          primaryResultChainAttribute={
                            primaryResultChainAttribute
                          }
                          errors={errors}
                          projectLocationId={projectLocationId}
                        />
                      )}
                    </StyledTableCell>
                  ))}
                </React.Fragment>
              )}
            </StyledTableRow>
          </React.Fragment>
        ))}
        <TableRow>&nbsp;</TableRow>
        <TableRow>
          <Button type="submit" variant="contained" color="primary" mt={3}>
            Save changes
          </Button>
        </TableRow>
      </TableBody>
    </React.Fragment>
  );
};

const ResultChainAggregateAttributeModal = ({
  resultChainAggregates,
  resultChainAttributes,
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
    ["getProjectResults", processLevelItemId, year, monthId, projectLocationId],
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
                    const achievedValue = Number(
                      data[
                        resultChainIndicatorAggregateElement.id +
                          "/" +
                          resultChainAttribute.id +
                          "/" +
                          primaryResultChainAttribute.id +
                          "/" +
                          secondaryResultChainAttribute.id
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
                        achievedValue: achievedValue,
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
                  const achievedValue = Number(
                    data[
                      resultChainIndicatorAggregateElement.id +
                        "/" +
                        resultChainAttribute.id +
                        "/" +
                        primaryResultChainAttribute.id
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
        {resultChainAttributes.primaryResultChainAttributes.length > 0 ? (
          <React.Fragment key={Math.random().toString(36)}>
            <PrimaryResultChainAttributesField
              primaryResultChainAttributes={
                resultChainAttributes["primaryResultChainAttributes"]
              }
              resultChainAggregates={resultChainAggregates}
              register={register}
              setValue={setValue}
              year={year}
              monthId={monthId}
              resultChainAttribute={resultChainAttributes}
              errors={errors}
              projectLocationId={projectLocationId}
            />
          </React.Fragment>
        ) : (
          ``
        )}
      </form>
    </React.Fragment>
  );
};
export default ResultChainAggregateAttributeModal;
