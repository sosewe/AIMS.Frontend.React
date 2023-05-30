import React, { useEffect } from "react";

import { Grid, TextField as MuiTextField, Typography } from "@mui/material";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { useQuery } from "@tanstack/react-query";
import { getAttributeTypeById } from "../../../api/attribute-type";
import { getAchievedResultsByResultChainIndicatorIdAndAttributeId } from "../../../api/achieved-result";
import { getAttributeResponseOptionById } from "../../../api/attribute-response-option";

const TextField = styled(MuiTextField)(spacing);

const AttributeField = ({
  resultChainAttribute,
  register,
  setValue,
  year,
  monthId,
}) => {
  const {
    data: AttributeData,
    isLoading: isLoadingAttribute,
    isError: isErrorAttribute,
  } = useQuery(
    ["getAttributeTypeById", resultChainAttribute.attributeId],
    getAttributeTypeById,
    { enabled: !!resultChainAttribute.attributeId }
  );
  const {
    data: AttributeResponseOptionData,
    isLoading: isLoadingAttributeResponseOption,
    isError: isErrorAttributeResponseOption,
  } = useQuery(
    ["getAttributeResponseOptionById", resultChainAttribute.attributeOptionsId],
    getAttributeResponseOptionById,
    { enabled: !!resultChainAttribute.attributeOptionsId }
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
        setValue(resultChainAttribute.id, AchievedResult.data[0].achievedValue);
      } else {
        setValue(resultChainAttribute.id, "");
      }
    }
    setCurrentFormValues();
  }, [
    AchievedResult,
    isLoadingAchievedResult,
    isErrorAchievedResult,
    resultChainAttribute.id,
  ]);
  return (
    <Grid container spacing={6} justifyContent="left" direction="row">
      <Grid item md={4}>
        <Typography variant="h5" gutterBottom display="inline">
          {!isLoadingAttribute && !isErrorAttribute
            ? AttributeData.data.name
            : ""}
        </Typography>
        &nbsp;
        {!isLoadingAttributeResponseOption && !isErrorAttributeResponseOption
          ? AttributeResponseOptionData.data.responseOption
          : ""}
      </Grid>
      <Grid item md={4}>
        <TextField
          id={resultChainAttribute.id}
          variant="outlined"
          {...register(resultChainAttribute.id)}
          type="number"
          sx={{ marginBottom: 5 }}
        />
      </Grid>
    </Grid>
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
    <Grid container spacing={6} justifyContent="center">
      <Grid item md={12}>
        {resultChainAttributes.map((resultChainAttribute) => {
          return (
            <React.Fragment key={Math.random().toString(36)}>
              <AttributeField
                resultChainAttribute={resultChainAttribute}
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
  );
};
export default ResultChainAttributeOnlyField;
