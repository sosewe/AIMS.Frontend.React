import React, { useEffect, useState, useCallback } from "react";
import styled from "@emotion/styled";
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Grid,
  MenuItem,
  TextField as MuiTextField,
  Typography,
  Divider as MuiDivider,
  Box,
  CircularProgress,
} from "@mui/material";
import * as Yup from "yup";
import { spacing } from "@mui/system";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { green, purple } from "@mui/material/colors";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { getLearningByProcessLevelItemId } from "../../../../api/learning";
import { getLearningGeographicalFocusByLearningId } from "../../../../api/learning-geographical-focus";

import { getLookupMasterItemsByName } from "../../../../api/lookup";
import { REPORT_FREQUENCY } from "../../../../constants";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);
const Divider = styled(MuiDivider)(spacing);

const theme = createTheme({
  palette: {
    secondary: {
      main: purple[500],
    },
    secondaryGray: {
      main: green[500],
    },
  },
});

const initialValues = {
  implementationYear: "",
  reportingPeriod: "",
  location: "",
  learning: "",
};

const LearningMonitoringForm = ({ processLevelItemId, processLevelTypeId }) => {
  const [learningId, setLearningId] = useState();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: implementationYears,
    isLoading,
    isError,
  } = useQuery(
    ["ImplementationYear", "ImplementationYear"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const { isLoading: isLoadingMonths, data: monthsData } = useQuery(
    ["months", "Months"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );
  const {
    data: learnings,
    isLoading: isLoadingLearnings,
    isError: isErrorLearnings,
  } = useQuery(
    ["getLearningByProcessLevelItemId", processLevelItemId],
    getLearningByProcessLevelItemId,
    {
      enabled: !!processLevelItemId,
    }
  );

  const {
    data: learningLocations,
    isLoading: isLoadingLearningLocations,
    isError: isErrorLearningLocations,
  } = useQuery(
    ["getLearningGeographicalFocusByLearningId", learningId],
    getLearningGeographicalFocusByLearningId,
    {
      refetchOnWindowFocus: false,
      enabled: !!learningId,
    }
  );

  let reportingPeriodData = monthsData;

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      implementationYear: Yup.string().required("Required"),
      reportingPeriod: Yup.string().required("Required"),
      location: Yup.string().required("Required"),
      learning: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        navigate(
          `/project-access/monitoring/learning-results/${processLevelItemId}/${processLevelTypeId}/${values.learning}/${values.location}/${values.reportingPeriod}/${values.implementationYear}`
        );
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  useEffect(() => {}, []);

  const handleActionChange = useCallback();

  const handleLearningChange = (e) => {
    const learningId = e.target.value;
    setLearningId(learningId);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      {formik.isSubmitting ? (
        <Box display="flex" justifyContent="center" my={6}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container item spacing={2}>
          <Grid container spacing={6}>
            <Grid item md={3}>
              <TextField
                name="learning"
                label="Learning Question"
                select
                required
                value={formik.values.learning}
                error={Boolean(
                  formik.touched.learning && formik.errors.learning
                )}
                fullWidth
                helperText={formik.touched.learning && formik.errors.learning}
                onBlur={formik.handleBlur}
                onChange={(e) => {
                  formik.handleChange(e);
                  handleLearningChange(e);
                }}
                variant="outlined"
                my={2}
              >
                <MenuItem disabled value="">
                  Select Learning
                </MenuItem>
                {!isLoadingLearnings && !isErrorLearnings
                  ? learnings.data.map((option) => (
                      <MenuItem key={option.learningQuestion} value={option.id}>
                        {option.learningQuestion}
                      </MenuItem>
                    ))
                  : []}
              </TextField>
            </Grid>

            <Grid item md={3}>
              <TextField
                name="location"
                label="Location"
                select
                required
                value={formik.values.location}
                error={Boolean(
                  formik.touched.location && formik.errors.location
                )}
                fullWidth
                helperText={formik.touched.location && formik.errors.location}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
              >
                <MenuItem disabled value="">
                  Select Location
                </MenuItem>
                {!isLoadingLearningLocations && !isErrorLearningLocations
                  ? learningLocations.data.map((option) => (
                      <MenuItem
                        key={option.administrativeUnitId}
                        value={option.administrativeUnitId}
                      >
                        {option.administrativeUnitName}
                      </MenuItem>
                    ))
                  : []}
              </TextField>
            </Grid>

            <Grid item md={3}>
              <TextField
                name="implementationYear"
                label="Implementation Year"
                select
                required
                value={formik.values.implementationYear}
                error={Boolean(
                  formik.touched.implementationYear &&
                    formik.errors.implementationYear
                )}
                fullWidth
                helperText={
                  formik.touched.implementationYear &&
                  formik.errors.implementationYear
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
              >
                <MenuItem disabled value="">
                  Select Implementation Year
                </MenuItem>
                {!isLoading && !isError
                  ? implementationYears.data.map((option) => (
                      <MenuItem
                        key={option.lookupItemId}
                        value={option.lookupItemId}
                      >
                        {option.lookupItemName}
                      </MenuItem>
                    ))
                  : []}
              </TextField>
            </Grid>
            <Grid item md={3}>
              <TextField
                name="reportingPeriod"
                label="Reporting Period"
                select
                required
                value={formik.values.reportingPeriod}
                error={Boolean(
                  formik.touched.reportingPeriod &&
                    formik.errors.reportingPeriod
                )}
                fullWidth
                helperText={
                  formik.touched.reportingPeriod &&
                  formik.errors.reportingPeriod
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
              >
                <MenuItem disabled value="">
                  Select Reporting Frequency
                </MenuItem>
                {!isLoadingMonths
                  ? reportingPeriodData.data.map((option) => (
                      <MenuItem
                        key={option.lookupItemId}
                        value={option.lookupItemId}
                      >
                        {option.lookupItemName}
                      </MenuItem>
                    ))
                  : []}
              </TextField>
            </Grid>

            <Grid item md={3}>
              <ThemeProvider theme={theme}>
                <Button type="submit" variant="contained" color="primary">
                  Continue
                </Button>
              </ThemeProvider>
            </Grid>
          </Grid>
        </Grid>
      )}
    </form>
  );
};

const LearningMonitoring = () => {
  let { id, processLevelTypeId } = useParams();
  return (
    <React.Fragment>
      <Helmet title="Learning Monitoring" />
      <Typography variant="h5" gutterBottom display="inline">
        Learning Monitoring
      </Typography>
      <Divider my={3} />
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <LearningMonitoringForm
                processLevelItemId={id}
                processLevelTypeId={processLevelTypeId}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default LearningMonitoring;
