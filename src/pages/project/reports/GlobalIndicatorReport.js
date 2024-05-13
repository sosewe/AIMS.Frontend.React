import React, { useContext, useEffect, useState } from "react";
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Grid,
  MenuItem,
  Paper,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useFormik } from "formik";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getLookupMasterItemsByName } from "../../../api/lookup";
import { green, purple } from "@mui/material/colors";
import * as Yup from "yup";
import { toast } from "react-toastify";
import TableContainer from "@mui/material/TableContainer";
import TableBody from "@mui/material/TableBody";
import DownloadingOutlinedIcon from "@mui/icons-material/DownloadingOutlined";
import { useForm } from "react-hook-form";
import Papa from "papaparse";
import { getAllThematicAreas } from "../../../api/thematic-area";
import { getIndicatorThematicAreas } from "../../../api/indicator-thematic-area";
import {
  getCountryIndicatorReport,
  getGlobalIndicatorReport,
} from "../../../api/internal-reporting";
import ProjectNarrative from "./ProjectNarrative";

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

const GlobalIndicatorReport = () => {
  const [selectedThemeId, setSelectedThemeId] = useState();
  const [indicatorId, setIndicatorId] = useState();
  const [yearId, setYearId] = useState();
  const [sumAchieved, setSumAchieved] = useState();
  const [sumTarget, setSumTarget] = useState();
  const [sumPercentage, setSumPercentage] = useState();
  const [sumChildrenFemale, setSumChildrenFemale] = useState();
  const [sumChildrenMale, setSumChildrenMale] = useState();
  const [sumYouthFemale, setSumYouthFemale] = useState();
  const [sumYouthMale, setSumYouthMale] = useState();
  const [sumAdultFemale, setSumAdultsFemale] = useState();
  const [sumAdultMale, setSumAdultsMale] = useState();

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
    isLoading: isLoadingGlobalIndicatorReport,
    isError: isErrorGlobalIndicatorReport,
    data: GlobalIndicatorReportData,
  } = useQuery(
    ["getGlobalIndicatorReport", indicatorId, yearId],
    getGlobalIndicatorReport,
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
      !isLoadingGlobalIndicatorReport &&
      !isErrorGlobalIndicatorReport &&
      GlobalIndicatorReportData
    ) {
      let achieved = 0;
      let target = 0;
      let percentage = 0;
      let children_Female = 0;
      let children_Male = 0;
      let youths_Female = 0;
      let youths_Male = 0;
      let adults_Female = 0;
      let adults_Male = 0;
      let count = 0;
      for (const countryIndicatorReport of GlobalIndicatorReportData.data) {
        achieved += countryIndicatorReport.achieved;
        target += countryIndicatorReport.target;
        percentage += countryIndicatorReport.percentage;
        children_Female += countryIndicatorReport.children_Female;
        children_Male += countryIndicatorReport.children_Male;
        youths_Female += countryIndicatorReport.youths_Female;
        youths_Male += countryIndicatorReport.youths_Male;
        adults_Female += countryIndicatorReport.adults_Female;
        adults_Male += countryIndicatorReport.adults_Male;
        count++;
      }
      setSumAchieved(achieved);
      setSumTarget(target);
      setSumChildrenFemale(children_Female);
      setSumChildrenMale(children_Male);
      setSumYouthFemale(youths_Female);
      setSumYouthMale(youths_Male);
      setSumAdultsFemale(adults_Female);
      setSumAdultsMale(adults_Male);
      setSumPercentage(percentage / count);
    }
  }, [
    isLoadingGlobalIndicatorReport,
    isErrorGlobalIndicatorReport,
    GlobalIndicatorReportData,
  ]);

  function handleDownload() {
    const csv = Papa.unparse(GlobalIndicatorReportData.data, {
      header: true,
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <React.Fragment>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom display="inline">
            Corporate Performance Report YTD
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
                    AMREF Office
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
                {!isLoadingGlobalIndicatorReport &&
                !isErrorGlobalIndicatorReport ? (
                  GlobalIndicatorReportData.data.map((data, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell
                          sx={{
                            border: "1px solid #000",
                            textAlign: "center",
                          }}
                        >
                          {data.name}
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
                          {data.percentage * 100}%
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
                        >
                          {/*<ProjectNarrative*/}
                          {/*  processLevelItemId={data.processLevelItemId}*/}
                          {/*  implementationYearId={yearId}*/}
                          {/*  // implementationMonthId={monthId}*/}
                          {/*/>*/}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <React.Fragment></React.Fragment>
                )}
                <TableRow>
                  <TableCell
                    sx={{
                      border: "1px solid #000",
                      textAlign: "center",
                    }}
                  >
                    TOTAL
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #000",
                      textAlign: "center",
                    }}
                  >
                    {sumAchieved}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #000",
                      textAlign: "center",
                    }}
                  >
                    {sumTarget}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #000",
                      textAlign: "center",
                    }}
                  >
                    {sumPercentage * 100}%
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #000",
                      textAlign: "center",
                    }}
                  >
                    {sumChildrenFemale}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #000",
                      textAlign: "center",
                    }}
                  >
                    {sumChildrenMale}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #000",
                      textAlign: "center",
                    }}
                  >
                    {sumYouthFemale}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #000",
                      textAlign: "center",
                    }}
                  >
                    {sumYouthMale}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #000",
                      textAlign: "center",
                    }}
                  >
                    {sumAdultFemale}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #000",
                      textAlign: "center",
                    }}
                  >
                    {sumAdultMale}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #000",
                      textAlign: "center",
                    }}
                  >
                    &nbsp;
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell
                    sx={{
                      border: "1px solid #000",
                      textAlign: "center",
                    }}
                    colSpan={12}
                  >
                    <ThemeProvider theme={theme}>
                      <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        mt={2}
                        onClick={() => handleDownload()}
                      >
                        <DownloadingOutlinedIcon />
                        &nbsp;DownLoad
                      </Button>
                    </ThemeProvider>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};
export default GlobalIndicatorReport;
