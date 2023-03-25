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
  const formik = useFormik({
    initialValues: {
      sex: [],
      age: [],
      attributeType: [],
      attributeValues: [],
    },
    validationSchema: Yup.object().shape({
      sex: Yup.array().min(1, "Please select gender"),
      age: Yup.array().min(1, "Please select age groups"),
      attributeType: Yup.array().min(1, "Please select attribute type"),
      attributeValues: Yup.array().min(1, "Please select attribute values"),
    }),
    onSubmit: async (values) => {
      console.log(values);
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
  const mutation = useMutation({ mutationFn: saveResultChainAggregate });
  const handleSubmit = async (e) => {
    try {
      // e.preventDefault();
      // const resultChainAggregate = {
      //   id: new Guid().toString(),
      //   createDate: new Date(),
      //   resultChainIndicatorId,
      //   processLevelItemId: processLevelItemId,
      //   processLevelTypeId: processLevelTypeId,
      //   selectedResultChains: [],
      // };
      // for (let i = 0; i < inputFields.length; i++) {
      //   if (Object.values(inputFields[i])[0]) {
      //     const arraySelectedAggregateDisaggregate = Object.keys(
      //       inputFields[i]
      //     )[0].split("/");
      //     resultChainAggregate.selectedResultChains.push({
      //       disaggregateId1: arraySelectedAggregateDisaggregate[0],
      //       disaggregateId2: arraySelectedAggregateDisaggregate[1],
      //     });
      //   }
      // }
      // await mutation.mutateAsync(resultChainAggregate);
      toast("Successfully Created Disaggregates", {
        type: "success",
      });
      handleClick();
    } catch (error) {
      toast(error.response.data, {
        type: "error",
      });
    }
  };
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
