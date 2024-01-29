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
import AdvocacyDataGrid from "./Advocacy/AdvocacyDataGrid";
import TechnicalAssistanceDataGrid from "./TechnicalAssistance/TechnicalAssistanceDataGrid";

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
          `/project/monitoring/table-quantitative-results/${processLevelItemId}/${processLevelTypeId}/${values.location}/${values.implementationYear}`
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
        <Tab label="Innovation" {...a11yProps(0)} />
        <Tab label="Technical Assistance" {...a11yProps(1)} />
        <Tab label="Advocacy" {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <InnovationDataGrid
          processLevelItemId={processLevelItemId}
          processLevelTypeId={processLevelTypeId}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TechnicalAssistanceDataGrid
          processLevelItemId={processLevelItemId}
          processLevelTypeId={processLevelTypeId}
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <AdvocacyDataGrid
          processLevelItemId={processLevelItemId}
          processLevelTypeId={processLevelTypeId}
        />
      </TabPanel>
    </Box>
  );
};

const ProjectMonitoring = () => {
  let { processLevelItemId, processLevelTypeId } = useParams();
  return (
    <React.Fragment>
      <Helmet title="Project Monitoring" />
      <Typography variant="h3" gutterBottom display="inline">
        Project Monitoring
      </Typography>
      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link
          component={NavLink}
          to={`/project/project-detail/${processLevelItemId}`}
        >
          Projects Detail
        </Link>
        <Typography>Project Monitoring</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <ProjectMonitoringAccordion
        processLevelItemId={processLevelItemId}
        processLevelTypeId={processLevelTypeId}
      />
    </React.Fragment>
  );
};
export default ProjectMonitoring;
