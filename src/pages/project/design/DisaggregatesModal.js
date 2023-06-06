import React, { useEffect } from "react";
import {
  Autocomplete as MuiAutocomplete,
  Button,
  Grid,
  TextField as MuiTextField,
} from "@mui/material";
import { Guid } from "../../../utils/guid";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getResultChainAggregateByResultChainIndicatorId,
  saveResultChainAggregate,
} from "../../../api/result-chain-aggregate";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
// import {
//   getResultChainAttributeByIndicatorId,
//   saveResultChainAttributes,
// } from "../../../api/result-chain-attribute";

const Autocomplete = styled(MuiAutocomplete)(spacing);
const TextField = styled(MuiTextField)(spacing);

const DisaggregatesModal = ({
  resultChainIndicatorId,
  indicatorAggregates,
  processLevelItemId,
  processLevelTypeId,
  handleClick,
}) => {
  const {
    data: ResultChains,
    isLoading: isLoadingResultChains,
    isError: isErrorResultChains,
  } = useQuery(
    ["getResultChainAggregateByResultChainIndicatorId", resultChainIndicatorId],
    getResultChainAggregateByResultChainIndicatorId,
    { enabled: !!resultChainIndicatorId }
  );

  const aggregatesCount = indicatorAggregates.length;
  const mutation = useMutation({ mutationFn: saveResultChainAggregate });
  const formik = useFormik({
    initialValues: {
      sex: [],
      age: [],
    },
    validationSchema: Yup.object().shape({
      sex: Yup.array().min(aggregatesCount > 0 ? 1 : 0, "Please select gender"),
      age: Yup.array().min(
        aggregatesCount > 0 ? 1 : 0,
        "Please select age groups"
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
        await mutation.mutateAsync(resultChainAggregate);
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
  useEffect(() => {
    function setCurrentFormValues() {
      if (
        !isLoadingResultChains &&
        !isErrorResultChains
        // &&
        // !isLoadingResultChainAttribute &&
        // !isErrorResultChainAttribute
      ) {
        let ageVal = [];
        let sexVal;
        // let attributeType;
        // let attributeValues = [];
        if (ResultChains.data.length > 0) {
          sexVal = primaries.find(
            (obj) =>
              obj.aggregateDisaggregate.disaggregate.id ===
              ResultChains.data[0].disaggregateId1
          );
          for (const resultChainElement of ResultChains.data) {
            const res = secondaries.find(
              (obj) =>
                obj.aggregateDisaggregate.disaggregate.id ===
                resultChainElement.disaggregateId2
            );
            if (res) {
              ageVal.push(res);
            }
          }
        }
        // if (ResultChainAttribute.data.length > 0) {
        //   attributeType = attributeTypes.find(
        //     (obj) =>
        //       obj.attributeTypeId === ResultChainAttribute.data[0].attributeId
        //   );
        // }
        // for (const resultChainAttributeValue of ResultChainAttribute.data) {
        //   const res = attributeResponseOptions.find(
        //     (obj) => obj.id === resultChainAttributeValue.attributeOptionsId
        //   );
        //   attributeValues.push(res);
        // }
        formik.setValues({
          sex: sexVal ? [sexVal] : [],
          age: ageVal,
          // attributeType: attributeType ? [attributeType] : [],
          // attributeValues: attributeValues,
        });
      }
    }
    setCurrentFormValues();
  }, [
    ResultChains,
    isLoadingResultChains,
    isErrorResultChains,
    // ResultChainAttribute,
    // isLoadingResultChainAttribute,
    // isErrorResultChainAttribute,
  ]);
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
        </Grid>
        <Button type="submit" variant="contained" color="primary" mt={3}>
          Save changes
        </Button>
      </form>
    </>
  );
};
export default DisaggregatesModal;
