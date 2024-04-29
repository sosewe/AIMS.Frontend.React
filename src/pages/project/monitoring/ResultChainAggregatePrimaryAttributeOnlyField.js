import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAttributeResponseOptionById } from "../../../api/attribute-response-option";
import { getDisaggregate } from "../../../api/disaggregate";
import { getProjectResultsByAggregateIdAndAttributeId } from "../../../api/achieved-result";
import styled from "@emotion/styled";
import { TextField as MuiTextField } from "@mui/material";
import { spacing } from "@mui/system";

const TextField = styled(MuiTextField)(spacing);

const ResultChainAggregatePrimaryAttributeOnlyField = ({
  resultChainAttribute,
  resultChainAggregate,
  register,
  setValue,
  year,
  monthId,
  primaryResultChainAttribute,
  errors,
  projectLocationId,
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
      projectLocationId,
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
            obj.secondaryResultChainAttributeId === null
        );
        if (val) {
          setValue(
            resultChainAggregate.id +
              "/" +
              resultChainAttribute.id +
              "/" +
              primaryResultChainAttribute.id,
            val.achievedValue
          );
        }
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
          primaryResultChainAttribute.id
        }
        label={
          !isLoadingAttributeOption &&
          !isErrorAttributeOption &&
          !isLoadingDisaggregate &&
          !isErrorDisaggregate &&
          !isLoadingDisaggregate2 &&
          !isErrorDisaggregate2
            ? DisaggregateData.data.name +
              " " +
              DisaggregateData2.data.name +
              " " +
              attributeOptionData.data.responseOption
            : ""
        }
        error={Boolean(
          errors[
            resultChainAggregate.id +
              "/" +
              resultChainAttribute.id +
              "/" +
              primaryResultChainAttribute.id
          ]?.type === "required"
        )}
        variant="outlined"
        fullWidth
        type="number"
        my={2}
        {...register(
          resultChainAggregate.id +
            "/" +
            resultChainAttribute.id +
            "/" +
            primaryResultChainAttribute.id,
          {
            required: "Field is required",
          }
        )}
      />
    </React.Fragment>
  );
};
export default ResultChainAggregatePrimaryAttributeOnlyField;
