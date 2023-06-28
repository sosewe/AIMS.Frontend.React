import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { TextField as MuiTextField } from "@mui/material";
import { spacing } from "@mui/system";
import { useQuery } from "@tanstack/react-query";
import { getProjectResultsByAggregateIdAndAttributeId } from "../../../api/achieved-result";
import { getAttributeResponseOptionById } from "../../../api/attribute-response-option";
import { getDisaggregate } from "../../../api/disaggregate";

const TextField = styled(MuiTextField)(spacing);

const ResultChainAggregateAttributeField = ({
  resultChainAttribute,
  resultChainAggregate,
  register,
  setValue,
  year,
  monthId,
  primaryResultChainAttribute,
  secondaryResultChainAttribute,
}) => {
  const {
    data: attributeOptionData,
    isLoading: isLoadingAttributeOption,
    isError: isErrorAttributeOption,
  } = useQuery(
    [
      "getAttributeResponseOptionById",
      primaryResultChainAttribute.attributeOptionsId,
    ],
    getAttributeResponseOptionById,
    { enabled: !!primaryResultChainAttribute.attributeOptionsId }
  );
  const {
    data: secondaryAttributeOptionData,
    isLoading: isLoadingSecondaryAttributeOption,
    isError: isErrorSecondaryAttributeOption,
  } = useQuery(
    [
      "getAttributeResponseOptionById",
      secondaryResultChainAttribute.attributeOptionsId,
    ],
    getAttributeResponseOptionById,
    { enabled: !!secondaryResultChainAttribute.attributeOptionsId }
  );
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
      "getProjectResultsByAggregateIdAndAttributeId",
      resultChainAggregate.id,
      resultChainAttribute.id,
      year,
      monthId,
    ],
    getProjectResultsByAggregateIdAndAttributeId,
    { enabled: !!resultChainAggregate.id && !!resultChainAttribute.id }
  );
  useEffect(() => {
    function setCurrentFormValues() {
      if (
        !isLoadingAchievedResult &&
        !isErrorAchievedResult &&
        AchievedResultData.data.length > 0
      ) {
        const val = AchievedResultData.data.find(
          (obj) =>
            obj.primaryResultChainAttributeId ===
              primaryResultChainAttribute.id &&
            obj.secondaryResultChainAttributeId ===
              secondaryResultChainAttribute.id
        );
        if (val) {
          setValue(
            resultChainAggregate.id +
              "/" +
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
          resultChainAggregate.id +
            "/" +
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
    AchievedResultData,
    isLoadingAchievedResult,
    isErrorAchievedResult,
    resultChainAggregate.id,
    resultChainAttribute.id,
  ]);
  return (
    <React.Fragment>
      <TextField
        id={
          resultChainAggregate.id +
          "/" +
          resultChainAttribute.id +
          "/" +
          primaryResultChainAttribute.id +
          "/" +
          secondaryResultChainAttribute.id
        }
        label={
          !isLoadingAttributeOption &&
          !isLoadingSecondaryAttributeOption &&
          !isErrorAttributeOption &&
          !isErrorSecondaryAttributeOption &&
          !isLoadingDisaggregate &&
          !isErrorDisaggregate &&
          !isLoadingDisaggregate2 &&
          !isErrorDisaggregate2
            ? DisaggregateData.data.name +
              " " +
              DisaggregateData2.data.name +
              " " +
              attributeOptionData.data.responseOption +
              " " +
              secondaryAttributeOptionData.data.responseOption
            : ""
        }
        variant="outlined"
        type="number"
        fullWidth
        my={2}
        {...register(
          resultChainAggregate.id +
            "/" +
            resultChainAttribute.id +
            "/" +
            primaryResultChainAttribute.id +
            "/" +
            secondaryResultChainAttribute.id
        )}
      />
    </React.Fragment>
  );
};
export default ResultChainAggregateAttributeField;
