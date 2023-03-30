import React, { useState } from "react";
import {
  Autocomplete as MuiAutocomplete,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField as MuiTextField,
} from "@mui/material";
import { Guid } from "../../../utils/guid";
import { useMutation } from "@tanstack/react-query";
import { saveResultChainAggregate } from "../../../api/result-chain-aggregate";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { saveResultChainAttributes } from "../../../api/result-chain-attribute";

const Autocomplete = styled(MuiAutocomplete)(spacing);
const TextField = styled(MuiTextField)(spacing);

const DisaggregatesModal = ({
  resultChainIndicatorId,
  indicatorAggregates,
  processLevelItemId,
  processLevelTypeId,
  handleClick,
  indicatorAttributeTypes,
}) => {
  const attributesCount = indicatorAttributeTypes.length;
  const aggregatesCount = indicatorAggregates.length;
  const mutation = useMutation({ mutationFn: saveResultChainAggregate });
  const mutationResultChainAttribute = useMutation({
    mutationFn: saveResultChainAttributes,
  });
  const formik = useFormik({
    initialValues: {
      sex: [],
      age: [],
      attributeType: [],
      attributeValues: [],
    },
    validationSchema: Yup.object().shape({
      sex: Yup.array().min(aggregatesCount > 0 ? 1 : 0, "Please select gender"),
      age: Yup.array().min(
        aggregatesCount > 0 ? 1 : 0,
        "Please select age groups"
      ),
      attributeType: Yup.array().min(
        attributesCount > 0 ? 1 : 0,
        "Please select attribute type"
      ),
      attributeValues: Yup.array().min(
        attributesCount > 0 ? 1 : 0,
        "Please select attribute values"
      ),
    }),
    onSubmit: async (values) => {
      try {
        const resultChainAggregate = {
          id: new Guid().toString(),
          createDate: new Date(),
          resultChainIndicatorId,
          processLevelItemId: processLevelItemId,
          processLevelTypeId: processLevelTypeId,
          selectedResultChains: [],
          selectedResultChainAttributes: [],
        };
        const resultChainAttributes = {
          id: new Guid().toString(),
          createDate: new Date(),
          processLevelItemId: processLevelItemId,
          processLevelTypeId: processLevelTypeId,
          resultChainIndicatorId: resultChainIndicatorId,
          selectedResultChains: [],
          selectedResultChainAttributes: [],
        };
        for (let i = 0; i < values.sex.length; i++) {
          for (let j = 0; j < values.age.length; j++) {
            resultChainAggregate.selectedResultChains.push({
              disaggregateId1:
                values.sex[i].aggregateDisaggregate.disaggregate.id,
              disaggregateId2:
                values.age[j].aggregateDisaggregate.disaggregate.id,
            });
          }
        }
        for (let a = 0; a < values.attributeType.length; a++) {
          for (let b = 0; b < values.attributeValues.length; b++) {
            resultChainAttributes.selectedResultChainAttributes.push({
              attributeId: values.attributeType[a].attributeType.id,
              attributeOptionsId: values.attributeValues[b].id,
            });
          }
        }
        await mutation.mutateAsync(resultChainAggregate);
        await mutationResultChainAttribute.mutateAsync(resultChainAttributes);
        toast("Successfully Created Disaggregates", {
          type: "success",
        });
        handleClick();
      } catch (error) {
        console.log(error);
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });
  const primaries = indicatorAggregates.filter((obj) => obj.isPrimary === true);
  const secondaries = indicatorAggregates.filter(
    (obj) => obj.isPrimary === false
  );
  const attributeTypes =
    indicatorAttributeTypes.length > 0 ? [indicatorAttributeTypes[0]] : [];
  const attributeResponseOptions =
    attributeTypes.length > 0
      ? attributeTypes[0].attributeType.attributeResponseOptions
      : [];
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={6}>
          <Grid item md={6}>
            <Autocomplete
              id="sex"
              multiple
              options={primaries}
              getOptionLabel={(primary) =>
                `${primary?.aggregateDisaggregate?.disaggregate?.name}`
              }
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id}>
                    {option.aggregateDisaggregate?.disaggregate?.name}
                  </li>
                );
              }}
              onChange={(_, val) => formik.setFieldValue("sex", val)}
              value={formik.values.sex}
              disabled={aggregatesCount > 0 ? false : true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={Boolean(formik.touched.sex && formik.errors.sex)}
                  fullWidth
                  helperText={formik.touched.sex && formik.errors.sex}
                  label="Sex"
                  name="sex"
                  variant="outlined"
                  my={2}
                />
              )}
            />
          </Grid>
          <Grid item md={6}>
            <Autocomplete
              id="age"
              multiple
              options={secondaries}
              getOptionLabel={(secondary) =>
                `${secondary?.aggregateDisaggregate?.disaggregate?.name}`
              }
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id}>
                    {option.aggregateDisaggregate?.disaggregate?.name}
                  </li>
                );
              }}
              onChange={(_, val) => formik.setFieldValue("age", val)}
              value={formik.values.age}
              disabled={aggregatesCount > 0 ? false : true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={Boolean(formik.touched.age && formik.errors.age)}
                  fullWidth
                  helperText={formik.touched.age && formik.errors.age}
                  label="Age"
                  name="age"
                  variant="outlined"
                  my={2}
                />
              )}
            />
          </Grid>
          <Grid item md={6}>
            <Autocomplete
              id="attributeType"
              multiple
              options={attributeTypes}
              getOptionLabel={(attrType) => `${attrType?.attributeType?.name}`}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id}>
                    {option?.attributeType?.name}
                  </li>
                );
              }}
              onChange={(_, val) => formik.setFieldValue("attributeType", val)}
              value={formik.values.attributeType}
              disabled={attributesCount > 0 ? false : true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={Boolean(
                    formik.touched.attributeType && formik.errors.attributeType
                  )}
                  fullWidth
                  helperText={
                    formik.touched.attributeType && formik.errors.attributeType
                  }
                  label="AttributeType"
                  name="attributeType"
                  variant="outlined"
                  my={2}
                />
              )}
            />
          </Grid>
          <Grid item md={6}>
            <Autocomplete
              id="attributeValues"
              multiple
              options={attributeResponseOptions}
              getOptionLabel={(indicatorAttributeType) =>
                `${indicatorAttributeType?.responseOption}`
              }
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id}>
                    {option?.responseOption}
                  </li>
                );
              }}
              onChange={(_, val) =>
                formik.setFieldValue("attributeValues", val)
              }
              value={formik.values.attributeValues}
              disabled={attributesCount > 0 ? false : true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={Boolean(
                    formik.touched.attributeValues &&
                      formik.errors.attributeValues
                  )}
                  fullWidth
                  helperText={
                    formik.touched.attributeValues &&
                    formik.errors.attributeValues
                  }
                  label="Attribute Values"
                  name="attributeValues"
                  variant="outlined"
                  my={2}
                />
              )}
            />
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" color="primary" mt={3}>
          Save changes
        </Button>
      </form>
    </>
  );
};
export default DisaggregatesModal;
