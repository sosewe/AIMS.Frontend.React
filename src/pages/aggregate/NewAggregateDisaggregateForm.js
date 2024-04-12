import React, { useEffect } from "react";
import {
  Autocomplete as MuiAutocomplete,
  Button,
  Grid,
  MenuItem,
  TextField as MuiTextField,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { getAllDisaggregatesByLevel } from "../../api/disaggregate";
import { getAllAggregates } from "../../api/aggregate";
import { Guid } from "../../utils/guid";
import useKeyCloakAuth from "../../hooks/useKeyCloakAuth";
import { useNavigate } from "react-router-dom";
import { aggregateDisaggregateConfig } from "../../api/aggregate-disaggregate";

const Autocomplete = styled(MuiAutocomplete)(spacing);
const TextField = styled(MuiTextField)(spacing);

const NewAggregateDisaggregateForm = ({ aggregateId }) => {
  const user = useKeyCloakAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isLoading, isError, data } = useQuery(
    ["getAllDisaggregatesByLevel", 2],
    getAllDisaggregatesByLevel
  );
  const {
    isLoading: isLoadingLevel3,
    isError: isErrorLevel3,
    data: Level3Data,
  } = useQuery(["getAllDisaggregatesByLevel", 3], getAllDisaggregatesByLevel);
  const {
    isLoading: isLoadingAggregates,
    isError: isErrorAggregates,
    data: AggregatesData,
  } = useQuery(["getAllAggregates"], getAllAggregates);
  const mutation = useMutation({ mutationFn: aggregateDisaggregateConfig });
  const formik = useFormik({
    initialValues: { aggregateId: "", disaggregateId: "", disaggregateId2: [] },
    validationSchema: Yup.object().shape({
      aggregateId: Yup.string().required("Required"),
      disaggregateId: Yup.object().required("Required"),
      /*
      disaggregateId2: Yup.array().min(
        1,
        "Please select at least one disaggregate"
      ),
      */
      disaggregateId2: Yup.array().nullable(),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setSubmitting(true);
      values.createDate = new Date();
      values.userId = user.sub;
      values.id = new Guid().toString();
      try {
        const Indata = {
          aggregateId: aggregateId,
          disaggregateId: values.disaggregateId.id,
          children: values.disaggregateId2,
        };
        await mutation.mutateAsync(Indata);
        resetForm();
        toast("Successfully Created a Aggregate-Disaggregate", {
          type: "success",
        });
        await queryClient.invalidateQueries(["getAggregateDisaggregates"]);
        navigate("/indicator/view-aggregate/" + aggregateId);
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  useEffect(() => {
    function setCurrentFormValues() {
      if (aggregateId) {
        formik.setValues({
          aggregateId: aggregateId,
          disaggregateId: "",
          disaggregateId2: [],
        });
      }
    }
    setCurrentFormValues();
  }, [aggregateId]);
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={6}>
          <Grid item md={4}>
            <TextField
              name="aggregateId"
              label="Aggregate(Level 1)"
              select
              value={formik.values.aggregateId}
              error={Boolean(
                formik.touched.aggregateId && formik.errors.aggregateId
              )}
              fullWidth
              helperText={
                formik.touched.aggregateId && formik.errors.aggregateId
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
              disabled={true}
            >
              <MenuItem disabled value="">
                Select Aggregate
              </MenuItem>
              {!isLoadingAggregates && !isErrorAggregates
                ? AggregatesData.data.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))
                : []}
            </TextField>
          </Grid>
          <Grid item md={4}>
            <Autocomplete
              id="disaggregateId"
              options={!isLoading && !isError ? data.data : []}
              getOptionLabel={(option) => `${option ? option?.name : ""}`}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id}>
                    {option?.name}
                  </li>
                );
              }}
              onChange={(_, val) => formik.setFieldValue("disaggregateId", val)}
              value={formik.values.disaggregateId}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={Boolean(
                    formik.touched.disaggregateId &&
                      formik.errors.disaggregateId
                  )}
                  fullWidth
                  helperText={
                    formik.touched.disaggregateId &&
                    formik.errors.disaggregateId
                  }
                  label="Disaggregate(Level 2)"
                  name="disaggregateId"
                  variant="outlined"
                  my={2}
                />
              )}
            />
          </Grid>
          <Grid item md={4}>
            <Autocomplete
              id="disaggregateId2"
              multiple
              options={
                !isLoadingLevel3 && !isErrorLevel3 ? Level3Data.data : []
              }
              getOptionLabel={(option) => `${option ? option?.name : ""}`}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id}>
                    {option?.name}
                  </li>
                );
              }}
              onChange={(_, val) =>
                formik.setFieldValue("disaggregateId2", val)
              }
              value={formik.values.disaggregateId2}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={Boolean(
                    formik.touched.disaggregateId2 &&
                      formik.errors.disaggregateId2
                  )}
                  fullWidth
                  helperText={
                    formik.touched.disaggregateId2 &&
                    formik.errors.disaggregateId2
                  }
                  label="Disaggregate(Level 3)"
                  name="disaggregateId2"
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
export default NewAggregateDisaggregateForm;
