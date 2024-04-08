import React from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  CircularProgress,
  Divider as MuiDivider,
  Grid,
  Link,
  MenuItem,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProjectLocations } from "../../../api/location";
import { getLookupMasterItemsByName } from "../../../api/lookup";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { green, purple } from "@mui/material/colors";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import InnovationDataGrid from "./InnovationV2/InnovationDataGrid";
import InnovationDetail from "./InnovationV2/InnovationDetail";
import InnovationMonitoring from "./InnovationV2/InnovationMonitoring";
import AdvocacyDataGrid from "./Advocacy/AdvocacyDataGrid";
import AdvocacyDetail from "./Advocacy/AdvocacyDetail";
import TechnicalAssistanceDataGrid from "./TechnicalAssistance/TechnicalAssistanceDataGrid";
import TechnicalAssistanceDetail from "./TechnicalAssistance/TechnicalAssistanceDetail";
import LearningDataGrid from "./Learning/LearningDataGrid";
import LearningDetail from "./Learning/LearningDetail";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
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
  location: "",
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

const ProjectMonitoringAccordion = ({
  processLevelItemId,
  processLevelTypeId,
}) => {
  const [action, setAction] = React.useState({ id: 0, status: true, data: {} });
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();
  const {
    data: projectGeographicalFocus,
    isLoading: isLoadingGeoFocus,
    isError: isErrorGeoFocus,
  } = useQuery(
    ["getProjectLocations", processLevelItemId],
    getProjectLocations,
    {
      refetchOnWindowFocus: false,
      enabled: !!processLevelItemId,
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

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      implementationYear: Yup.string().required("Required"),
      location: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        navigate(
          `/project-access/monitoring/table-quantitative-results/${processLevelItemId}/${processLevelTypeId}/${values.location}/${values.implementationYear}`
        );
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
        <Tab label="Quantitative" {...a11yProps(0)} />
        <Tab label="Innovation" {...a11yProps(1)} />
        <Tab label="Technical Assistance" {...a11yProps(2)} />
        <Tab label="Advocacy" {...a11yProps(3)} />
        <Tab label="Reasearch (Learning)" {...a11yProps(4)} />
        <Tab label="Innovation V2" {...a11yProps(5)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Typography variant="h5" gutterBottom display="inline">
          Quantitative Monitoring
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
                      required
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
                      onChange={formik.handleChange}
                      variant="outlined"
                      my={2}
                    >
                      <MenuItem disabled value="">
                        Select Implementation Year
                      </MenuItem>
                      {!isLoading && !isError
                        ? implementationYears.data.map((option) => (
                            <MenuItem
                              key={option.lookupItemId}
                              value={option.lookupItemId}
                            >
                              {option.lookupItemName}
                            </MenuItem>
                          ))
                        : []}
                    </TextField>
                  </Grid>
                  <Grid item md={4}>
                    <TextField
                      name="location"
                      label="Location"
                      select
                      required
                      value={formik.values.location}
                      error={Boolean(
                        formik.touched.location && formik.errors.location
                      )}
                      fullWidth
                      helperText={
                        formik.touched.location && formik.errors.location
                      }
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      variant="outlined"
                      my={2}
                    >
                      <MenuItem disabled value="">
                        Select Location
                      </MenuItem>
                      {!isLoadingGeoFocus && !isErrorGeoFocus
                        ? projectGeographicalFocus.data.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              {option.administrativeUnitName}
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
                        Continue
                      </Button>
                    </ThemeProvider>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </form>
      </TabPanel>
      <TabPanel value={value} index={1}>
        {(() => {
          if (action.status) {
            return (
              <InnovationDataGrid
                processLevelItemId={processLevelItemId}
                processLevelTypeId={processLevelTypeId}
                onActionChange={setAction}
              />
            );
          } else {
            return (
              <>
                <InnovationDetail
                  id={action.id}
                  processLevelItemId={processLevelItemId}
                  processLevelTypeId={processLevelTypeId}
                  onActionChange={setAction}
                />
              </>
            );
          }
        })()}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {(() => {
          if (action.status) {
            return (
              <TechnicalAssistanceDataGrid
                processLevelItemId={processLevelItemId}
                processLevelTypeId={processLevelTypeId}
                onActionChange={setAction}
              />
            );
          } else {
            return (
              <>
                <TechnicalAssistanceDetail
                  id={action.id}
                  processLevelItemId={processLevelItemId}
                  processLevelTypeId={processLevelTypeId}
                  onActionChange={setAction}
                />
              </>
            );
          }
        })()}
      </TabPanel>
      <TabPanel value={value} index={3}>
        {(() => {
          if (action.status) {
            return (
              <AdvocacyDataGrid
                processLevelItemId={processLevelItemId}
                processLevelTypeId={processLevelTypeId}
                onActionChange={setAction}
              />
            );
          } else {
            return (
              <>
                <AdvocacyDetail
                  id={action.id}
                  processLevelItemId={processLevelItemId}
                  processLevelTypeId={processLevelTypeId}
                  onActionChange={setAction}
                />
              </>
            );
          }
        })()}
      </TabPanel>
      <TabPanel value={value} index={4}>
        {(() => {
          if (action.status) {
            return (
              <LearningDataGrid
                processLevelItemId={processLevelItemId}
                processLevelTypeId={processLevelTypeId}
                onActionChange={setAction}
              />
            );
          } else {
            return (
              <>
                <LearningDetail
                  id={action.id}
                  processLevelItemId={processLevelItemId}
                  processLevelTypeId={processLevelTypeId}
                  onActionChange={setAction}
                />
              </>
            );
          }
        })()}
      </TabPanel>
      <TabPanel value={value} index={5}>
        <InnovationMonitoring />
      </TabPanel>
    </Box>
  );
};

const ProjectMonitoring = () => {
  let { id, processLevelTypeId } = useParams();
  return (
    <React.Fragment>
      <Helmet title="Project Monitoring" />
      <ProjectMonitoringAccordion
        processLevelItemId={id}
        processLevelTypeId={processLevelTypeId}
      />
    </React.Fragment>
  );
};
export default ProjectMonitoring;
