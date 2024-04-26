import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getProjectResults,
  newAchievedResult,
} from "../../../../api/achieved-result";
import Paper from "@mui/material/Paper";
import { Button, Table } from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import PrimaryAttributeLabel from "../PrimaryAttributeLabel";
import SecondaryAttributeLabel from "../SecondaryAttributeLabel";
import TableBody from "@mui/material/TableBody";
import PrimaryAttributeOptionLabel from "../PrimaryAttributeOptionLabel";
import SecondaryAttributeOptionLabel from "../SecondaryAttributeOptionLabel";
import styled from "@emotion/styled";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import {
  AttributeField,
  SecondaryAttributeField,
} from "../ResultChainAttributeOnlyField";
import { Guid } from "../../../../utils/guid";
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

const ResultChainAttributeOnlyModal = ({
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

                    const achievedValue = Number(
                      data[
                        resultChainIndicatorAttributeElement.id +
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

                  const achievedValue = Number(
                    data[
                      resultChainIndicatorAttributeElement.id +
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
                      achievedValue: achievedValue,
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
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            {resultChainAttributes.map((resultChainAttribute) => {
              return (
                <React.Fragment key={Math.random().toString(36)}>
                  {resultChainAttribute.primaryResultChainAttributes.length >
                  0 ? (
                    <React.Fragment>
                      <TableHead sx={{ backgroundColor: "#4472C4" }}>
                        <TableRow>
                          <StyledTableCell sx={{ width: "30%" }}>
                            Attribute1 (
                            <PrimaryAttributeLabel
                              primaryResultChainAttribute={
                                resultChainAttribute
                                  .primaryResultChainAttributes[0]
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
                                  resultChainAttribute
                                    .primaryResultChainAttributes[0]
                                    .secondaryResultChainAttributes[0]
                                }
                              />
                              )
                            </StyledTableCell>
                          )}
                          <StyledTableCell>Value</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {resultChainAttribute.primaryResultChainAttributes.map(
                          (primaryResultChainAttribute, i) => {
                            return (
                              <React.Fragment key={Math.random().toString(36)}>
                                <StyledTableRow key={i}>
                                  <StyledTableCell
                                    rowSpan={
                                      primaryResultChainAttribute
                                        .secondaryResultChainAttributes.length +
                                      1
                                    }
                                  >
                                    <PrimaryAttributeOptionLabel
                                      primaryResultChainAttribute={
                                        primaryResultChainAttribute
                                      }
                                    />
                                  </StyledTableCell>
                                  {primaryResultChainAttribute
                                    .secondaryResultChainAttributes.length ===
                                    0 && (
                                    <StyledTableCell>
                                      <AttributeField
                                        resultChainAttribute={
                                          resultChainAttribute
                                        }
                                        register={register}
                                        setValue={setValue}
                                        year={year}
                                        monthId={monthId}
                                        primaryResultChainAttribute={
                                          primaryResultChainAttribute
                                        }
                                        projectLocationId={projectLocationId}
                                      />
                                    </StyledTableCell>
                                  )}
                                </StyledTableRow>
                                {primaryResultChainAttribute.secondaryResultChainAttributes.map(
                                  (secondaryResultChainAttribute, i) => (
                                    <StyledTableRow key={i}>
                                      <StyledTableCell>
                                        <SecondaryAttributeOptionLabel
                                          secondaryResultChainAttribute={
                                            secondaryResultChainAttribute
                                          }
                                        />
                                      </StyledTableCell>
                                      <StyledTableCell>
                                        <SecondaryAttributeField
                                          resultChainAttribute={
                                            resultChainAttribute
                                          }
                                          register={register}
                                          setValue={setValue}
                                          year={year}
                                          monthId={monthId}
                                          primaryResultChainAttribute={
                                            primaryResultChainAttribute
                                          }
                                          secondaryResultChainAttribute={
                                            secondaryResultChainAttribute
                                          }
                                        />
                                      </StyledTableCell>
                                    </StyledTableRow>
                                  )
                                )}
                              </React.Fragment>
                            );
                          }
                        )}
                        <TableRow>
                          <StyledTableCell>
                            <Button
                              type="submit"
                              variant="contained"
                              color="primary"
                              mt={3}
                            >
                              Save changes
                            </Button>
                          </StyledTableCell>
                        </TableRow>
                      </TableBody>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>&nbsp;</React.Fragment>
                  )}
                </React.Fragment>
              );
            })}
          </Table>
        </TableContainer>
      </form>
    </React.Fragment>
  );
};
export default ResultChainAttributeOnlyModal;
