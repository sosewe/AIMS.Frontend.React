import React, { useState } from "react";
import {
  Box,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  CircularProgress,
  Grid,
  MenuItem,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useQuery } from "@tanstack/react-query";
import { getLookupMasterItemsByName } from "../../../api/lookup";
import * as Yup from "yup";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { green, purple } from "@mui/material/colors";
import { toast } from "react-toastify";
import { getDCAResults } from "../../../api/internal-reporting";
import GroupedTable from "./GroupedTable";
import ProjectLevelDCASummary from "./ProjectLevelDCASummary";
import CountryLevelDCA from "./CountryLevelDCA";

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

const DoubleCountingAdjustment = ({ processLevelItemId }) => {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const [implementationYear, setImplementationYear] = useState();
  const [implementationYearId, setImplementationYearId] = useState();
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
    isError: isErrorDCAResults,
    isLoading: isLoadingDCAResults,
    data: DCAResults,
  } = useQuery(
    ["getDCAResults", processLevelItemId, implementationYear],
    getDCAResults,
    {
      enabled: !!processLevelItemId && !!implementationYear,
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

  return (
    <React.Fragment>
      <Typography variant="h5" gutterBottom display="inline">
        Double Counting Adjustment
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Card mb={12}>
          <CardContent>
            {formik.isSubmitting ? (
              <Box display="flex" justifyContent="center" my={6}>
                <CircularProgress />
              </Box>
            ) : (
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
            )}

            <Stepper activeStep={activeStep} orientation="vertical">
              <Step key={0}>
                <StepLabel>Location based DCA table</StepLabel>
                <StepContent>
                  {!isLoadingDCAResults && !isErrorDCAResults ? (
                    <React.Fragment>
                      {DCAResults.data.length > 0 ? (
                        <GroupedTable
                          DCAResults={DCAResults.data}
                          processLevelItemId={processLevelItemId}
                          implementationYearId={implementationYearId}
                        />
                      ) : (
                        "Year does not have any results"
                      )}
                    </React.Fragment>
                  ) : (
                    <React.Fragment>&nbsp;</React.Fragment>
                  )}
                  <Grid container spacing={6}>
                    <Grid item md={4}>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Continue
                      </Button>
                    </Grid>
                  </Grid>
                </StepContent>
              </Step>
              <Step key={1}>
                <StepLabel>Project level DCA summary</StepLabel>
                <StepContent>
                  <ProjectLevelDCASummary
                    processLevelItemId={processLevelItemId}
                    implementationYearId={implementationYearId}
                  />

                  <Grid container spacing={6}>
                    <Grid item md={4}>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Continue
                      </Button>
                    </Grid>
                  </Grid>
                </StepContent>
              </Step>
              <Step key={2}>
                <StepLabel>Country level DCA</StepLabel>
                <StepContent>
                  <CountryLevelDCA />
                </StepContent>
              </Step>
            </Stepper>
          </CardContent>
        </Card>
      </form>
    </React.Fragment>
  );
};
export default DoubleCountingAdjustment;
