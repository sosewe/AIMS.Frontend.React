import React, { useContext, useEffect, useState } from "react";
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
import TableContainer from "@mui/material/TableContainer";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { useFormik } from "formik";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getLookupMasterItemsByName } from "../../../api/lookup";
import { green, purple } from "@mui/material/colors";
import { toast } from "react-toastify";
import {
  addCountryLevelDCA,
  getAllProjectsDCA,
  getCountryLevelDCA,
  uploadDCAReportingFile,
} from "../../../api/internal-reporting";
import TableBody from "@mui/material/TableBody";
import { OfficeContext } from "../../../App";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowRightOutlinedIcon from "@mui/icons-material/ArrowRightOutlined";
import Papa from "papaparse";
import * as Yup from "yup";
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

const CountryLevelDCA = () => {
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
  const [filePath, setFilePath] = useState();
  const [fileName, setFileName] = useState();
  const [disableEdit, setDisableEdit] = useState(false);
  const officeContext = useContext(OfficeContext);
  let selectedOffice = officeContext.selectedOffice;
  const user = useKeyCloakAuth();

  const mutation = useMutation({ mutationFn: uploadDCAReportingFile });
  const mutationCountryLevel = useMutation({ mutationFn: addCountryLevelDCA });

  const {
    isLoading: isLoadingCountryDCA,
    isError: isErrorCountryDCA,
    data: CountryDCAData,
  } = useQuery(
    ["getCountryLevelDCA", implementationYearId, selectedOffice],
    getCountryLevelDCA,
    {
      enabled: !!implementationYearId && !!selectedOffice,
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

  const {
    isLoading: isLoadingAllProjectsDCA,
    isError: isErrorAllProjectsDCA,
    data: AllProjectsDCAData,
  } = useQuery(
    ["getAllProjectsDCA", implementationYearId, selectedOffice],
    getAllProjectsDCA,
    {
      enabled: !!implementationYearId && !!selectedOffice,
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

  const downloadCountryLevelDCASummary = () => {
    const csv = Papa.unparse(AllProjectsDCAData.data, {
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
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const formikAdjustment = useFormik({
    initialValues: {
      officeAdjustedChild: 0,
      officeAdjustedYouth: 0,
      officeAdjustedAdults: 0,
      officeAdjustedTotal: 0,
      comments: "",
      file: "",
    },
    validationSchema: Yup.object().shape({
      officeAdjustedChild: Yup.string().required("Required"),
      officeAdjustedAdults: Yup.string().required("Required"),
      officeAdjustedYouth: Yup.string().required("Required"),
      officeAdjustedTotal: Yup.string().required("Required"),
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
          officeAdjustedChild: values.officeAdjustedChild,
          officeAdjustedAdults: values.officeAdjustedAdults,
          officeAdjustedYouth: values.officeAdjustedYouth,
          officeAdjustedTotal: values.officeAdjustedTotal,
          comments: values.comments,
          filePath,
          fileName,
          ImplementingYearId: implementationYearId,
          originalChild: sumFinalChild,
          originalYouth: sumFinalYouth,
          originalAdult: sumFinalAdult,
          originalTotal: sumFinalTotal,
          finalChild: sumFinalChild - values.officeAdjustedChild,
          finalYouth: sumFinalYouth - values.officeAdjustedYouth,
          finalAdult: sumFinalAdult - values.officeAdjustedAdults,
          finalTotal: sumFinalTotal - values.officeAdjustedTotal,
          CreateDate: new Date(),
          UserId: user.sub,
          selectedOffice,
        };
        InData.id = new Guid().toString();
        await mutationCountryLevel.mutateAsync(InData);
        setSubmitting(true);
        toast("Successfully Created Country Level DCA", {
          type: "success",
        });
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

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

  useEffect(() => {
    if (
      !isLoadingAllProjectsDCA &&
      !isErrorAllProjectsDCA &&
      AllProjectsDCAData
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

      for (const projectDatum of AllProjectsDCAData.data) {
        originalChildTotal += projectDatum.originalChild;
        originalYouthTotal += projectDatum.originalYouth;
        originalAdultTotal += projectDatum.originalAdult;
        originalTotal += projectDatum.originalTotal;
        adjustedChildTotal += projectDatum.adjustedChild;
        adjustedYouthTotal += projectDatum.adjustedYouth;
        adjustedAdultTotal += projectDatum.adjustedAdult;
        adjustedTotal += projectDatum.adjustedTotal;
        finalChildTotal += projectDatum.finalChild;
        finalYouthTotal += projectDatum.finalYouth;
        finalAdultTotal += projectDatum.finalAdult;
        finalTotal += projectDatum.finalTotal;
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

    if (!isLoadingCountryDCA && !isErrorCountryDCA && CountryDCAData) {
      if (CountryDCAData.data.length > 0) {
        setDisableEdit(true);
        formikAdjustment.setFieldValue(
          "comments",
          CountryDCAData.data[0].comments
        );
        formikAdjustment.setFieldValue(
          "officeAdjustedChild",
          CountryDCAData.data[0].officeAdjustedChild
        );
        formikAdjustment.setFieldValue(
          "officeAdjustedAdults",
          CountryDCAData.data[0].officeAdjustedAdults
        );
        formikAdjustment.setFieldValue(
          "officeAdjustedYouth",
          CountryDCAData.data[0].officeAdjustedYouth
        );
        formikAdjustment.setFieldValue(
          "officeAdjustedTotal",
          CountryDCAData.data[0].officeAdjustedTotal
        );
      }
    }
  }, [
    isLoadingAllProjectsDCA,
    isErrorAllProjectsDCA,
    AllProjectsDCAData,
    isLoadingCountryDCA,
    isErrorCountryDCA,
    CountryDCAData,
  ]);

  return (
    <React.Fragment>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom display="inline">
            Country Level DCA
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
                    setActiveStep(0);
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
                Country Level DCA table - {implementationYear}
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
                              Project
                            </TableCell>
                            <TableCell
                              sx={{
                                border: "1px solid #000",
                                textAlign: "center",
                              }}
                            >
                              Location
                            </TableCell>
                            <TableCell
                              sx={{
                                border: "1px solid #000",
                                textAlign: "center",
                              }}
                            >
                              Original Child
                            </TableCell>
                            <TableCell
                              sx={{
                                border: "1px solid #000",
                                textAlign: "center",
                              }}
                            >
                              Original Youth
                            </TableCell>
                            <TableCell
                              sx={{
                                border: "1px solid #000",
                                textAlign: "center",
                              }}
                            >
                              Original Adults
                            </TableCell>
                            <TableCell
                              sx={{
                                border: "1px solid #000",
                                textAlign: "center",
                              }}
                            >
                              Original Total
                            </TableCell>
                            <TableCell
                              sx={{
                                border: "1px solid #000",
                                textAlign: "center",
                              }}
                            >
                              Adjusted Child
                            </TableCell>
                            <TableCell
                              sx={{
                                border: "1px solid #000",
                                textAlign: "center",
                              }}
                            >
                              Adjusted Youth
                            </TableCell>
                            <TableCell
                              sx={{
                                border: "1px solid #000",
                                textAlign: "center",
                              }}
                            >
                              Adjusted Adult
                            </TableCell>
                            <TableCell
                              sx={{
                                border: "1px solid #000",
                                textAlign: "center",
                              }}
                            >
                              Adjusted Total
                            </TableCell>
                            <TableCell
                              sx={{
                                border: "1px solid #000",
                                textAlign: "center",
                              }}
                            >
                              Project Final Child
                            </TableCell>
                            <TableCell
                              sx={{
                                border: "1px solid #000",
                                textAlign: "center",
                              }}
                            >
                              Project Final Youth
                            </TableCell>
                            <TableCell
                              sx={{
                                border: "1px solid #000",
                                textAlign: "center",
                              }}
                            >
                              Project Final Adult
                            </TableCell>
                            <TableCell
                              sx={{
                                border: "1px solid #000",
                                textAlign: "center",
                              }}
                            >
                              Project Final Total
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {!isLoadingAllProjectsDCA &&
                          !isErrorAllProjectsDCA ? (
                            <React.Fragment>
                              {AllProjectsDCAData.data.map(
                                (projectDCA, index) => {
                                  return (
                                    <TableRow key={index}>
                                      <TableCell
                                        sx={{
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        {projectDCA.shortTitle}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        All
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        {projectDCA.originalChild}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        {projectDCA.originalYouth}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        {projectDCA.originalAdult}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        {projectDCA.originalTotal}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        {projectDCA.adjustedChild}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        {projectDCA.adjustedYouth}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        {projectDCA.adjustedAdult}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        {projectDCA.adjustedTotal}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        {projectDCA.finalChild}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        {projectDCA.finalYouth}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        {projectDCA.finalAdult}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          border: "1px solid #000",
                                          textAlign: "center",
                                        }}
                                      >
                                        {projectDCA.finalTotal}
                                      </TableCell>
                                    </TableRow>
                                  );
                                }
                              )}

                              {AllProjectsDCAData.data.length > 0 && (
                                <React.Fragment>
                                  <TableRow>
                                    <TableCell
                                      sx={{
                                        border: "1px solid #000",
                                        textAlign: "center",
                                      }}
                                      colSpan={2}
                                    >
                                      Office Total
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
                                      colSpan={8}
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
                                          downloadCountryLevelDCASummary()
                                        }
                                      >
                                        <DownloadIcon /> &nbsp; Download project
                                        level DCA summary
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                </React.Fragment>
                              )}

                              {AllProjectsDCAData.data.length === 0 && (
                                <React.Fragment>
                                  <TableRow>
                                    <TableCell
                                      sx={{
                                        border: "1px solid #000",
                                        textAlign: "center",
                                      }}
                                      colSpan={14}
                                    >
                                      No Project Level DCA found
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
              <StepLabel>Office level Double Counting Adjustment</StepLabel>
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
                                Office
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                Office projects total Child
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                Office projects total Youth
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                Office projects total Adults
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                Office Projects totals
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                Office Adjusted Child
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                Office Adjusted Youth
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                Office Adjusted Adults
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                Office Adjusted Total
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                Office Final Child
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                Office Final Youth
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                Office Final Adults
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                Office Final Total
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
                              >
                                {selectedOffice}
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
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                <TextField
                                  name="officeAdjustedChild"
                                  label="Office Adjusted Child"
                                  value={
                                    formikAdjustment.values.officeAdjustedChild
                                  }
                                  error={Boolean(
                                    formikAdjustment.touched
                                      .officeAdjustedChild &&
                                      formikAdjustment.errors
                                        .officeAdjustedChild
                                  )}
                                  fullWidth
                                  helperText={
                                    formikAdjustment.touched
                                      .officeAdjustedChild &&
                                    formikAdjustment.errors.officeAdjustedChild
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
                                  name="officeAdjustedYouth"
                                  label="Office Adjusted Youth"
                                  value={
                                    formikAdjustment.values.officeAdjustedYouth
                                  }
                                  error={Boolean(
                                    formikAdjustment.touched
                                      .officeAdjustedYouth &&
                                      formikAdjustment.errors
                                        .officeAdjustedYouth
                                  )}
                                  fullWidth
                                  helperText={
                                    formikAdjustment.touched
                                      .officeAdjustedYouth &&
                                    formikAdjustment.errors.officeAdjustedYouth
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
                                  name="officeAdjustedAdults"
                                  label="Office Adjusted Adults"
                                  value={
                                    formikAdjustment.values.officeAdjustedAdults
                                  }
                                  error={Boolean(
                                    formikAdjustment.touched
                                      .officeAdjustedAdults &&
                                      formikAdjustment.errors
                                        .officeAdjustedAdults
                                  )}
                                  fullWidth
                                  helperText={
                                    formikAdjustment.touched
                                      .officeAdjustedAdults &&
                                    formikAdjustment.errors.officeAdjustedAdults
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
                                  name="officeAdjustedTotal"
                                  label="Office Adjusted Total"
                                  value={
                                    formikAdjustment.values.officeAdjustedTotal
                                  }
                                  error={Boolean(
                                    formikAdjustment.touched
                                      .officeAdjustedTotal &&
                                      formikAdjustment.errors
                                        .officeAdjustedTotal
                                  )}
                                  fullWidth
                                  helperText={
                                    formikAdjustment.touched
                                      .officeAdjustedTotal &&
                                    formikAdjustment.errors.officeAdjustedTotal
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
                                  formikAdjustment.values.officeAdjustedChild}
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                {sumFinalYouth -
                                  formikAdjustment.values.officeAdjustedYouth}
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                {sumFinalAdult -
                                  formikAdjustment.values.officeAdjustedAdults}
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #000",
                                  textAlign: "center",
                                }}
                              >
                                {sumFinalTotal -
                                  (formikAdjustment.values.officeAdjustedChild +
                                    formikAdjustment.values
                                      .officeAdjustedYouth +
                                    formikAdjustment.values
                                      .officeAdjustedAdults)}
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
export default CountryLevelDCA;
