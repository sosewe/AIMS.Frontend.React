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
}) => {
  const {
    data: attributeOptionData,
    isLoading: isLoadingAttributeOption,
    isError: isErrorAttributeOption,
  } = useQuery(
    ["getAttributeResponseOptionById", resultChainAttribute.attributeOptionsId],
    getAttributeResponseOptionById,
    { enabled: !!resultChainAttribute.attributeOptionsId }
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
        setValue(
          resultChainAggregate.id + "/" + resultChainAttribute.id,
          AchievedResultData.data[0].achievedValue
        );
      } else {
        setValue(resultChainAggregate.id + "/" + resultChainAttribute.id, "");
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
        id={resultChainAggregate.id + "/" + resultChainAttribute.id}
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
        variant="outlined"
        {...register(resultChainAggregate.id + "/" + resultChainAttribute.id)}
      />
    </React.Fragment>
  );
};
export default ResultChainAggregateAttributeField;
