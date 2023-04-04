import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { TextField as MuiTextField } from "@mui/material";
import { spacing } from "@mui/system";
import { useQuery } from "@tanstack/react-query";
import { getProjectResultsByAggregateIdAndAttributeId } from "../../../api/achieved-result";

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
        variant="outlined"
        {...register(resultChainAggregate.id + "/" + resultChainAttribute.id)}
      />
    </React.Fragment>
  );
};
export default ResultChainAggregateAttributeField;
