import React, { useContext, useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Grid,
  MenuItem,
  Paper,
  Table,
  TableCell,
  TableRow,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { green, purple } from "@mui/material/colors";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { getAllThematicAreas } from "../../../api/thematic-area";
import { getIndicatorThematicAreas } from "../../../api/indicator-thematic-area";
import { getLookupMasterItemsByName } from "../../../api/lookup";
import { getCountryIndicatorReport } from "../../../api/internal-reporting";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";

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

const CountryIndicatorReport = () => {
  const [selectedThemeId, setSelectedThemeId] = useState();
  const [indicatorId, setIndicatorId] = useState();
  const [yearId, setYearId] = useState();

  const { data, isLoading, isError } = useQuery(
    ["getAllThematicAreas"],
    getAllThematicAreas,
    {
      refetchOnWindowFocus: false,
    }
  );

  const {
    isLoading: isLoadingIndicatorThematicAreas,
    isError: isErrorIndicatorThematicAreas,
    data: IndicatorThematicAreasData,
  } = useQuery(
    ["getIndicatorThematicAreas", selectedThemeId],
    getIndicatorThematicAreas,
    {
      enabled: !!selectedThemeId,
    }
  );

  const {
    data: implementationYears,
    isLoading: isLoadingImplementationYears,
    isError: isErrorImplementationYears,
  } = useQuery(
    ["ImplementationYear", "ImplementationYear"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const {
    isLoading: isLoadingCountryIndicatorReport,
    isError: isErrorCountryIndicatorReport,
    data: CountryIndicatorReportData,
  } = useQuery(
    ["getCountryIndicatorReport", indicatorId, yearId],
    getCountryIndicatorReport,
    {
      enabled: !!indicatorId && !!yearId,
    }
  );

  const formik = useFormik({
    initialValues: { implementationYear: "", themeId: "", indicatorId: "" },
    validationSchema: Yup.object().shape({
      themeId: Yup.string().required("Required"),
      indicatorId: Yup.string().required("Required"),
      implementationYear: Yup.object().required("Required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setIndicatorId(values.indicatorId);
        setYearId(values.implementationYear.lookupItemId);
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  useEffect(() => {
    if (
      !isLoadingIndicatorThematicAreas &&
      !isErrorIndicatorThematicAreas &&
      IndicatorThematicAreasData
    ) {
    }
  }, [
    isLoadingIndicatorThematicAreas,
    isErrorIndicatorThematicAreas,
    IndicatorThematicAreasData,
  ]);

  return (
    <React.Fragment>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom display="inline">
            Country Indicator report Annual
          </Typography>

          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={6}>
              <Grid item md={3}>
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
                  {!isLoadingImplementationYears && !isErrorImplementationYears
                    ? implementationYears.data.map((option) => (
                        <MenuItem key={option.lookupItemId} value={option}>
                          {option.lookupItemName}
                        </MenuItem>
                      ))
                    : []}
                </TextField>
              </Grid>
              <Grid item md={3}>
                <TextField
                  name="themeId"
                  label="Theme"
                  select
                  value={formik.values.themeId}
                  error={Boolean(
                    formik.touched.themeId && formik.errors.themeId
                  )}
                  fullWidth
                  helperText={formik.touched.themeId && formik.errors.themeId}
                  onBlur={formik.handleBlur}
                  onChange={(e) => {
                    formik.handleChange(e);
                    setSelectedThemeId(e.target.value);
                  }}
                  variant="outlined"
                  my={2}
                >
                  <MenuItem disabled value="">
                    Select Theme
                  </MenuItem>
                  {!isLoading && !isError
                    ? data.data.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))
                    : []}
                </TextField>
              </Grid>
              <Grid item md={3}>
                <TextField
                  name="indicatorId"
                  label="Indicator"
                  select
                  value={formik.values.indicatorId}
                  error={Boolean(
                    formik.touched.indicatorId && formik.errors.indicatorId
                  )}
                  fullWidth
                  helperText={
                    formik.touched.indicatorId && formik.errors.indicatorId
                  }
                  onBlur={formik.handleBlur}
                  onChange={(e) => {
                    formik.handleChange(e);
                  }}
                  variant="outlined"
                  my={2}
                >
                  <MenuItem disabled value="">
                    Select indicator
                  </MenuItem>
                  {!isLoadingIndicatorThematicAreas &&
                  !isErrorIndicatorThematicAreas
                    ? IndicatorThematicAreasData.data.map((option) => (
                        <MenuItem
                          key={option.indicatorId}
                          value={option.indicatorId}
                        >
                          {option.indicator.code}:{option.indicator.name}
                        </MenuItem>
                      ))
                    : []}
                </TextField>
              </Grid>
              <Grid item md={3}>
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

          <TableContainer component={Paper}>
            <Table size="small" aria-label="grouped table">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      border: "1px solid #000",
                      textAlign: "center",
                    }}
                  >
                    Project
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #000",
                      textAlign: "center",
                    }}
                  >
                    Achieved
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #000",
                      textAlign: "center",
                    }}
                  >
                    Target
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      border: "1px solid #000",
                      textAlign: "center",
                    }}
                  >
                    Percentage
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      border: "1px solid #000",
                      textAlign: "center",
                    }}
                  >
                    Children Female
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      border: "1px solid #000",
                      textAlign: "center",
                    }}
                  >
                    Children Male
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      border: "1px solid #000",
                      textAlign: "center",
                    }}
                  >
                    Youth Female
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      border: "1px solid #000",
                      textAlign: "center",
                    }}
                  >
                    Youth Male
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      border: "1px solid #000",
                      textAlign: "center",
                    }}
                  >
                    Adults Female
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      border: "1px solid #000",
                      textAlign: "center",
                    }}
                  >
                    Youth Male
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      border: "1px solid #000",
                      textAlign: "center",
                    }}
                  >
                    Explanation
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!isLoadingCountryIndicatorReport &&
                !isErrorCountryIndicatorReport ? (
                  CountryIndicatorReportData.data.map((data, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell
                          sx={{
                            border: "1px solid #000",
                            textAlign: "center",
                          }}
                        >
                          {data.shortTitle}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #000",
                            textAlign: "center",
                          }}
                        >
                          {data.achieved}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #000",
                            textAlign: "center",
                          }}
                        >
                          {data.target}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #000",
                            textAlign: "center",
                          }}
                        >
                          {data.percentage * 100}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #000",
                            textAlign: "center",
                          }}
                        >
                          {data.children_Female}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #000",
                            textAlign: "center",
                          }}
                        >
                          {data.children_Male}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #000",
                            textAlign: "center",
                          }}
                        >
                          {data.youths_Female}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #000",
                            textAlign: "center",
                          }}
                        >
                          {data.youths_Male}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #000",
                            textAlign: "center",
                          }}
                        >
                          {data.adults_Female}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #000",
                            textAlign: "center",
                          }}
                        >
                          {data.adults_Male}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "1px solid #000",
                            textAlign: "center",
                          }}
                        ></TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <React.Fragment></React.Fragment>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};
export default CountryIndicatorReport;
