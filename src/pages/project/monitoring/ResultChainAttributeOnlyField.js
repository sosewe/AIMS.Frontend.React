import React, { useEffect } from "react";
import { TextField as MuiTextField } from "@mui/material";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { useQuery } from "@tanstack/react-query";
import { getAttributeTypeById } from "../../../api/attribute-type";
import { getAchievedResultsByResultChainIndicatorIdAndAttributeId } from "../../../api/achieved-result";
import { getAttributeResponseOptionById } from "../../../api/attribute-response-option";
import PrimaryAttributeLabel from "./PrimaryAttributeLabel";
import PrimaryAttributeOptionLabel from "./PrimaryAttributeOptionLabel";
import SecondaryAttributeLabel from "./SecondaryAttributeLabel";
import SecondaryAttributeOptionLabel from "./SecondaryAttributeOptionLabel";

const TextField = styled(MuiTextField)(spacing);

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

export const SecondaryAttributeField = ({
  resultChainAttribute,
  register,
  setValue,
  year,
  monthId,
  primaryResultChainAttribute,
  secondaryResultChainAttribute,
}) => {
  const {
    data: AttributeData,
    isLoading: isLoadingAttribute,
    isError: isErrorAttribute,
  } = useQuery(
    ["getAttributeTypeById", primaryResultChainAttribute.attributeTypeId],
    getAttributeTypeById,
    { enabled: !!primaryResultChainAttribute.attributeTypeId }
  );
  const {
    data: AttributeResponseOptionData,
    isLoading: isLoadingAttributeResponseOption,
    isError: isErrorAttributeResponseOption,
  } = useQuery(
    [
      "getAttributeResponseOptionById",
      primaryResultChainAttribute.attributeOptionsId,
    ],
    getAttributeResponseOptionById,
    { enabled: !!primaryResultChainAttribute.attributeOptionsId }
  );
  const {
    data: SecondaryAttributeData,
    isLoading: isLoadingSecondaryAttribute,
    isError: isErrorSecondaryAttribute,
  } = useQuery(
    ["getAttributeTypeById", secondaryResultChainAttribute.attributeTypeId],
    getAttributeTypeById,
    { enabled: !!secondaryResultChainAttribute.attributeTypeId }
  );
  const {
    data: SecondaryAttributeResponseOptionData,
    isLoading: isLoadingSecondaryAttributeResponseOption,
    isError: isErrorSecondaryAttributeResponseOption,
  } = useQuery(
    [
      "getAttributeResponseOptionById",
      secondaryResultChainAttribute.attributeOptionsId,
    ],
    getAttributeResponseOptionById,
    { enabled: !!secondaryResultChainAttribute.attributeOptionsId }
  );
  const {
    data: AchievedResult,
    isLoading: isLoadingAchievedResult,
    isError: isErrorAchievedResult,
  } = useQuery(
    [
      "getAchievedResultsByResultChainIndicatorIdAndAttributeId",
      resultChainAttribute.resultChainIndicatorId,
      resultChainAttribute.id,
      year,
      monthId,
    ],
    getAchievedResultsByResultChainIndicatorIdAndAttributeId,
    {
      enabled:
        !!resultChainAttribute.resultChainIndicatorId &&
        !!resultChainAttribute.id,
    }
  );

  useEffect(() => {
    function setCurrentFormValues() {
      if (
        !isLoadingAchievedResult &&
        !isErrorAchievedResult &&
        AchievedResult.data.length > 0
      ) {
        const val = AchievedResult.data.find(
          (obj) =>
            obj.primaryResultChainAttributeId ===
              primaryResultChainAttribute.id &&
            obj.secondaryResultChainAttributeId ===
              secondaryResultChainAttribute.id
        );
        if (val) {
          setValue(
            resultChainAttribute.id +
              "/" +
              primaryResultChainAttribute.id +
              "/" +
              secondaryResultChainAttribute.id,
            val.achievedValue
          );
        }
      } else {
        setValue(
          resultChainAttribute.id +
            "/" +
            primaryResultChainAttribute.id +
            "/" +
            secondaryResultChainAttribute.id,
          ""
        );
      }
    }
    setCurrentFormValues();
  }, [
    AchievedResult,
    isLoadingAchievedResult,
    isErrorAchievedResult,
    resultChainAttribute.id,
    primaryResultChainAttribute.id,
    secondaryResultChainAttribute.id,
  ]);
  return (
    <TextField
      id={
        resultChainAttribute.id +
        "/" +
        primaryResultChainAttribute.id +
        "/" +
        secondaryResultChainAttribute.id
      }
      label={
        !isLoadingAttribute &&
        !isErrorAttribute &&
        !isLoadingSecondaryAttribute &&
        !isErrorSecondaryAttribute &&
        !isLoadingAttributeResponseOption &&
        !isErrorAttributeResponseOption &&
        !isLoadingSecondaryAttributeResponseOption &&
        !isErrorSecondaryAttributeResponseOption
          ? AttributeData.data.name +
            " " +
            SecondaryAttributeData.data.name +
            " " +
            AttributeResponseOptionData.data.responseOption +
            " " +
            SecondaryAttributeResponseOptionData.data.responseOption
          : ""
      }
      variant="outlined"
      {...register(
        resultChainAttribute.id +
          "/" +
          primaryResultChainAttribute.id +
          "/" +
          secondaryResultChainAttribute.id
      )}
      fullWidth
      my={2}
      type="number"
      sx={{ marginBottom: 5 }}
    />
  );
};

export const AttributeField = ({
  resultChainAttribute,
  register,
  setValue,
  year,
  monthId,
  primaryResultChainAttribute,
}) => {
  const {
    data: AttributeData,
    isLoading: isLoadingAttribute,
    isError: isErrorAttribute,
  } = useQuery(
    ["getAttributeTypeById", primaryResultChainAttribute.attributeTypeId],
    getAttributeTypeById,
    { enabled: !!primaryResultChainAttribute.attributeTypeId }
  );
  const {
    data: AttributeResponseOptionData,
    isLoading: isLoadingAttributeResponseOption,
    isError: isErrorAttributeResponseOption,
  } = useQuery(
    [
      "getAttributeResponseOptionById",
      primaryResultChainAttribute.attributeOptionsId,
    ],
    getAttributeResponseOptionById,
    { enabled: !!primaryResultChainAttribute.attributeOptionsId }
  );
  const {
    data: AchievedResult,
    isLoading: isLoadingAchievedResult,
    isError: isErrorAchievedResult,
  } = useQuery(
    [
      "getAchievedResultsByResultChainIndicatorIdAndAttributeId",
      resultChainAttribute.resultChainIndicatorId,
      resultChainAttribute.id,
      year,
      monthId,
    ],
    getAchievedResultsByResultChainIndicatorIdAndAttributeId,
    {
      enabled:
        !!resultChainAttribute.resultChainIndicatorId &&
        !!resultChainAttribute.id,
    }
  );

  useEffect(() => {
    function setCurrentFormValues() {
      if (
        !isLoadingAchievedResult &&
        !isErrorAchievedResult &&
        AchievedResult.data.length > 0
      ) {
        const val = AchievedResult.data.find(
          (obj) =>
            obj.primaryResultChainAttributeId === primaryResultChainAttribute.id
        );
        if (val) {
          setValue(
            resultChainAttribute.id + "/" + primaryResultChainAttribute.id,
            val.achievedValue
          );
        }
      } else {
        setValue(
          resultChainAttribute.id + "/" + primaryResultChainAttribute.id,
          ""
        );
      }
    }
    setCurrentFormValues();
  }, [
    AchievedResult,
    isLoadingAchievedResult,
    isErrorAchievedResult,
    resultChainAttribute.id,
    primaryResultChainAttribute.id,
  ]);
  return (
    <TextField
      id={resultChainAttribute.id + "/" + primaryResultChainAttribute.id}
      variant="outlined"
      label={
        !isLoadingAttribute &&
        !isErrorAttribute &&
        !isLoadingAttributeResponseOption &&
        !isErrorAttributeResponseOption
          ? AttributeData.data.name +
            " " +
            AttributeResponseOptionData.data.responseOption
          : ""
      }
      {...register(
        resultChainAttribute.id + "/" + primaryResultChainAttribute.id
      )}
      type="number"
      fullWidth
      my={2}
      sx={{ marginBottom: 5 }}
    />
  );
};

const ResultChainAttributeOnlyField = ({
  resultChainAttributes,
  register,
  setValue,
  year,
  monthId,
}) => {
  return (
    <React.Fragment>
      {resultChainAttributes.map((resultChainAttribute) => {
        return (
          <React.Fragment key={Math.random().toString(36)}>
            {resultChainAttribute.primaryResultChainAttributes.length > 0 ? (
              <React.Fragment>
                <TableHead sx={{ backgroundColor: "#4472C4" }}>
                  <TableRow>
                    <StyledTableCell sx={{ width: "30%" }}>
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
                                  .secondaryResultChainAttributes.length + 1
                              }
                            >
                              <PrimaryAttributeOptionLabel
                                primaryResultChainAttribute={
                                  primaryResultChainAttribute
                                }
                              />
                            </StyledTableCell>
                            {primaryResultChainAttribute
                              .secondaryResultChainAttributes.length === 0 && (
                              <StyledTableCell>
                                <AttributeField
                                  resultChainAttribute={resultChainAttribute}
                                  register={register}
                                  setValue={setValue}
                                  year={year}
                                  monthId={monthId}
                                  primaryResultChainAttribute={
                                    primaryResultChainAttribute
                                  }
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
                                    resultChainAttribute={resultChainAttribute}
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
                </TableBody>
              </React.Fragment>
            ) : (
              <React.Fragment>&nbsp;</React.Fragment>
            )}
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
};
export default ResultChainAttributeOnlyField;
