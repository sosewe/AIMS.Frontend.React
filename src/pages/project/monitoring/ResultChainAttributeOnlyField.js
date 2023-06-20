import React, { useEffect } from "react";

import { Grid, TextField as MuiTextField, Typography } from "@mui/material";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { useQuery } from "@tanstack/react-query";
import { getAttributeTypeById } from "../../../api/attribute-type";
import { getAchievedResultsByResultChainIndicatorIdAndAttributeId } from "../../../api/achieved-result";
import { getAttributeResponseOptionById } from "../../../api/attribute-response-option";

const TextField = styled(MuiTextField)(spacing);

const SecondaryAttributeField = ({
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
    <Grid container spacing={6} justifyContent="left" direction="row">
      <Grid item md={4}>
        <Typography variant="h5" gutterBottom display="inline">
          {!isLoadingAttribute && !isErrorAttribute
            ? AttributeData.data.name
            : ""}
          &nbsp;
          {!isLoadingSecondaryAttribute && !isErrorSecondaryAttribute
            ? SecondaryAttributeData.data.name
            : ""}
        </Typography>
        &nbsp;
        {!isLoadingAttributeResponseOption && !isErrorAttributeResponseOption
          ? AttributeResponseOptionData.data.responseOption
          : ""}
        &nbsp;
        {!isLoadingSecondaryAttributeResponseOption &&
        !isErrorSecondaryAttributeResponseOption
          ? SecondaryAttributeResponseOptionData.data.responseOption
          : ""}
      </Grid>
      <Grid item md={4}>
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
      </Grid>
    </Grid>
  );
};

const PrimaryAttributeField = ({
  primaryResultChainAttribute,
  resultChainAttribute,
  register,
  setValue,
  year,
  monthId,
}) => {
  return (
    <React.Fragment>
      {primaryResultChainAttribute.secondaryResultChainAttributes.length > 0 ? (
        <React.Fragment>
          {primaryResultChainAttribute.secondaryResultChainAttributes.map(
            (secondaryResultChainAttribute) => {
              return (
                <React.Fragment key={Math.random().toString(36)}>
                  <SecondaryAttributeField
                    resultChainAttribute={resultChainAttribute}
                    register={register}
                    setValue={setValue}
                    year={year}
                    monthId={monthId}
                    primaryResultChainAttribute={primaryResultChainAttribute}
                    secondaryResultChainAttribute={
                      secondaryResultChainAttribute
                    }
                  />
                </React.Fragment>
              );
            }
          )}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <AttributeField
            resultChainAttribute={resultChainAttribute}
            register={register}
            setValue={setValue}
            year={year}
            monthId={monthId}
            primaryResultChainAttribute={primaryResultChainAttribute}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

const AttributeField = ({
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
              {resultChainAttribute.primaryResultChainAttributes.length > 0 ? (
                <React.Fragment>
                  {resultChainAttribute.primaryResultChainAttributes.map(
                    (primaryResultChainAttribute) => {
                      return (
                        <React.Fragment key={Math.random().toString(36)}>
                          <PrimaryAttributeField
                            primaryResultChainAttribute={
                              primaryResultChainAttribute
                            }
                            resultChainAttribute={resultChainAttribute}
                            register={register}
                            setValue={setValue}
                            year={year}
                            monthId={monthId}
                          />
                        </React.Fragment>
                      );
                    }
                  )}
                </React.Fragment>
              ) : (
                <React.Fragment>&nbsp;</React.Fragment>
              )}
            </React.Fragment>
          );
        })}
      </Grid>
    </Grid>
  );
};
export default ResultChainAttributeOnlyField;
