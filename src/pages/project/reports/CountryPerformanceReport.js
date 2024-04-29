import React, { useContext, useState } from "react";
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Grid,
  MenuItem,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { green, purple } from "@mui/material/colors";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { getLookupMasterItemsByName } from "../../../api/lookup";

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

const CountryPerformanceReport = () => {
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

  const formik = useFormik({
    initialValues: { implementationYear: "", month: "" },
    validationSchema: Yup.object().shape({
      implementationYear: Yup.object().required("Required"),
      month: Yup.object().required("Required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setImplementationYear(values.implementationYear.lookupItemName);
        setImplementationYearId(values.implementationYear.lookupItemId);
        setImplementationMonth(values.month.lookupItemName);
        setImplementationMonthId(values.month.lookupItemId);
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  return (
    <React.Fragment>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom display="inline">
            Country Performance Report YTD
          </Typography>

          <form onSubmit={formik.handleSubmit}>
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
                  error={Boolean(formik.touched.month && formik.errors.month)}
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
          </form>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};
export default CountryPerformanceReport;
