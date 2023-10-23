import React from "react";
import styled from "@emotion/styled";
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Grid,
  MenuItem,
  TextField as MuiTextField,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { spacing } from "@mui/system";
import "./colors.css";
import { useQuery } from "@tanstack/react-query";
import { getLookupMasterItemsByName } from "../../../../api/lookup";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const initialValues = {
  bragStatusId: "",
  planDeviation: "",
  updateProgress: "",
};
const colorclass = ["theblue", "thered", "theamber", "thegreen"];

const AdvocacyMonitoringProgress = ({ handleClick }) => {
  const {
    isLoading: isLoadingBRAGStatusData,
    isError: isErrorBRAGStatusData,
    data: BRAGStatusData,
  } = useQuery(["bragStatus", "BRAGStatus"], getLookupMasterItemsByName, {
    refetchOnWindowFocus: false,
  });
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      bragStatusId: Yup.string().required("Required"),
      planDeviation: Yup.string().required("Required"),
      updateProgress: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        handleClick(values);
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      } finally {
        resetForm();
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item md={12}>
              <TextField
                name="updateProgress"
                label="Update progress on Advocacy from last quarter or from set up for each milestone"
                value={formik.values.updateProgress}
                error={Boolean(
                  formik.touched.updateProgress && formik.errors.updateProgress
                )}
                fullWidth
                helperText={
                  formik.touched.updateProgress && formik.errors.updateProgress
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                multiline
                variant="outlined"
                my={2}
                rows={3}
              />
            </Grid>
            <Grid item md={12}>
              <TextField
                name="planDeviation"
                label="Update any deviations from original plan"
                value={formik.values.planDeviation}
                error={Boolean(
                  formik.touched.planDeviation && formik.errors.planDeviation
                )}
                fullWidth
                helperText={
                  formik.touched.planDeviation && formik.errors.planDeviation
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                multiline
                variant="outlined"
                my={2}
                rows={3}
              />
            </Grid>
            <Grid item md={6}>
              <TextField
                name="bragStatusId"
                label="BRAG Status"
                select
                required
                value={formik.values.bragStatusId}
                error={Boolean(
                  formik.touched.bragStatusId && formik.errors.bragStatusId
                )}
                fullWidth
                helperText={
                  formik.touched.bragStatusId && formik.errors.bragStatusId
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
              >
                <MenuItem disabled value="">
                  Select BRAG Status
                </MenuItem>
                {!isLoadingBRAGStatusData && !isErrorBRAGStatusData
                  ? BRAGStatusData.data.map((option, index) => (
                      <MenuItem
                        className={colorclass[index]}
                        key={option.lookupItemId}
                        value={option.lookupItemId}
                      >
                        {option.lookupItemName}
                      </MenuItem>
                    ))
                  : []}
              </TextField>
            </Grid>
            <Grid item md={6}></Grid>
            <Grid item md={3}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                mt={3}
              >
                Update
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};
export default AdvocacyMonitoringProgress;
