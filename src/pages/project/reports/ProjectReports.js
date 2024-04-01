import React from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
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
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { green, purple } from "@mui/material/colors";
import { useFormik } from "formik";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import * as Yup from "yup";
import { useQuery } from "@tanstack/react-query";
import { getLookupMasterItemsByName } from "../../../api/lookup";
import { toast } from "react-toastify";
import { apiRoutes } from "../../../apiRoutes";
import DoubleCountingAdjustment from "./DoubleCountingAdjustment";

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

const initialValues = {
  implementationYear: "",
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      style={{ width: "100%" }}
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={"span"} variant={"body2"}>
            {children}
          </Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const ProjectReportsAccordion = ({
  processLevelItemId,
  processLevelTypeId,
}) => {
  const [value, setValue] = React.useState(0);
  const [canDownload, setCanDownload] = React.useState(false);
  const [implementingYearId, setImplementingYearId] = React.useState(undefined);
  const [year, setYear] = React.useState(undefined);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      implementationYear: Yup.object().required("Required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setImplementingYearId(values.implementationYear.lookupItemId);
        setYear(values.implementationYear.lookupItemName);
        setCanDownload(true);
        setSubmitting(false);
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "background.paper",
        display: "flex",
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: "divider" }}
      >
        <Tab label="Indicator Datasets" {...a11yProps(0)} />
        <Tab label="Project DCA" {...a11yProps(1)} />
        <Tab label="Narrative Reports" {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Typography variant="h5" gutterBottom display="inline">
          Quantitative Reporting
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
                        setCanDownload(false);
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
              {canDownload && (
                <Grid container spacing={6}>
                  <Grid item md={12}>
                    <Box
                      sx={{
                        "& > *:not(style)": {
                          display: "block",
                          mb: 2, // Add margin between each link
                        },
                      }}
                    >
                      <a
                        href={`${apiRoutes.projectAchievedResult}/Results/${implementingYearId}/${processLevelItemId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download: Indicator raw dataset
                      </a>
                      <a
                        href={`${apiRoutes.projectAchievedResult}/YTD/${year}/${processLevelItemId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download: Indicator YTD summary dataset
                      </a>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </form>
      </TabPanel>
      <TabPanel index={1} value={value}>
        <DoubleCountingAdjustment />
      </TabPanel>
    </Box>
  );
};

const ProjectReports = () => {
  let { id, processLevelTypeId } = useParams();
  return (
    <React.Fragment>
      <Helmet title="Project Reports" />
      <ProjectReportsAccordion
        processLevelItemId={id}
        processLevelTypeId={processLevelTypeId}
      />
    </React.Fragment>
  );
};
export default ProjectReports;
