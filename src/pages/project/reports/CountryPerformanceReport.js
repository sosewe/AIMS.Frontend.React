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
import { green, purple } from "@mui/material/colors";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getLookupMasterItemsByName } from "../../../api/lookup";
import { OfficeContext } from "../../../App";
import {
  getAllCountryNarrativeReports,
  getCountryNarrativeReports,
  saveAddCountryNarrativeReport,
} from "../../../api/internal-reporting";
import TableContainer from "@mui/material/TableContainer";
import TableBody from "@mui/material/TableBody";
import { useForm } from "react-hook-form";
import DownloadingOutlinedIcon from "@mui/icons-material/DownloadingOutlined";
import Papa from "papaparse";

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
  const [sumServiceContactFrequency, setSumServiceContactFrequency] =
    useState(0);
  const [sumYTDPerf, setSumYTDPerf] = useState(0);
  const [sumAnnualPerf, setSumAnnualPerf] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const officeContext = useContext(OfficeContext);
  let selectedOffice = officeContext.selectedOffice;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

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
    isLoading: isLoadingCountryNarrativeReports,
    isError: isErrorCountryNarrativeReports,
    data: CountryNarrativeReportsData,
  } = useQuery(
    [
      "getCountryNarrativeReports",
      selectedOffice,
      implementationYearId,
      implementationMonthId,
    ],
    getCountryNarrativeReports,
    {
      enabled:
        !!selectedOffice && !!implementationYearId && !!implementationMonthId,
    }
  );

  const {
    isError: isErrorAllCountryNarrative,
    isLoading: isLoadingAllCountryNarrative,
    data: AllCountryNarrative,
  } = useQuery(
    [
      "getAllCountryNarrativeReports",
      implementationYearId,
      implementationMonthId,
      selectedOffice,
    ],
    getAllCountryNarrativeReports,
    {
      enabled:
        !!selectedOffice && !!implementationYearId && !!implementationMonthId,
    }
  );

  const mutation = useMutation({ mutationFn: saveAddCountryNarrativeReport });
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

  useEffect(() => {
    if (
      !isLoadingCountryNarrativeReports &&
      !isErrorCountryNarrativeReports &&
      CountryNarrativeReportsData
    ) {
      let serviceContactFrequency = 0;
      let ytdPerf = 0;
      let annualPerf = 0;
      let count = 0;
      for (const countryNarrativeDatum of CountryNarrativeReportsData.data) {
        serviceContactFrequency +=
          countryNarrativeDatum.serviceContractFrequency;
        ytdPerf += countryNarrativeDatum.ytdPerf;
        annualPerf += countryNarrativeDatum.annualPerf;
        count++;
      }
      setSumServiceContactFrequency(serviceContactFrequency);
      setSumYTDPerf(ytdPerf / count);
      setSumAnnualPerf(annualPerf / count);
    }

    if (
      !isErrorAllCountryNarrative &&
      !isLoadingAllCountryNarrative &&
      AllCountryNarrative
    ) {
      if (AllCountryNarrative.data.length > 0) {
        setValue(
          "overallCountryComments",
          AllCountryNarrative.data[0].overallCountryComments
        );
        for (const countryNarrativeReportData of AllCountryNarrative.data[0]
          .countryNarrativeReportDatas) {
          setValue(
            countryNarrativeReportData.processLevelItemId,
            countryNarrativeReportData.comments
          );
        }
        setIsSaved(true);
      }
    }
  }, [
    isLoadingCountryNarrativeReports,
    isErrorCountryNarrativeReports,
    CountryNarrativeReportsData,
    isErrorAllCountryNarrative,
    isLoadingAllCountryNarrative,
    AllCountryNarrative,
  ]);

  const onSubmit = async (data) => {
    try {
      const InData = {
        implementingYearId: implementationYearId,
        implementationMonthId: implementationMonthId,
        selectedOffice: selectedOffice,
        overallCountryComments: data.overallCountryComments,
        serviceContactFrequency: sumServiceContactFrequency,
        ytdPerf: sumYTDPerf,
        annualPerf: sumAnnualPerf,
        CountryNarrativeReportDatas: [],
      };
      const entries = Object.entries(data);
      for (const entry of entries) {
        if (entry[0] !== "overallCountryComments") {
          InData.CountryNarrativeReportDatas.push({
            processLevelItemId: entry[0],
            comments: entry[1],
          });
        }
      }
      await mutation.mutateAsync(InData);
      toast("Successfully Created Country Performance Report", {
        type: "success",
      });
      setIsSaved(true);
    } catch (error) {
      toast(error.response.data, {
        type: "error",
      });
    }
  };

  function handleDownload() {
    const csv = Papa.unparse(CountryNarrativeReportsData.data, {
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
          {!isLoadingCountryNarrativeReports &&
          !isErrorCountryNarrativeReports ? (
            <Grid container spacing={6}>
              <Grid item md={12}>
                {CountryNarrativeReportsData.data.length > 0 && (
                  <form onSubmit={handleSubmit(onSubmit)}>
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
                              Service Contact Frequency
                            </TableCell>
                            <TableCell
                              sx={{
                                border: "1px solid #000",
                                textAlign: "center",
                              }}
                            >
                              YTD Perf
                            </TableCell>
                            <TableCell
                              sx={{
                                border: "1px solid #000",
                                textAlign: "center",
                              }}
                            >
                              Annual Perf
                            </TableCell>
                            <TableCell
                              sx={{
                                border: "1px solid #000",
                                textAlign: "center",
                              }}
                            >
                              Project Narrative Explanation
                            </TableCell>
                            <TableCell
                              sx={{
                                border: "1px solid #000",
                                textAlign: "center",
                              }}
                            >
                              Comments From CO
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {CountryNarrativeReportsData.data.map(
                            (countryNarrativeReport, index) => (
                              <TableRow key={index}>
                                <TableCell
                                  sx={{
                                    border: "1px solid #000",
                                    textAlign: "center",
                                  }}
                                >
                                  {countryNarrativeReport.projectName}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "1px solid #000",
                                    textAlign: "center",
                                  }}
                                >
                                  {
                                    countryNarrativeReport.serviceContractFrequency
                                  }
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "1px solid #000",
                                    textAlign: "center",
                                  }}
                                >
                                  {countryNarrativeReport.ytdPerf * 100}%
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "1px solid #000",
                                    textAlign: "center",
                                  }}
                                >
                                  {countryNarrativeReport.annualPerf * 100}%
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "1px solid #000",
                                    textAlign: "center",
                                  }}
                                >
                                  {
                                    countryNarrativeReport.overallProjectComments
                                  }
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "1px solid #000",
                                    textAlign: "center",
                                  }}
                                >
                                  <TextField
                                    name={
                                      countryNarrativeReport.processLevelItemId
                                    }
                                    label="Comments From CO"
                                    multiline
                                    fullWidth
                                    rows={3}
                                    variant="outlined"
                                    error={Boolean(
                                      errors[
                                        countryNarrativeReport
                                          .processLevelItemId
                                      ]?.type === "required"
                                    )}
                                    {...register(
                                      countryNarrativeReport.processLevelItemId,
                                      {
                                        required: "Field is required",
                                      }
                                    )}
                                  />
                                </TableCell>
                              </TableRow>
                            )
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
                              {sumServiceContactFrequency}
                            </TableCell>
                            <TableCell
                              sx={{
                                border: "1px solid #000",
                                textAlign: "center",
                              }}
                            >
                              {sumYTDPerf * 100}%
                            </TableCell>
                            <TableCell
                              sx={{
                                border: "1px solid #000",
                                textAlign: "center",
                              }}
                            >
                              {sumAnnualPerf * 100}%
                            </TableCell>
                            <TableCell
                              sx={{
                                border: "1px solid #000",
                                textAlign: "center",
                              }}
                            >
                              &nbsp;
                            </TableCell>
                            <TableCell
                              sx={{
                                border: "1px solid #000",
                                textAlign: "center",
                              }}
                            >
                              <TextField
                                name="overallCountryComments"
                                label="Overall Country Comments"
                                multiline
                                fullWidth
                                rows={3}
                                variant="outlined"
                                error={Boolean(
                                  errors["overallCountryComments"]?.type ===
                                    "required"
                                )}
                                {...register("overallCountryComments", {
                                  required: "Field is required",
                                })}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell
                              sx={{
                                border: "1px solid #000",
                                textAlign: "center",
                              }}
                              colSpan={4}
                            >
                              <ThemeProvider theme={theme}>
                                <Button
                                  type="submit"
                                  variant="contained"
                                  color="primary"
                                  mt={2}
                                  disabled={isSaved}
                                >
                                  Save Narrative Report
                                </Button>
                              </ThemeProvider>
                            </TableCell>

                            <TableCell
                              sx={{
                                border: "1px solid #000",
                                textAlign: "center",
                              }}
                              colSpan={3}
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
                  </form>
                )}
                {CountryNarrativeReportsData.data.length == 0 && (
                  <React.Fragment>
                    No Project Narrative Reports Found
                  </React.Fragment>
                )}
              </Grid>
            </Grid>
          ) : (
            <React.Fragment></React.Fragment>
          )}
        </CardContent>
      </Card>
    </React.Fragment>
  );
};
export default CountryPerformanceReport;
