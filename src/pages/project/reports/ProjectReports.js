import React from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  CircularProgress,
  Divider as MuiDivider,
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
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      implementationYear: Yup.string().required("Required"),
    }),
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
            </CardContent>
          </Card>
        </form>
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
