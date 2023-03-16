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
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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

const ProjectMonitoringAccordion = ({
  processLevelItemId,
  processLevelTypeId,
}) => {
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

  return (
    <Card mb={12}>
      <CardContent pb={1}>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Log</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>&nbsp;</Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>Update Against Results Framework</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <form onSubmit={formik.handleSubmit}>
              <Card mb={12}>
                <CardContent>
                  {formik.isSubmitting ? (
                    <Box display="flex" justifyContent="center" my={6}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <>
                      <Grid container spacing={6}>
                        <Grid item md={12}>
                          <Accordion>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1a-content"
                              id="panel1a-header"
                            >
                              <Typography>Quantitative Results</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
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
                                      ? implementationYears.data.map(
                                          (option) => (
                                            <MenuItem
                                              key={option.lookupItemId}
                                              value={option.lookupItemId}
                                            >
                                              {option.lookupItemName}
                                            </MenuItem>
                                          )
                                        )
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
                                      formik.touched.location &&
                                        formik.errors.location
                                    )}
                                    fullWidth
                                    helperText={
                                      formik.touched.location &&
                                      formik.errors.location
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
                                      ? projectGeographicalFocus.data.map(
                                          (option) => (
                                            <MenuItem
                                              key={option.id}
                                              value={option.id}
                                            >
                                              {option.administrativeUnitName}
                                            </MenuItem>
                                          )
                                        )
                                      : []}
                                  </TextField>
                                </Grid>

                                <Grid item md={4}>
                                  <ThemeProvider theme={theme}>
                                    <Button
                                      type="submit"
                                      variant="contained"
                                      color="secondaryGray"
                                      mt={2}
                                    >
                                      Continue
                                    </Button>
                                  </ThemeProvider>
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>
                          <Accordion>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1a-content"
                              id="panel1a-header"
                            >
                              <Typography>Qualitative Results</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Grid
                                container
                                spacing={6}
                                direction="column"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <Grid item md={12}>
                                  <NavLink
                                    to={`/project/monitoring/innovation-monitoring`}
                                  >
                                    <Typography
                                      variant="h3"
                                      gutterBottom
                                      display="inline"
                                    >
                                      Innovation
                                    </Typography>
                                  </NavLink>
                                </Grid>
                                <Divider />
                                <Grid item md={12}>
                                  <NavLink to={``}>
                                    <Typography
                                      variant="h3"
                                      gutterBottom
                                      display="inline"
                                    >
                                      Advocacy
                                    </Typography>
                                  </NavLink>
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>
                        </Grid>
                      </Grid>
                    </>
                  )}
                </CardContent>
              </Card>
            </form>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
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
