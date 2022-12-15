import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
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
import { spacing } from "@mui/system";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getLookupMasterItemsByName } from "../../api/lookup";
import {
  getOrganizationUnitById,
  newOrganizationUnit,
} from "../../api/organization-unit";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { getAllProcessLevel } from "../../api/process-level";
import { Guid } from "../../utils/guid";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const initialValues = {
  name: "",
  initials: "",
  countryId: "",
  processLevelId: "",
  amrefEntityId: "",
  contactPerson: "",
  contactEmail: "",
};

const NewOrganizationUnitForm = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const { data: OrganizationUnitData } = useQuery(
    ["getOrganizationUnitById", id],
    getOrganizationUnitById,
    {
      refetchOnWindowFocus: false,
      enabled: !!id,
    }
  );
  const { data: countriesData, isLoading } = useQuery(
    ["countries", "Country"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );
  const { data: entityTypesData, isLoading: isLoadingEntityTypes } = useQuery(
    ["entityTypes", "EntityType"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );
  const { isLoading: isLoadingProcessLevel, data: processLevelData } = useQuery(
    ["getAllProcessLevel"],
    getAllProcessLevel,
    {
      refetchOnWindowFocus: false,
      retry: 0,
    }
  );
  const mutation = useMutation({ mutationFn: newOrganizationUnit });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Required"),
      initials: Yup.string().required("Required"),
      countryId: Yup.string().required("Required"),
      processLevelId: Yup.string().required("Required"),
      amrefEntityId: Yup.string().required("Required"),
      contactPerson: Yup.string().required("Required"),
      contactEmail: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      const e = new Guid();
      values.createDate = new Date();
      if (id) {
        values.id = id;
      } else {
        values.id = e.toString();
      }
      try {
        await mutation.mutateAsync(values);
        toast("Successfully Created Organization Unit", {
          type: "success",
        });
        navigate("/settings/organization-units");
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });
  useEffect(() => {
    function setCurrentFormValues() {
      if (OrganizationUnitData) {
        formik.setValues({
          name: OrganizationUnitData.data.name,
          initials: OrganizationUnitData.data.initials,
          countryId: OrganizationUnitData.data.countryId,
          processLevelId: OrganizationUnitData.data.processLevelId,
          amrefEntityId: OrganizationUnitData.data.amrefEntityId,
          contactPerson: OrganizationUnitData.data.contactPerson,
          contactEmail: OrganizationUnitData.data.contactEmail,
        });
      }
    }
    setCurrentFormValues();
  }, [OrganizationUnitData]);

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
              <Grid container spacing={12}>
                <Grid item md={12}>
                  <Typography variant="h3" gutterBottom display="inline">
                    NEW ORGANIZATION UNIT
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={4}>
                <Grid item md={4}>
                  <TextField
                    name="name"
                    label="Name"
                    required
                    value={formik.values.name}
                    error={Boolean(formik.touched.name && formik.errors.name)}
                    fullWidth
                    helperText={formik.touched.name && formik.errors.name}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  />
                </Grid>
                <Grid item md={4}>
                  <TextField
                    name="initials"
                    label="Initials"
                    required
                    value={formik.values.initials}
                    error={Boolean(
                      formik.touched.initials && formik.errors.initials
                    )}
                    fullWidth
                    helperText={
                      formik.touched.initials && formik.errors.initials
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  />
                </Grid>
                <Grid item md={4}>
                  <TextField
                    name="countryId"
                    label="Country"
                    select
                    value={formik.values.countryId}
                    error={Boolean(
                      formik.touched.countryId && formik.errors.countryId
                    )}
                    fullWidth
                    helperText={
                      formik.touched.countryId && formik.errors.countryId
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Country
                    </MenuItem>
                    {!isLoading
                      ? countriesData.data.map((option) => (
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
              </Grid>
              <Grid container spacing={4}>
                <Grid item md={4}>
                  <TextField
                    name="processLevelId"
                    label="MEL Process Level"
                    select
                    value={formik.values.processLevelId}
                    error={Boolean(
                      formik.touched.processLevelId &&
                        formik.errors.processLevelId
                    )}
                    fullWidth
                    helperText={
                      formik.touched.processLevelId &&
                      formik.errors.processLevelId
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select MEL Process Level
                    </MenuItem>
                    {!isLoadingProcessLevel
                      ? processLevelData.data.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))
                      : []}
                  </TextField>
                </Grid>
                <Grid item md={4}>
                  <TextField
                    name="amrefEntityId"
                    label="Amref Entity Type"
                    select
                    value={formik.values.amrefEntityId}
                    error={Boolean(
                      formik.touched.amrefEntityId &&
                        formik.errors.amrefEntityId
                    )}
                    fullWidth
                    helperText={
                      formik.touched.amrefEntityId &&
                      formik.errors.amrefEntityId
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Amref Entity Type
                    </MenuItem>
                    {!isLoadingEntityTypes
                      ? entityTypesData.data.map((option) => (
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
                    name="contactPerson"
                    label="Contact Person"
                    required
                    value={formik.values.contactPerson}
                    error={Boolean(
                      formik.touched.contactPerson &&
                        formik.errors.contactPerson
                    )}
                    fullWidth
                    helperText={
                      formik.touched.contactPerson &&
                      formik.errors.contactPerson
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={4}>
                <Grid item md={4}>
                  <TextField
                    name="contactEmail"
                    label="Contact Email"
                    required
                    value={formik.values.contactEmail}
                    error={Boolean(
                      formik.touched.contactEmail && formik.errors.contactEmail
                    )}
                    fullWidth
                    helperText={
                      formik.touched.contactEmail && formik.errors.contactEmail
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  />
                </Grid>
              </Grid>
              <Button type="submit" variant="contained" color="primary" mt={3}>
                Save changes
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </form>
  );
};

const NewOrganizationUnit = () => {
  return (
    <React.Fragment>
      <Helmet title="New Administrative Programme" />
      <Typography variant="h3" gutterBottom display="inline">
        New Organization Unit
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/programme/administrative-programmes">
          Organization Unit
        </Link>
        <Typography>New Organization Unit</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <NewOrganizationUnitForm />
    </React.Fragment>
  );
};
export default NewOrganizationUnit;
