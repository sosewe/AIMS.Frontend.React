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

import { getTechnicalAssistanceByProcessLevelItemId } from "../../../../api/technical-assistance";
import { getTechnicalAssistanceGeographicalFocus } from "../../../../api/technical-assistance-geographic-focus";

import { getInnovationByProcessLevelItemId } from "../../../../api/innovation";
import { getInnovationGeographicalFocus } from "../../../../api/innovation-geographical-focus";
import { getInnovationObjectiveClassificationByInnovationId } from "../../../../api/innovation-objectivesclassification";
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
  technicalAssistance: "",
};

const TechnicalAssistanceMonitoringForm = ({
  processLevelItemId,
  processLevelTypeId,
}) => {
  const [technicalAssistanceId, setTechnicalAssistanceId] = useState();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: technicalAssistances,
    isLoading: isLoadingTechnicalAssistances,
    isError: isErrorTechnicalAssistances,
    error,
  } = useQuery(
    ["getTechnicalAssistanceByProcessLevelItemId", processLevelItemId],
    getTechnicalAssistanceByProcessLevelItemId,
    {
      enabled: !!processLevelItemId,
    }
  );

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

  const { isLoading: isLoadingYears, data: yearsData } = useQuery(
    ["years", "Years"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const { isLoading: isLoadingQuarters, data: quartersData } = useQuery(
    ["quarters", "Quarters"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: technicalAssistanceLocations,
    isLoading: isLoadingTechnicalAssistanceLocations,
    isError: isErrorTechnicalAssistanceLocations,
  } = useQuery(
    ["getTechnicalAssistanceGeographicalFocus", technicalAssistanceId],
    getTechnicalAssistanceGeographicalFocus,
    {
      refetchOnWindowFocus: false,
      enabled: !!technicalAssistanceId,
    }
  );

  let reportingPeriodData = monthsData;

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      implementationYear: Yup.string().required("Required"),
      reportingPeriod: Yup.string().required("Required"),
      location: Yup.string().required("Required"),
      technicalAssistance: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        navigate(
          `/project-access/monitoring/technicalassistance-results/${processLevelItemId}/${processLevelTypeId}/${values.technicalAssistance}/${values.location}/${values.reportingPeriod}/${values.implementationYear}`
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

  const handleTechnicalAssistanceChange = (e) => {
    const technicalAssistanceId = e.target.value;
    setTechnicalAssistanceId(technicalAssistanceId);
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
                name="technicalAssistance"
                label="Technial Assistance"
                select
                required
                value={formik.values.technicalAssistance}
                error={Boolean(
                  formik.touched.technicalAssistance &&
                    formik.errors.technicalAssistance
                )}
                fullWidth
                helperText={
                  formik.touched.technicalAssistance &&
                  formik.errors.technicalAssistance
                }
                onBlur={formik.handleBlur}
                onChange={(e) => {
                  formik.handleChange(e);
                  handleTechnicalAssistanceChange(e);
                }}
                variant="outlined"
                my={2}
              >
                <MenuItem disabled value="">
                  Select Technical Assistance
                </MenuItem>
                {!isLoadingTechnicalAssistances && !isErrorTechnicalAssistances
                  ? technicalAssistances.data.map((option) => (
                      <MenuItem key={option.title} value={option.id}>
                        {option.title}
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
                {!isLoadingTechnicalAssistanceLocations &&
                !isErrorTechnicalAssistanceLocations
                  ? technicalAssistanceLocations.data.map((option) => (
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

const TechnicalAssistanceMonitoring = () => {
  let { id, processLevelTypeId } = useParams();
  return (
    <React.Fragment>
      <Helmet title="TechnicalAssistance Monitoring" />
      <Typography variant="h5" gutterBottom display="inline">
        Technical Assistance Monitoring
      </Typography>
      <Divider my={3} />
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <TechnicalAssistanceMonitoringForm
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

export default TechnicalAssistanceMonitoring;
