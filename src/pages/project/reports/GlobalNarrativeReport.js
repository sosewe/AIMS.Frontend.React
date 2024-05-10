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
import {
  addCorporateNarrativeReport,
  getAllNarrativeReports,
  getCorporateNarrativeReports,
} from "../../../api/internal-reporting";
import TableContainer from "@mui/material/TableContainer";
import TableBody from "@mui/material/TableBody";
import DownloadingOutlinedIcon from "@mui/icons-material/DownloadingOutlined";
import { useForm } from "react-hook-form";
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

const GlobalNarrativeReport = () => {
  const [implementationYear, setImplementationYear] = useState();
  const [implementationYearId, setImplementationYearId] = useState();
  const [implementationMonth, setImplementationMonth] = useState();
  const [implementationMonthId, setImplementationMonthId] = useState();
  const [sumServiceContactFrequency, setSumServiceContactFrequency] =
    useState(0);
  const [sumYTDPerf, setSumYTDPerf] = useState(0);
  const [sumAnnualPerf, setSumAnnualPerf] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

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
    isLoading: isLoadingAllNarrativeReports,
    isError: isErrorAllNarrativeReports,
    data: AllNarrativeReportsData,
  } = useQuery(
    ["getAllNarrativeReports", implementationYearId, implementationMonthId],
    getAllNarrativeReports,
    {
      enabled: !!implementationYearId && !!implementationMonthId,
    }
  );

  const {
    isLoading: isLoadingCorporateNarrativeReports,
    isError: isErrorCorporateNarrativeReports,
    data: CorporateNarrativeReportsData,
  } = useQuery(
    [
      "getCorporateNarrativeReports",
      implementationYearId,
      implementationMonthId,
    ],
    getCorporateNarrativeReports,
    {
      enabled: !!implementationYearId && !!implementationMonthId,
    }
  );

  const mutation = useMutation({ mutationFn: addCorporateNarrativeReport });

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
      !isLoadingAllNarrativeReports &&
      !isErrorAllNarrativeReports &&
      AllNarrativeReportsData
    ) {
      let serviceContactFrequency = 0;
      let ytdPerf = 0;
      let annualPerf = 0;
      let count = 0;
      for (const countryNarrativeDatum of AllNarrativeReportsData.data) {
        serviceContactFrequency +=
          countryNarrativeDatum.serviceContactFrequency;
        ytdPerf += countryNarrativeDatum.ytdPerf;
        annualPerf += countryNarrativeDatum.annualPerf;
        count++;
      }
      setSumServiceContactFrequency(serviceContactFrequency);
      setSumYTDPerf(ytdPerf / count);
      setSumAnnualPerf(annualPerf / count);
    }

    if (
      !isLoadingCorporateNarrativeReports &&
      !isErrorCorporateNarrativeReports &&
      CorporateNarrativeReportsData
    ) {
      if (CorporateNarrativeReportsData.data.length > 0) {
        for (const corporateNarrativeReportData of CorporateNarrativeReportsData
          .data[0].corporateNarrativeReportDatas) {
          setValue(
            corporateNarrativeReportData.office,
            corporateNarrativeReportData.comments
          );
        }
        setValue(
          "overallCorporateComments",
          CorporateNarrativeReportsData.data[0].overallCorporateComments
        );
        setIsSaved(true);
      }
    }
  }, [
    isLoadingAllNarrativeReports,
    isErrorAllNarrativeReports,
    AllNarrativeReportsData,
    isLoadingCorporateNarrativeReports,
    isErrorCorporateNarrativeReports,
    CorporateNarrativeReportsData,
  ]);

  const onSubmit = async (data) => {
    try {
      const InData = {
        ImplementingYearId: implementationYearId,
        ImplementationMonthId: implementationMonthId,
        overallCorporateComments: data.overallCorporateComments,
        serviceContactFrequency: sumServiceContactFrequency,
        ytdPerf: sumYTDPerf,
        annualPerf: sumAnnualPerf,
        CorporateNarrativeReportDatas: [],
      };
      const entries = Object.entries(data);
      for (const entry of entries) {
        if (entry[0] !== "overallCorporateComments") {
          InData.CorporateNarrativeReportDatas.push({
            office: entry[0],
            comments: entry[1],
          });
        }
      }
      await mutation.mutateAsync(InData);
      toast("Successfully Created Corporate Performance Report", {
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
    const csv = Papa.unparse(AllNarrativeReportsData.data, {
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
          {!isLoadingAllNarrativeReports && !isErrorAllNarrativeReports ? (
            <Grid container spacing={6}>
              <Grid item md={12}>
                {AllNarrativeReportsData.data.length > 0 && (
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
                              Implementing Office
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
                              Country Narrative Explanation
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
                          {AllNarrativeReportsData.data.map(
                            (narrativeReport, index) => (
                              <TableRow key={index}>
                                <TableCell
                                  sx={{
                                    border: "1px solid #000",
                                    textAlign: "center",
                                  }}
                                >
                                  {narrativeReport.selectedOffice}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "1px solid #000",
                                    textAlign: "center",
                                  }}
                                >
                                  {narrativeReport.serviceContactFrequency}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "1px solid #000",
                                    textAlign: "center",
                                  }}
                                >
                                  {narrativeReport.ytdPerf * 100}%
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "1px solid #000",
                                    textAlign: "center",
                                  }}
                                >
                                  {narrativeReport.annualPerf * 100}%
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "1px solid #000",
                                    textAlign: "center",
                                  }}
                                >
                                  {narrativeReport.overallCountryComments}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "1px solid #000",
                                    textAlign: "center",
                                  }}
                                >
                                  <TextField
                                    name={narrativeReport.selectedOffice}
                                    label="Comments From CO"
                                    multiline
                                    fullWidth
                                    rows={3}
                                    variant="outlined"
                                    error={Boolean(
                                      errors[narrativeReport.selectedOffice]
                                        ?.type === "required"
                                    )}
                                    {...register(
                                      narrativeReport.selectedOffice,
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
                                name="overallCorporateComments"
                                label="Overall Corporate Comments"
                                multiline
                                fullWidth
                                rows={3}
                                variant="outlined"
                                error={Boolean(
                                  errors["overallCorporateComments"]?.type ===
                                    "required"
                                )}
                                {...register("overallCorporateComments", {
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
                {AllNarrativeReportsData.data.length == 0 && (
                  <React.Fragment>
                    No Country Narrative Reports Found
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
export default GlobalNarrativeReport;
