import React, { useEffect, useState, useContext } from "react";
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

import { getAdvocacyByProcessLevelItemId } from "../../../../api/advocacy";
import { getAdvocacyGeographicalFocus } from "../../../../api/advocacy-geographical-focus";
import { getAdvocacyObjectiveByAdvocacyId } from "../../../../api/advocacy-objective";

import { getLookupMasterItemsByName } from "../../../../api/lookup";
import { UserLevelContext } from "../../../../App";
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
  advocacy: "",
};

const AdvocacyMonitoringForm = ({ processLevelItemId, processLevelTypeId }) => {
  const [advocacyId, setAdvocacyId] = useState();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const userLevelContext = useContext(UserLevelContext);

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
    data: advocacies,
    isLoading: isLoadingAdvocacies,
    isError: isErrorAdvocacies,
    error,
  } = useQuery(
    ["getAdvocacyByProcessLevelItemId", processLevelItemId],
    getAdvocacyByProcessLevelItemId,
    {
      enabled: !!processLevelItemId,
    }
  );

  const {
    data: advocacyLocations,
    isLoading: isLoadingAdvocacyLocations,
    isError: isErrorAdvocacyLocations,
  } = useQuery(
    ["getAdvocacyGeographicalFocus", advocacyId],
    getAdvocacyGeographicalFocus,
    {
      refetchOnWindowFocus: false,
      enabled: !!advocacyId,
    }
  );

  const {
    data: advocacyObjectives,
    isLoading: isLoadingAdvocacyObjectives,
    isError: isErrorAdvocacyObjectives,
  } = useQuery(
    ["getAdvocacyObjectiveByAdvocacyId", advocacyId],
    getAdvocacyObjectiveByAdvocacyId,
    {
      refetchOnWindowFocus: false,
      enabled: !!advocacyId,
    }
  );

  let reportingPeriodData;
  let reportingFrequencyId;
  if (
    !isLoadingAdvocacyObjectives &&
    !isErrorAdvocacyObjectives &&
    advocacyObjectives &&
    advocacyObjectives.data
  ) {
    reportingFrequencyId = advocacyObjectives.data[0].reportingFrequencyId;
    if (
      reportingFrequencyId.toLowerCase() ===
      REPORT_FREQUENCY.MONTHLY.toLowerCase()
    ) {
      reportingPeriodData = monthsData;
    } else if (
      reportingFrequencyId.toLowerCase() ===
      REPORT_FREQUENCY.ANNUALLY.toLowerCase()
    ) {
      reportingPeriodData = yearsData;
    } else if (
      reportingFrequencyId.toLowerCase() ===
      REPORT_FREQUENCY.QUARTERLY.toLowerCase()
    ) {
      reportingPeriodData = quartersData;
    }
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      implementationYear: Yup.string().required("Required"),
      reportingPeriod: Yup.string().required("Required"),
      location: Yup.string().required("Required"),
      advocacy: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        navigate(
          `/project-access/monitoring/advocacy-results/${processLevelItemId}/${processLevelTypeId}/${values.advocacy}/${values.location}/${values.reportingPeriod}/${values.implementationYear}`
        );
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  useEffect(() => {}, []);

  const handleAdvocacyChange = (e) => {
    const advocacyId = e.target.value;
    setAdvocacyId(advocacyId);
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
                name="advocacy"
                label="Advocacy"
                select
                required
                value={formik.values.advocacy}
                error={Boolean(
                  formik.touched.advocacy && formik.errors.advocacy
                )}
                fullWidth
                helperText={formik.touched.advocacy && formik.errors.advocacy}
                onBlur={formik.handleBlur}
                onChange={(e) => {
                  formik.handleChange(e);
                  handleAdvocacyChange(e);
                }}
                variant="outlined"
                my={2}
              >
                <MenuItem disabled value="">
                  Select Advocacy
                </MenuItem>
                {!isLoadingAdvocacies && !isErrorAdvocacies
                  ? advocacies.data.map((option) => (
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
                {!isLoadingAdvocacyLocations && !isErrorAdvocacyLocations
                  ? advocacyLocations.data.map((option) => (
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
                {!isLoadingAdvocacyObjectives &&
                !isLoadingYears &&
                !isLoadingQuarters &&
                !isLoadingMonths
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

const AdvocacyMonitoring = () => {
  let { id, processLevelTypeId } = useParams();
  console.log(id, processLevelTypeId);
  return (
    <React.Fragment>
      <Helmet title="TechnicalAssistance Monitoring" />
      <Typography variant="h5" gutterBottom display="inline">
        Advocacy Monitoring
      </Typography>
      <Divider my={3} />
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <AdvocacyMonitoringForm
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

export default AdvocacyMonitoring;
