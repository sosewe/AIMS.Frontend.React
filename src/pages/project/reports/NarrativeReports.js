import React, { useState } from "react";
import {
  Box,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  CircularProgress,
  Grid,
  MenuItem,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { green, purple } from "@mui/material/colors";
import * as Yup from "yup";
import { useQuery } from "@tanstack/react-query";
import { getLookupMasterItemsByName } from "../../../api/lookup";
import { getNarrativeReportsData } from "../../../api/internal-reporting";
import { toast } from "react-toastify";
import NarrativeReportsTable from "./NarrativeReportsTable";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

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

const NarrativeReports = ({ processLevelItemId }) => {
  const [implementationYear, setImplementationYear] = useState();
  const [implementationYearId, setImplementationYearId] = useState();
  const [implementationMonth, setImplementationMonth] = useState();
  const [implementationMonthId, setImplementationMonthId] = useState();
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

  const {
    data: lookupMonths,
    isLoading: isLoadingLookupMonths,
    isError: isErrorLookupMonths,
  } = useQuery(["Months", "Months"], getLookupMasterItemsByName, {
    refetchOnWindowFocus: false,
  });

  const {
    isError: isErrorNarrativeReports,
    isLoading: isLoadingNarrativeReports,
    data: NarrativeReportsResults,
  } = useQuery(
    [
      "getNarrativeReportsData",
      processLevelItemId,
      implementationYear,
      implementationMonth,
    ],
    getNarrativeReportsData,
    {
      enabled:
        !!processLevelItemId && !!implementationYear && !!implementationMonth,
      refetchOnWindowFocus: false,
    }
  );

  const formik = useFormik({
    initialValues: {
      implementationYear: "",
      month: "",
    },
    validationSchema: Yup.object().shape({
      implementationYear: Yup.object().required("Required"),
      month: Yup.object().required("Required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setImplementationMonth(values.month.lookupItemName);
        setImplementationYear(values.implementationYear.lookupItemName);
        setImplementationYearId(values.implementationYear.lookupItemId);
        setImplementationMonthId(values.month.lookupItemId);
      } catch (e) {
        toast(e, {
          type: "error",
        });
      }
    },
  });

  return (
    <React.Fragment>
      <Typography variant="h5" gutterBottom display="inline">
        Project Performance Report YTD
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Card mb={1}>
          <CardContent>
            {formik.isSubmitting ? (
              <Box display="flex" justifyContent="center" my={6}>
                <CircularProgress />
              </Box>
            ) : (
              <React.Fragment>
                <Grid container spacing={6}>
                  <Grid item md={4}>
                    <TextField
                      name="implementationYear"
                      label="Implementation Year"
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
                      onChange={(e) => {
                        formik.handleChange(e);
                        // setCanDownload(false);
                      }}
                      variant="outlined"
                      my={2}
                    >
                      <MenuItem disabled value="">
                        Select Implementation Year
                      </MenuItem>
                      {!isLoading && !isError
                        ? implementationYears.data.map((option) => (
                            <MenuItem key={option.lookupItemId} value={option}>
                              {option.lookupItemName}
                            </MenuItem>
                          ))
                        : []}
                    </TextField>
                  </Grid>
                  <Grid item md={4}>
                    <TextField
                      name="month"
                      label="Month"
                      select
                      value={formik.values.month}
                      error={Boolean(
                        formik.touched.month && formik.errors.month
                      )}
                      fullWidth
                      helperText={formik.touched.month && formik.errors.month}
                      onBlur={formik.handleBlur}
                      onChange={(e) => {
                        formik.handleChange(e);
                      }}
                      variant="outlined"
                      my={2}
                    >
                      <MenuItem disabled value="">
                        Select Month
                      </MenuItem>
                      {!isLoadingLookupMonths && !isErrorLookupMonths
                        ? lookupMonths.data.map((option) => (
                            <MenuItem key={option.lookupItemId} value={option}>
                              {option.lookupItemName}
                            </MenuItem>
                          ))
                        : []}
                    </TextField>
                  </Grid>
                  <Grid item md={4}>
                    <ThemeProvider theme={theme}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        mt={2}
                      >
                        SUBMIT
                      </Button>
                    </ThemeProvider>
                  </Grid>
                </Grid>
              </React.Fragment>
            )}
          </CardContent>
        </Card>
      </form>
      {!isLoadingNarrativeReports && !isErrorNarrativeReports ? (
        <Grid container spacing={1}>
          <Grid item md={12}>
            <Card mb={1}>
              <CardContent>
                <NarrativeReportsTable
                  NarrativeReportsResults={NarrativeReportsResults.data}
                  processLevelItemId={processLevelItemId}
                  implementationYearId={implementationYearId}
                  implementationMonthId={implementationMonthId}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <React.Fragment></React.Fragment>
      )}
    </React.Fragment>
  );
};
export default NarrativeReports;
