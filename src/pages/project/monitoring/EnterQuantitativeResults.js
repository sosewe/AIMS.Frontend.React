import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import styled from "@emotion/styled";
import {
  AppBar,
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  CircularProgress,
  Divider as MuiDivider,
  Grid,
  Link,
  MenuItem,
  TextField as MuiTextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useQuery } from "@tanstack/react-query";
import { getLookupMasterItemsByName, lookupItem } from "../../../api/lookup";
import { getProjectLocation, getProjectLocations } from "../../../api/location";
import { getResultChainIndicatorByProjectId } from "../../../api/result-chain-indicator";
import EnterQuantitativeResultsForm from "./EnterQuantitativeResultsForm";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import QuantitativeResultsView from "./EnterQuantitativeResults/QuantitativeResultsView";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);
const TextField = styled(MuiTextField)(spacing);

const initialValues = {
  location: "",
  implementationYear: "",
  monthId: "",
};

const EnterQuantitativeResultsFormContainer = ({
  processLevelItemId,
  processLevelTypeId,
  projectLocationId,
  monthId,
  year,
}) => {
  const [implementingYear, setImplementingYear] = useState(year);
  const [implementingMonth, setImplementingMonth] = useState(monthId);
  let fYear;
  const {
    data: resultYear,
    isLoading,
    isError,
  } = useQuery(["lookupItem", implementingYear], lookupItem, {
    enabled: !!implementingYear,
  });
  if (!isLoading && !isError) {
    fYear = Number(resultYear.data.name);
  }
  const {
    data: projectLocation,
    isLoading: isLoadingProjectLocation,
    isError: isErrorProjectLocation,
  } = useQuery(["getProjectLocation", projectLocationId], getProjectLocation, {
    enabled: !!projectLocationId,
  });
  const {
    data: projectLocations,
    isLoading: isLoadingProjectLocations,
    isError: isErrorProjectLocations,
  } = useQuery(
    ["getProjectLocations", processLevelItemId],
    getProjectLocations,
    { enabled: !!processLevelItemId }
  );
  const {
    data: implementingYears,
    isLoading: isLoadingImplementingYears,
    isError: isErrorImplementingYears,
  } = useQuery(
    ["ImplementationYear", "ImplementationYear"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );
  const {
    data: lookupMonths,
    isLoading: isLoadingLookupMonths,
    isError: isErrorLookupMonths,
  } = useQuery(["Months", "Months"], getLookupMasterItemsByName, {
    refetchOnWindowFocus: false,
  });
  const {
    data: resultChainIndicators,
    isLoading: isLoadingResultChainIndicators,
    isError: isErrorResultChainIndicators,
  } = useQuery(
    ["getResultChainIndicatorByProjectId", processLevelItemId],
    getResultChainIndicatorByProjectId,
    { enabled: !!processLevelItemId }
  );
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      location: Yup.string().required("Required"),
      implementationYear: Yup.string().required("Required"),
      monthId: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      setImplementingYear(values.implementationYear);
      setImplementingMonth(values.monthId);
    },
  });

  useEffect(() => {
    formik.setFieldValue("location", projectLocationId);
    formik.setFieldValue("implementationYear", implementingYear);
    formik.setFieldValue("monthId", implementingMonth);
  }, [projectLocationId, implementingYear, implementingMonth]);

  return (
    <React.Fragment>
      <form onSubmit={formik.handleSubmit}>
        <Card mb={6}>
          <CardContent>
            {formik.isSubmitting ? (
              <Box display="flex" justifyContent="center" my={6}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Grid container spacing={12}>
                  <Grid item md={12}>
                    <Typography variant="h3" gutterBottom display="inline">
                      Reporting Period for {fYear} in &nbsp;
                      {!isLoadingProjectLocation && !isErrorProjectLocation
                        ? projectLocation.data.administrativeUnitName
                        : ""}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item md={3}>
                    <TextField
                      name="location"
                      label="Location"
                      select
                      value={formik.values.location}
                      error={Boolean(
                        formik.touched.location && formik.errors.location
                      )}
                      fullWidth
                      helperText={
                        formik.touched.location && formik.errors.location
                      }
                      onBlur={formik.handleBlur}
                      onChange={(e) => {
                        formik.handleChange(e);
                      }}
                      variant="outlined"
                      my={2}
                      disabled={true}
                      sx={{
                        "& .MuiInputBase-input.Mui-disabled": {
                          backgroundColor: "#e9ecef",
                        },
                      }}
                    >
                      <MenuItem disabled value="">
                        Select Location
                      </MenuItem>
                      {!isLoadingProjectLocations && !isErrorProjectLocations
                        ? projectLocations.data.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              {option.administrativeUnitName}
                            </MenuItem>
                          ))
                        : []}
                    </TextField>
                  </Grid>
                  <Grid item md={3}>
                    <TextField
                      name="implementationYear"
                      label="Implementing Years"
                      select
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
                        Select Implementing Years
                      </MenuItem>
                      {!isLoadingImplementingYears && !isErrorImplementingYears
                        ? implementingYears.data.map((option) => (
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
                      name="monthId"
                      label="Month"
                      select
                      value={formik.values.monthId}
                      error={Boolean(
                        formik.touched.monthId && formik.errors.monthId
                      )}
                      fullWidth
                      helperText={
                        formik.touched.monthId && formik.errors.monthId
                      }
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      variant="outlined"
                      my={2}
                    >
                      <MenuItem disabled value="">
                        Select Month
                      </MenuItem>
                      {!isLoadingLookupMonths && !isErrorLookupMonths
                        ? lookupMonths.data.map((option) => (
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
                    <Button
                      type="submit"
                      variant="contained"
                      mt={3}
                      sx={{ bgcolor: "gray" }}
                    >
                      Change Reporting Year
                    </Button>
                  </Grid>
                </Grid>
              </>
            )}
          </CardContent>
        </Card>
      </form>
      <Card mb={6}>
        <CardContent>
          <Grid
            container
            direction="row"
            justifyContent="left"
            alignItems="left"
            spacing={6}
          >
            <Grid item md={1}>
              #
            </Grid>
            <Grid item md={11}>
              &nbsp;
            </Grid>
            <Grid item md={12}>
              {!isLoadingResultChainIndicators &&
              !isErrorResultChainIndicators ? (
                <QuantitativeResultsView
                  resultChainIndicators={resultChainIndicators.data}
                  processLevelItemId={processLevelItemId}
                  processLevelTypeId={processLevelTypeId}
                  projectLocationId={projectLocationId}
                  monthId={implementingMonth}
                  year={implementingYear}
                />
              ) : (
                ""
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

const EnterQuantitativeResults = () => {
  let {
    processLevelItemId,
    processLevelTypeId,
    projectLocationId,
    monthId,
    year,
  } = useParams();
  const navigate = useNavigate();
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });
  return (
    <React.Fragment>
      <Helmet title="Enter Data" />
      <ThemeProvider theme={darkTheme}>
        <AppBar position="static" color="secondary">
          <Toolbar>
            <Button
              color={"inherit"}
              onClick={() => navigate("/")}
              style={{ marginRight: "16px" }}
            >
              <HomeOutlinedIcon />
            </Button>

            <Button
              color={"primary"}
              onClick={() =>
                navigate(
                  `/project-access/${processLevelItemId}/${processLevelTypeId}`
                )
              }
            >
              Design
            </Button>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
      <Box my={6}>
        <Typography variant="h3" gutterBottom display="inline">
          Results Framework
        </Typography>
        <Breadcrumbs aria-label="Breadcrumb" mt={2}>
          <Link
            component={NavLink}
            to={`/project-access/${processLevelItemId}/${processLevelTypeId}`}
          >
            Project Detail
          </Link>
          <Link
            component={NavLink}
            to={`/project-access/monitoring/table-quantitative-results/${processLevelItemId}/${processLevelTypeId}/${projectLocationId}/${year}`}
          >
            Reporting Period
          </Link>
          <Typography>Enter Data</Typography>
        </Breadcrumbs>
        <Divider my={6} />
        <EnterQuantitativeResultsFormContainer
          processLevelItemId={processLevelItemId}
          processLevelTypeId={processLevelTypeId}
          projectLocationId={projectLocationId}
          monthId={monthId}
          year={year}
        />
      </Box>
    </React.Fragment>
  );
};
export default EnterQuantitativeResults;
