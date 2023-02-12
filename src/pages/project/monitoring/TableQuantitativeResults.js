import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
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
  Paper as MuiPaper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import styled from "@emotion/styled";
import { NavLink, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getLookupItemByAlias,
  getLookupMasterItemsByName,
  lookupItem,
} from "../../../api/lookup";
import { getProjectTargets } from "../../../api/set-target";
import { getProjectResults } from "../../../api/achieved-result";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getProjectLocation, getProjectLocations } from "../../../api/location";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Paper = styled(MuiPaper)(spacing);

const initialValues = {
  location: "",
  implementationYear: "",
};

const TableRowReturned = ({
  yearMonth,
  projectTargets,
  year,
  processLevelItemId,
}) => {
  let hasTargets = false;
  let hasResults = false;
  let monthId;
  const { data, isLoading, isError } = useQuery(
    ["getLookupItemByAlias", yearMonth.month],
    getLookupItemByAlias,
    { enabled: !!yearMonth.month }
  );

  if (!isLoading && !isError) {
    monthId = data.data.id;
    const filterProjectTargets = projectTargets.filter(
      (obj) => obj.implementationYearId === year && obj.monthId === data.data.id
    );
    if (filterProjectTargets.length > 0) {
      hasTargets = true;
    } else {
      hasTargets = false;
    }
  }
  const {
    data: projectResults,
    isLoading: isLoadingProjectResults,
    isError: isErrorProjectResults,
  } = useQuery(
    ["getProjectResults", processLevelItemId, year, monthId],
    getProjectResults,
    { enabled: !!processLevelItemId && !!year && !!monthId }
  );
  if (!isLoadingProjectResults && !isErrorProjectResults) {
    if (projectResults.data.length > 0) {
      hasResults = true;
    } else {
      hasResults = false;
    }
  }
  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell align="center">{yearMonth.yearMonth}</TableCell>
      {hasTargets ? (
        <TableCell sx={{ bgcolor: "green" }} align="center">
          Yes
        </TableCell>
      ) : (
        <TableCell sx={{ bgcolor: "gray" }} align="center">
          No
        </TableCell>
      )}
      {hasResults ? (
        <TableCell sx={{ bgcolor: "green" }} align="center">
          Yes
        </TableCell>
      ) : (
        <TableCell sx={{ bgcolor: "#ed6c02" }} align="center">
          No
        </TableCell>
      )}
      {hasResults ? (
        <TableCell align="center">
          <NavLink to={``}>Edit Actual</NavLink>
        </TableCell>
      ) : (
        <TableCell align="center">
          <NavLink to={``}>Create Actual</NavLink>
        </TableCell>
      )}
    </TableRow>
  );
};

const TableQuantitativeResultsGrid = () => {
  let { processLevelItemId, processLevelTypeId, projectLocationId, year } =
    useParams();
  const [implementingYear, setImplementingYear] = useState(year);
  const {
    data: projectTargets,
    isLoading: isLoadingProjectTargets,
    isError: isErrorProjectTargets,
  } = useQuery(
    ["getProjectTargets", implementingYear, projectLocationId],
    getProjectTargets,
    { enabled: !!implementingYear && !!projectLocationId }
  );
  const today = new Date();
  const currentYear = today.getUTCFullYear();
  const yearMonths = [];
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
  const monthsArray = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  if (fYear < currentYear) {
    for (const month of monthsArray) {
      yearMonths.push({
        yearMonth: fYear + " " + month,
        year: fYear,
        month,
        implementingYear: year,
      });
    }
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

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      location: Yup.string().required("Required"),
      implementationYear: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      setImplementingYear(values.implementationYear);
    },
  });

  useEffect(() => {
    formik.setFieldValue("location", projectLocationId);
    formik.setFieldValue("implementationYear", implementingYear);
  }, [projectLocationId, implementingYear]);

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
                <Grid container spacing={6}>
                  <Grid item md={4}>
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
                  <Grid item md={4}>
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
                  <Grid item md={4}>
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
        <TableContainer component={Paper}>
          <Table aria-label="targets-table">
            <TableHead>
              <TableRow>
                <TableCell align="center">MONTH</TableCell>
                <TableCell align="center">HAS TARGETS</TableCell>
                <TableCell align="center">DATA PRESENCE</TableCell>
                <TableCell align="center">ENTER DATA</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {yearMonths.map((yearMonth) => (
                <React.Fragment key={Math.random().toString(36)}>
                  {!isLoadingProjectTargets && !isErrorProjectTargets ? (
                    <TableRowReturned
                      yearMonth={yearMonth}
                      projectTargets={projectTargets.data}
                      year={implementingYear}
                      processLevelItemId={processLevelItemId}
                    />
                  ) : (
                    ""
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </React.Fragment>
  );
};
const TableQuantitativeResults = () => {
  let { processLevelItemId, processLevelTypeId } = useParams();

  return (
    <React.Fragment>
      <Helmet title="Reporting Period" />
      <Typography variant="h3" gutterBottom display="inline">
        Results Framework
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link
          component={NavLink}
          to={`/project/design-project/${processLevelItemId}/${processLevelTypeId}`}
        >
          Project Design
        </Link>
        <Typography>Project Quantitative Result Framework</Typography>
      </Breadcrumbs>
      <Divider my={6} />
      <TableQuantitativeResultsGrid />
    </React.Fragment>
  );
};
export default TableQuantitativeResults;
