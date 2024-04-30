import React, { useContext, useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Grid,
  MenuItem,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getLookupMasterItemsByName } from "../../../api/lookup";
import { green, purple } from "@mui/material/colors";
import TableContainer from "@mui/material/TableContainer";
import TableBody from "@mui/material/TableBody";
import DownloadIcon from "@mui/icons-material/Download";
import {
  addGlobalLevelDCA,
  getCountryLevelDCAs,
  getGlobalLevelDCA,
  uploadDCAReportingFile,
} from "../../../api/internal-reporting";
import Papa from "papaparse";
import ArrowRightOutlinedIcon from "@mui/icons-material/ArrowRightOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import { Guid } from "../../../utils/guid";
import useKeyCloakAuth from "../../../hooks/useKeyCloakAuth";

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

const GlobalDCASummary = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [implementationYear, setImplementationYear] = useState();
  const [implementationYearId, setImplementationYearId] = useState();
  const [sumOriginalChild, setSumOriginalChild] = useState(0);
  const [sumOriginalYouth, setSumOriginalYouth] = useState(0);
  const [sumOriginalAdult, setSumOriginalAdult] = useState(0);
  const [sumOriginalTotal, setSumOriginalTotal] = useState(0);
  const [sumAdjustedChild, setSumAdjustedChild] = useState(0);
  const [sumAdjustedYouth, setSumAdjustedYouth] = useState(0);
  const [sumAdjustedAdult, setSumAdjustedAdult] = useState(0);
  const [sumAdjustedTotal, setSumAdjustedTotal] = useState(0);
  const [sumFinalChild, setSumFinalChild] = useState(0);
  const [sumFinalYouth, setSumFinalYouth] = useState(0);
  const [sumFinalAdult, setSumFinalAdult] = useState(0);
  const [sumFinalTotal, setSumFinalTotal] = useState(0);
  const [disableEdit, setDisableEdit] = useState(false);
  const [filePath, setFilePath] = useState();
  const [fileName, setFileName] = useState();
  const user = useKeyCloakAuth();

  const mutation = useMutation({ mutationFn: uploadDCAReportingFile });
  const mutationGlobalLevel = useMutation({ mutationFn: addGlobalLevelDCA });

  const {
    isLoading: isLoadingGlobalDCA,
    isError: isErrorGlobalDCA,
    data: GlobalDCAData,
  } = useQuery(["getGlobalLevelDCA", implementationYearId], getGlobalLevelDCA, {
    enabled: !!implementationYearId,
  });
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
    isError: isErrorCountryLevelDCAs,
    isLoading: isLoadingCountryLevelDCAs,
    data: CountryLevelDCAs,
  } = useQuery(
    ["getCountryLevelDCAs", implementationYearId],
    getCountryLevelDCAs,
    {
      enabled: !!implementationYearId,
    }
  );

  const formik = useFormik({
    initialValues: { implementationYear: "" },
    validationSchema: Yup.object().shape({
      implementationYear: Yup.object().required("Required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setImplementationYear(values.implementationYear.lookupItemName);
        setImplementationYearId(values.implementationYear.lookupItemId);
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  const formikAdjustment = useFormik({
    initialValues: {
      globalAdjustedChild: 0,
      globalAdjustedYouth: 0,
      globalAdjustedAdults: 0,
      globalAdjustedTotal: 0,
      comments: "",
      file: "",
    },
    validationSchema: Yup.object().shape({
      globalAdjustedChild: Yup.string().required("Required"),
      globalAdjustedAdults: Yup.string().required("Required"),
      globalAdjustedYouth: Yup.string().required("Required"),
      globalAdjustedTotal: Yup.string().required("Required"),
      comments: Yup.string().required("Required"),
      file: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (!fileName || !filePath) {
          toast("Please upload a document", {
            type: "error",
          });
          return;
        }
        const InData = {
          globalAdjustedChild: values.globalAdjustedChild,
          globalAdjustedAdults: values.globalAdjustedAdults,
          globalAdjustedYouth: values.globalAdjustedYouth,
          globalAdjustedTotal: values.globalAdjustedTotal,
          comments: values.comments,
          filePath,
          fileName,
          ImplementingYearId: implementationYearId,
          originalChild: sumFinalChild,
          originalYouth: sumFinalYouth,
          originalAdult: sumFinalAdult,
          originalTotal: sumFinalTotal,
          finalChild: sumFinalChild - values.globalAdjustedChild,
          finalYouth: sumFinalYouth - values.globalAdjustedYouth,
          finalAdult: sumFinalAdult - values.globalAdjustedAdults,
          finalTotal: sumFinalTotal - values.globalAdjustedTotal,
          CreateDate: new Date(),
          UserId: user.sub,
        };
        InData.id = new Guid().toString();
        console.log(InData);
        await mutationGlobalLevel.mutateAsync(InData);
        setSubmitting(true);
        toast("Successfully Created Global DCA", {
          type: "success",
        });
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  function downloadGlobalDCASummary() {
    const csvData = [];
    if (
      !isLoadingCountryLevelDCAs &&
      !isErrorCountryLevelDCAs &&
      CountryLevelDCAs
    ) {
      for (const datum of CountryLevelDCAs.data) {
        csvData.push({
          implementationYear,
          implementingYearId: datum.implementingYearId,
          comments: datum.comments,
          fileName: datum.fileName,
          finalAdult: datum.finalAdult,
          finalTotal: datum.finalTotal,
          finalYouth: datum.finalYouth,
          finalChild: datum.finalChild,
          officeAdjustedAdults: datum.officeAdjustedAdults,
          officeAdjustedChild: datum.officeAdjustedChild,
          officeAdjustedTotal: datum.officeAdjustedTotal,
          officeAdjustedYouth: datum.officeAdjustedYouth,
          originalAdult: datum.originalAdult,
          originalChild: datum.originalChild,
          originalTotal: datum.originalTotal,
          originalYouth: datum.originalYouth,
          selectedOffice: datum.selectedOffice,
        });
      }
    }
    const csv = Papa.unparse(csvData, {
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

  useEffect(() => {
    if (
      !isLoadingCountryLevelDCAs &&
      !isErrorCountryLevelDCAs &&
      CountryLevelDCAs
    ) {
      let originalChildTotal = 0;
      let originalYouthTotal = 0;
      let originalAdultTotal = 0;
      let originalTotal = 0;

      let adjustedChildTotal = 0;
      let adjustedYouthTotal = 0;
      let adjustedAdultTotal = 0;
      let adjustedTotal = 0;

      let finalChildTotal = 0;
      let finalYouthTotal = 0;
      let finalAdultTotal = 0;
      let finalTotal = 0;

      for (const datum of CountryLevelDCAs.data) {
        originalChildTotal += datum.originalChild;
        originalYouthTotal += datum.originalYouth;
        originalAdultTotal += datum.originalAdult;
        originalTotal += datum.originalTotal;

        adjustedChildTotal += datum.officeAdjustedChild;
        adjustedYouthTotal += datum.officeAdjustedYouth;
        adjustedAdultTotal += datum.officeAdjustedAdults;
        adjustedTotal += datum.officeAdjustedTotal;

        finalChildTotal += datum.finalChild;
        finalYouthTotal += datum.finalYouth;
        finalAdultTotal += datum.finalAdult;
        finalTotal += datum.finalTotal;
      }
      setSumOriginalChild(originalChildTotal);
      setSumOriginalYouth(originalYouthTotal);
      setSumOriginalAdult(originalAdultTotal);
      setSumOriginalTotal(originalTotal);

      setSumAdjustedChild(adjustedChildTotal);
      setSumAdjustedYouth(adjustedYouthTotal);
      setSumAdjustedAdult(adjustedAdultTotal);
      setSumAdjustedTotal(adjustedTotal);

      setSumFinalChild(finalChildTotal);
      setSumFinalYouth(finalYouthTotal);
      setSumFinalAdult(finalAdultTotal);
      setSumFinalTotal(finalTotal);
    }

    if (!isLoadingGlobalDCA && !isErrorGlobalDCA && GlobalDCAData) {
      console.log(GlobalDCAData);
      if (GlobalDCAData.data.length > 0) {
        setDisableEdit(true);
        formikAdjustment.setFieldValue(
          "globalAdjustedChild",
          GlobalDCAData.data[0].globalAdjustedChild
        );
        formikAdjustment.setFieldValue(
          "globalAdjustedYouth",
          GlobalDCAData.data[0].globalAdjustedYouth
        );
        formikAdjustment.setFieldValue(
          "globalAdjustedAdults",
          GlobalDCAData.data[0].globalAdjustedAdults
        );
        formikAdjustment.setFieldValue(
          "globalAdjustedTotal",
          GlobalDCAData.data[0].globalAdjustedTotal
        );
        formikAdjustment.setFieldValue(
          "comments",
          GlobalDCAData.data[0].comments
        );
      }
    }
  }, [
    isLoadingCountryLevelDCAs,
    isErrorCountryLevelDCAs,
    CountryLevelDCAs,
    isLoadingGlobalDCA,
    isErrorGlobalDCA,
    GlobalDCAData,
  ]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const onSelectedFile = (event) => {
    formikAdjustment.setFieldValue("file", event.target.files[0]);
  };

  const uploadFile = async () => {
    try {
      if (formikAdjustment.values.file) {
        const response = await mutation.mutateAsync(
          formikAdjustment.values.file
        );
        if (response.status === 200) {
          if (response.data && response.data.length > 0) {
            setFilePath(response.data[0].path);
            setFileName(response.data[0].originalFileName);
          }
          toast("Successfully Uploaded File", {
            type: "success",
          });
        }
      } else {
        toast("Please select a file", {
          type: "error",
        });
      }
    } catch (e) {
      toast("An error occurred while uploading the file", {
        type: "error",
      });
    }
  };

  return (
    <React.Fragment>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom display="inline">
            Global DCA Summary
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
          <Stepper activeStep={activeStep} orientation="vertical">
            <Step key={0}>
              <StepLabel>
                Global DCA Summary table - {implementationYear}
              </StepLabel>
              <StepContent>
                <Grid container spacing={12}>
                  <Grid item md={12}>
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
                              Country
                            </TableCell>
                            <TableCell
                              sx={{
                                border: "1px solid #000",
                                textAlign: "center",
                              }}
                            >
                              Country projects total child
                            </TableCell>
                            <TableCell
                              sx={{
                                border: "1px solid #000",
                                textAlign: "center",
                              }}
                            >
                              Country projects total youth
                            </TableCell>
                            <TableCell
                              sx={{
                                border: "1px solid #000",
                                textAlign: "center",
                              }}
                            >
                              Country projects total adult
                            </TableCell>
                            <TableCell
                              sx={{
                                border: "1px solid #000",
                                textAlign: "center",
                              }}
                            >
                              Country Projects total
                            </TableCell>
                            <TableCell
                              sx={{
                                border: "1px solid #000",
                                textAlign: "center",
                              }}
                            >
                              Country Adjusted child
                            </TableCell>
                            <TableCell
                              sx={{
                                border: "1px solid #000",
                                textAlign: "center",
                              }}
                            >
                              Country Adjusted youth
                            </TableCell>
                            <TableCell
                              sx={{
                                border: "1px solid #000",
                                textAlign: "center",
                              }}
                            >
                              Country Adjusted adult
                            </TableCell>
                            <TableCell
                              sx={{
                                border: "1px solid #000",
                                textAlign: "center",
                              }}
                            >
                              Country Adjusted Total
                            </TableCell>
                            <TableCell
                              sx={{
                                border: "1px solid #000",
                                textAlign: "center",
                              }}
                            >
                              Country Final child
                            </TableCell>
                            <TableCell
                              sx={{
                                border: "1px solid #000",
                                textAlign: "center",
                              }}
                            >
                              Country Final youth
                            </TableCell>
                            <TableCell
                              sx={{
                                border: "1px solid #000",
                                textAlign: "center",
                              }}
                            >
                              Country Final adult
                            </TableCell>
                            <TableCell
                              sx={{
                                border: "1px solid #000",
                                textAlign: "center",
                              }}
                            >
                              Country Final Total
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {!isLoadingCountryLevelDCAs &&
                          !isErrorCountryLevelDCAs ? (
                            <React.Fragment>
                              {CountryLevelDCAs.data.map(
                                (countryLevelDCA, index) => {
                                  return (
                                    <TableRow key={index}>
                                      <TableCell
                                        sx={{
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        {countryLevelDCA.selectedOffice}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        {countryLevelDCA.originalChild}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        {countryLevelDCA.originalYouth}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        {countryLevelDCA.originalAdult}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        {countryLevelDCA.originalTotal}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        {countryLevelDCA.officeAdjustedChild}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        {countryLevelDCA.officeAdjustedYouth}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        {countryLevelDCA.officeAdjustedAdults}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        {countryLevelDCA.officeAdjustedTotal}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        {countryLevelDCA.finalChild}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        {countryLevelDCA.finalYouth}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        {countryLevelDCA.finalAdult}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        {countryLevelDCA.finalTotal}
                                      </TableCell>
                                    </TableRow>
                                  );
                                }
                              )}
                              {CountryLevelDCAs.data.length > 0 && (
                                <React.Fragment>
                                  <TableRow>
                                    <TableCell
                                      sx={{
                                        border: "1px solid #000",
                                        textAlign: "center",
                                      }}
                                    >
                                      Global Total
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        border: "1px solid #000",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sumOriginalChild}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        border: "1px solid #000",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sumOriginalYouth}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        border: "1px solid #000",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sumOriginalAdult}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        border: "1px solid #000",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sumOriginalTotal}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        border: "1px solid #000",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sumAdjustedChild}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        border: "1px solid #000",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sumAdjustedYouth}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        border: "1px solid #000",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sumAdjustedAdult}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        border: "1px solid #000",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sumAdjustedTotal}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        border: "1px solid #000",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sumFinalChild}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        border: "1px solid #000",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sumFinalYouth}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        border: "1px solid #000",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sumFinalAdult}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        border: "1px solid #000",
                                        textAlign: "center",
                                      }}
                                    >
                                      {sumFinalTotal}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell
                                      sx={{
                                        border: "1px solid #000",
                                        textAlign: "center",
                                      }}
                                      colSpan={7}
                                    >
                                      <Button
                                        type="button"
                                        variant="contained"
                                        onClick={handleNext}
                                      >
                                        <ArrowRightOutlinedIcon /> &nbsp;
                                        Continue
                                      </Button>
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        border: "1px solid #000",
                                        textAlign: "center",
                                      }}
                                      colSpan={6}
                                    >
                                      <Button
                                        type="button"
                                        variant="contained"
                                        sx={{
                                          fontWeight: "bolder",
                                          backgroundColor: "#333333",
                                          "&:hover": {
                                            background: "#333333",
                                            color: "white",
                                          },
                                        }}
                                        onClick={() =>
                                          downloadGlobalDCASummary()
                                        }
                                      >
                                        <DownloadIcon /> &nbsp; Download Global
                                        DCA summary
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                </React.Fragment>
                              )}

                              {CountryLevelDCAs.data.length === 0 && (
                                <React.Fragment>
                                  <TableRow>
                                    <TableCell
                                      sx={{
                                        border: "1px solid #000",
                                        textAlign: "center",
                                      }}
                                      colSpan={8}
                                    >
                                      No Country Level DCA found
                                    </TableCell>
                                  </TableRow>
                                </React.Fragment>
                              )}
                            </React.Fragment>
                          ) : (
                            <React.Fragment></React.Fragment>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </StepContent>
            </Step>
            <Step key={1}>
              <StepLabel>Global level double counting adjustment</StepLabel>
              <StepContent>
                <Grid container spacing={12}>
                  <Grid item md={12}>
                    <form onSubmit={formikAdjustment.handleSubmit}>
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
                                Global
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                Global total child
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                Global total youth
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                Global total adult
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                Global total
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                Global Adjusted child
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                Global Adjusted youth
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                Global Adjusted adult
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                Global Adjusted Total
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                Global Final child
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                Global Final youth
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                Global Final adult
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                Global Final Total
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              ></TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                {sumFinalChild}
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                {sumFinalYouth}
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                {sumFinalAdult}
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                {sumFinalTotal}
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                <TextField
                                  name="globalAdjustedChild"
                                  label="Global Adjusted Child"
                                  value={
                                    formikAdjustment.values.globalAdjustedChild
                                  }
                                  error={Boolean(
                                    formikAdjustment.touched
                                      .globalAdjustedChild &&
                                      formikAdjustment.errors
                                        .globalAdjustedChild
                                  )}
                                  fullWidth
                                  helperText={
                                    formikAdjustment.touched
                                      .globalAdjustedChild &&
                                    formikAdjustment.errors.globalAdjustedChild
                                  }
                                  onBlur={formikAdjustment.handleBlur}
                                  onChange={formikAdjustment.handleChange}
                                  variant="outlined"
                                  disabled={disableEdit}
                                  type="number"
                                />
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                <TextField
                                  name="globalAdjustedYouth"
                                  label="Global Adjusted Youth"
                                  value={
                                    formikAdjustment.values.globalAdjustedYouth
                                  }
                                  error={Boolean(
                                    formikAdjustment.touched
                                      .globalAdjustedYouth &&
                                      formikAdjustment.errors
                                        .globalAdjustedYouth
                                  )}
                                  fullWidth
                                  helperText={
                                    formikAdjustment.touched
                                      .globalAdjustedYouth &&
                                    formikAdjustment.errors.globalAdjustedYouth
                                  }
                                  onBlur={formikAdjustment.handleBlur}
                                  onChange={formikAdjustment.handleChange}
                                  variant="outlined"
                                  disabled={disableEdit}
                                  type="number"
                                />
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                <TextField
                                  name="globalAdjustedAdults"
                                  label="Global Adjusted Adults"
                                  value={
                                    formikAdjustment.values.globalAdjustedAdults
                                  }
                                  error={Boolean(
                                    formikAdjustment.touched
                                      .globalAdjustedAdults &&
                                      formikAdjustment.errors
                                        .globalAdjustedAdults
                                  )}
                                  fullWidth
                                  helperText={
                                    formikAdjustment.touched
                                      .globalAdjustedAdults &&
                                    formikAdjustment.errors.globalAdjustedAdults
                                  }
                                  onBlur={formikAdjustment.handleBlur}
                                  onChange={formikAdjustment.handleChange}
                                  variant="outlined"
                                  disabled={disableEdit}
                                  type="number"
                                />
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                <TextField
                                  name="globalAdjustedTotal"
                                  label="Global Adjusted Total"
                                  value={
                                    formikAdjustment.values.globalAdjustedTotal
                                  }
                                  error={Boolean(
                                    formikAdjustment.touched
                                      .globalAdjustedTotal &&
                                      formikAdjustment.errors
                                        .globalAdjustedTotal
                                  )}
                                  fullWidth
                                  helperText={
                                    formikAdjustment.touched
                                      .globalAdjustedTotal &&
                                    formikAdjustment.errors.globalAdjustedTotal
                                  }
                                  onBlur={formikAdjustment.handleBlur}
                                  onChange={formikAdjustment.handleChange}
                                  variant="outlined"
                                  type="number"
                                />
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                {sumFinalChild -
                                  formikAdjustment.values.globalAdjustedChild}
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                {sumFinalYouth -
                                  formikAdjustment.values.globalAdjustedYouth}
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                {sumFinalAdult -
                                  formikAdjustment.values.globalAdjustedAdults}
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                {sumFinalTotal -
                                  (formikAdjustment.values.globalAdjustedChild +
                                    formikAdjustment.values
                                      .globalAdjustedYouth +
                                    formikAdjustment.values
                                      .globalAdjustedAdults)}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                TEXT(comment)
                              </TableCell>
                              <TableCell
                                colSpan={12}
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                <TextField
                                  name="comments"
                                  label="Comments"
                                  value={formikAdjustment.values.comments}
                                  error={Boolean(
                                    formikAdjustment.touched.comments &&
                                      formikAdjustment.errors.comments
                                  )}
                                  fullWidth
                                  helperText={
                                    formikAdjustment.touched.comments &&
                                    formikAdjustment.errors.comments
                                  }
                                  onBlur={formikAdjustment.handleBlur}
                                  onChange={formikAdjustment.handleChange}
                                  multiline
                                  variant="outlined"
                                  rows={3}
                                  my={2}
                                  disabled={disableEdit}
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                Upload File
                              </TableCell>
                              <TableCell
                                colSpan={6}
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                <TextField
                                  name="file"
                                  fullWidth
                                  onChange={(e) => {
                                    onSelectedFile(e);
                                  }}
                                  variant="outlined"
                                  type="file"
                                  disabled={disableEdit}
                                />
                              </TableCell>
                              <TableCell
                                colSpan={6}
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                <Button
                                  type="button"
                                  variant="contained"
                                  sx={{
                                    fontWeight: "bolder",
                                    backgroundColor: "#333333",
                                    "&:hover": {
                                      background: "#333333",
                                      color: "white",
                                    },
                                  }}
                                  onClick={uploadFile}
                                  disabled={disableEdit}
                                >
                                  <CloudUploadIcon /> &nbsp; Upload
                                </Button>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell></TableCell>
                              <TableCell colSpan={8}>
                                <Button
                                  type="button"
                                  variant="contained"
                                  onClick={formikAdjustment.handleSubmit}
                                  sx={{
                                    fontWeight: "bolder",
                                    backgroundColor: "#333333",
                                    "&:hover": {
                                      background: "#333333",
                                      color: "white",
                                    },
                                  }}
                                  disabled={disableEdit}
                                >
                                  <SaveIcon /> &nbsp; Save
                                </Button>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </form>
                  </Grid>
                </Grid>
              </StepContent>
            </Step>
          </Stepper>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};
export default GlobalDCASummary;
