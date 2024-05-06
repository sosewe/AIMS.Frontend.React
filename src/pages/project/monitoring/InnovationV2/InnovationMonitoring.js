import React, { useEffect, useState, useCallback, useContext } from "react";
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
import { getInnovationByProcessLevelItemId } from "../../../../api/innovation";
import { getInnovationGeographicalFocus } from "../../../../api/innovation-geographical-focus";
import { getInnovationObjectiveClassificationByInnovationId } from "../../../../api/innovation-objectivesclassification";
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
  innovation: "",
};

const InnovationMonitoringForm = ({
  processLevelItemId,
  processLevelTypeId,
}) => {
  const [innovationId, setInnovationId] = useState();
  const navigate = useNavigate();
  const userLevelContext = useContext(UserLevelContext);
  const {
    data: innovations,
    isLoading: isLoadingInnovations,
    isError: isErrorInnovations,
  } = useQuery(
    ["getInnovationByProcessLevelItemId", processLevelItemId],
    getInnovationByProcessLevelItemId,
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
    data: innovationLocations,
    isLoading: isLoadinginnovationLocations,
    isError: isErrorinnovationLocations,
  } = useQuery(
    ["getInnovationGeographicalFocus", innovationId],
    getInnovationGeographicalFocus,
    {
      refetchOnWindowFocus: false,
      enabled: !!innovationId,
    }
  );

  const {
    data: innovationObjectivesClassificationData,
    isLoading: isLoadingObjectivesClassification,
    isError: isErrorObjectivesClassification,
  } = useQuery(
    ["getInnovationObjectiveClassificationByInnovationId", innovationId],
    getInnovationObjectiveClassificationByInnovationId,
    {
      enabled: !!innovationId,
    }
  );

  let reportingPeriodData;
  let reportingFrequencyId;
  if (
    !isLoadingObjectivesClassification &&
    !isErrorObjectivesClassification &&
    innovationObjectivesClassificationData &&
    innovationObjectivesClassificationData.data
  ) {
    reportingFrequencyId =
      innovationObjectivesClassificationData.data.reportingFrequencyId;
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
      innovation: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        navigate(
          `/project-access/monitoring/innovation-results/${processLevelItemId}/${processLevelTypeId}/${values.innovation}/${values.location}/${values.reportingPeriod}/${values.implementationYear}`
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

  const handleInnovationChange = (e) => {
    const innovationId = e.target.value;
    setInnovationId(innovationId);
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
                name="innovation"
                label="Innovation"
                select
                required
                value={formik.values.innovation}
                error={Boolean(
                  formik.touched.innovation && formik.errors.innovation
                )}
                fullWidth
                helperText={
                  formik.touched.innovation && formik.errors.innovation
                }
                onBlur={formik.handleBlur}
                onChange={(e) => {
                  formik.handleChange(e);
                  handleInnovationChange(e);
                }}
                variant="outlined"
                my={2}
              >
                <MenuItem disabled value="">
                  Select Innovation
                </MenuItem>
                {!isLoadingInnovations && !isErrorInnovations
                  ? innovations.data.map((option) => (
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
                {!isLoadinginnovationLocations && !isErrorinnovationLocations
                  ? innovationLocations.data.map((option) => (
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
                {!isLoadingObjectivesClassification &&
                !isLoadingYears &&
                !isLoadingQuarters &&
                !isLoadingMonths &&
                reportingPeriodData
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

const InnovationMonitoring = () => {
  let { id, processLevelTypeId } = useParams();
  return (
    <React.Fragment>
      <Helmet title="Innovation Monitoring" />
      <Typography variant="h5" gutterBottom display="inline">
        Innovation Monitoring
      </Typography>
      <Divider my={3} />
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <InnovationMonitoringForm
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

export default InnovationMonitoring;
