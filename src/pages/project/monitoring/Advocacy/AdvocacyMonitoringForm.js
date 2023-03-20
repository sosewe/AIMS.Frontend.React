import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
  Autocomplete as MuiAutocomplete,
  Box,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  CircularProgress,
  Grid,
  Paper as MuiPaper,
  TextField as MuiTextField,
} from "@mui/material";
import { spacing } from "@mui/system";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Guid } from "../../../../utils/guid";
import { toast } from "react-toastify";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);
const Autocomplete = styled(MuiAutocomplete)(spacing);
const TextField = styled(MuiTextField)(spacing);

const initialValues = {};

const AdvocacyMonitoringForm = () => {
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      name: Yup.object().required("Required"),
      staffNameId: Yup.object().required("Required"),
      countryId: Yup.array().required("Required"),
      duration_from: Yup.date().required("Required"),
      duration_to: Yup.date().required("Required"),
      currentStageId: Yup.string().required("Required"),
      updateProgress: Yup.string().required("Required"),
      bragStatusId: Yup.string().required("Required"),
      plaDeviations: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        console.log(values);
        values.id = new Guid().toString();
      } catch (error) {
        console.log(error);
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card mb={12}>
        <CardContent>
          {formik.isSubmitting ? (
            <Box display="flex" justifyContent="center" my={6}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid container item spacing={2}>
                <Grid item md={6}></Grid>
              </Grid>
            </>
          )}
        </CardContent>
      </Card>
    </form>
  );
};
export default AdvocacyMonitoringForm;
