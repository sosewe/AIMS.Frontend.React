import React from "react";
import styled from "@emotion/styled";
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
import { purple } from "@mui/material/colors";
import { spacing } from "@mui/system";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Helmet } from "react-helmet-async";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getLookupMasterItemsByName } from "../../../api/lookup";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { getProjectLocations } from "../../../api/location";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);
const TextField = styled(MuiTextField)(spacing);

const theme = createTheme({
  palette: {
    secondary: {
      // This is green.A700 as hex.
      main: purple[500],
    },
  },
});

const initialValues = {
  implementationYear: "",
  location: "",
};

const EnterTargetQuantitativeResultsFrameworkForm = () => {
  let { processLevelItemId, processLevelTypeId } = useParams();
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
          `/project/project-indicator-targets/${processLevelItemId}/${processLevelTypeId}/${values.location}/${values.implementationYear}`
        );
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  return (
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
                <Grid item md={6}>
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
                <Grid item md={6}>
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
                          <MenuItem
                            key={option.id}
                            value={option.administrativeUnitId}
                          >
                            {option.administrativeUnitName}
                          </MenuItem>
                        ))
                      : []}
                  </TextField>
                </Grid>
              </Grid>
              <ThemeProvider theme={theme}>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  mt={3}
                >
                  Proceed to set target
                </Button>
              </ThemeProvider>
            </>
          )}
        </CardContent>
      </Card>
    </form>
  );
};

const EnterTargetQuantitativeResultsFramework = () => {
  let { processLevelItemId } = useParams();
  return (
    <React.Fragment>
      <Helmet title="Results Framework: Enter Targets" />
      <Typography variant="h3" gutterBottom display="inline">
        Results Framework: Enter Targets By Location
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link
          component={NavLink}
          to={`/project/design-project/${processLevelItemId}`}
        >
          Project Design
        </Link>
        <Typography>
          Project Quantitative Result Framework: Enter Target By Location
        </Typography>
      </Breadcrumbs>
      <Divider my={6} />
      <EnterTargetQuantitativeResultsFrameworkForm />
    </React.Fragment>
  );
};
export default EnterTargetQuantitativeResultsFramework;
