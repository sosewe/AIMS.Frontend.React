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
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAMREFStaffList,
  getLookupMasterItemsByName,
} from "../../api/lookup";
import { getOrganizationUnitByEntityType } from "../../api/organization-unit";
import {
  getAdministrativeProgrammeById,
  newAdministrativeProgramme,
} from "../../api/administrative-programme";
import { Guid } from "../../utils/guid";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const initialValues = {
  shortTitle: "",
  longTitle: "",
  description: "",
  goal: "",
  organisationUnitId: "",
  personnelId: "",
  managerEmail: "",
};

const NewAdministrativeProgrammeForm = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const { data: OrganizationUnitData } = useQuery(
    ["getAdministrativeProgrammeById", id],
    getAdministrativeProgrammeById,
    {
      refetchOnWindowFocus: false,
      enabled: !!id,
    }
  );
  const { data: entityTypesData } = useQuery(
    ["entityTypes", "EntityType"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );
  const countryOfficeEntityType =
    entityTypesData &&
    entityTypesData.data.length > 0 &&
    entityTypesData.data.find((obj) => obj.lookupItemName === "Country Office");
  const { lookupItemId } = countryOfficeEntityType
    ? countryOfficeEntityType
    : {};
  const { isLoading, data: organizationUnitsData } = useQuery(
    ["organizationUnits", lookupItemId],
    getOrganizationUnitByEntityType,
    {
      enabled: !!lookupItemId,
    }
  );
  const {
    isLoading: isLoadingStaffList,
    isError: isErrorStaffList,
    data: staffListData,
  } = useQuery(["staffList"], getAMREFStaffList, {
    refetchOnWindowFocus: false,
    retry: 0,
  });
  const mutation = useMutation({ mutationFn: newAdministrativeProgramme });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      shortTitle: Yup.string().required("Required"),
      longTitle: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
      goal: Yup.string().required("Required"),
      organisationUnitId: Yup.string().required("Required"),
      personnelId: Yup.object().required("Required"),
      managerEmail: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      values.createDate = new Date();
      values.personnelId = values.personnelId.id;
      if (id) {
        values.id = id;
      } else {
        values.id = new Guid().toString();
      }
      try {
        await mutation.mutateAsync(values);
        toast("Successfully Created an Administrative Programme", {
          type: "success",
        });
        navigate("/programme/administrative-programmes");
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });
  useEffect(() => {
    function setCurrentFormValues() {
      let personnel;
      if (staffListData && OrganizationUnitData) {
        personnel = staffListData.data.find(
          (obj) => obj.id == OrganizationUnitData.data.personnelId
        );
      }
      if (OrganizationUnitData) {
        formik.setValues({
          shortTitle: OrganizationUnitData.data.shortTitle,
          longTitle: OrganizationUnitData.data.longTitle,
          description: OrganizationUnitData.data.description,
          goal: OrganizationUnitData.data.goal,
          organisationUnitId: OrganizationUnitData.data.organisationUnitId,
          personnelId: personnel,
          managerEmail: personnel.emailAddress,
        });
      }
    }
    setCurrentFormValues();
  }, [OrganizationUnitData, staffListData]);

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
                    ADMINISTRATIVE PROGRAMME BASIC INFORMATION
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={6}>
                <Grid item md={4}>
                  <TextField
                    name="shortTitle"
                    label="Short Title"
                    required
                    value={formik.values.shortTitle}
                    error={Boolean(
                      formik.touched.shortTitle && formik.errors.shortTitle
                    )}
                    fullWidth
                    helperText={
                      formik.touched.shortTitle && formik.errors.shortTitle
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  />
                </Grid>
                <Grid item md={8}>
                  <TextField
                    name="longTitle"
                    label="Long Title"
                    required
                    value={formik.values.longTitle}
                    error={Boolean(
                      formik.touched.longTitle && formik.errors.longTitle
                    )}
                    fullWidth
                    helperText={
                      formik.touched.longTitle && formik.errors.longTitle
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  />
                </Grid>
              </Grid>
              <TextField
                name="description"
                label="Description"
                value={formik.values.description}
                error={Boolean(
                  formik.touched.description && formik.errors.description
                )}
                fullWidth
                helperText={
                  formik.touched.description && formik.errors.description
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                multiline
                required
                variant="outlined"
                rows={3}
                my={2}
              />
              <TextField
                name="goal"
                label="Goal"
                value={formik.values.goal}
                error={Boolean(formik.touched.goal && formik.errors.goal)}
                fullWidth
                helperText={formik.touched.goal && formik.errors.goal}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                multiline
                required
                variant="outlined"
                rows={3}
                my={2}
              />
              <Grid container spacing={6}>
                <Grid item md={6}>
                  <TextField
                    name="personnelId"
                    label="Project Manager's Name"
                    select
                    value={formik.values.personnelId}
                    error={Boolean(
                      formik.touched.personnelId && formik.errors.personnelId
                    )}
                    fullWidth
                    helperText={
                      formik.touched.personnelId && formik.errors.personnelId
                    }
                    onBlur={formik.handleBlur}
                    onChange={(e) => {
                      formik.handleChange(e);
                      formik.setFieldValue(
                        "managerEmail",
                        e.target.value.emailAddress
                      );
                    }}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Project Manager's Name
                    </MenuItem>
                    {!isLoadingStaffList && !isErrorStaffList
                      ? staffListData.data.map((option) => (
                          <MenuItem key={option.id} value={option}>
                            {option.firstName} {option.lastName}
                          </MenuItem>
                        ))
                      : []}
                  </TextField>
                </Grid>
                <Grid item md={6}>
                  <TextField
                    name="projectManagerEmail"
                    label="Project Manager's Email"
                    required
                    value={formik.values.managerEmail}
                    error={Boolean(
                      formik.touched.managerEmail && formik.errors.managerEmail
                    )}
                    fullWidth
                    helperText={
                      formik.touched.managerEmail && formik.errors.managerEmail
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={6}>
                <Grid item md={6}>
                  <TextField
                    name="organisationUnitId"
                    label="Organization Unit"
                    required
                    select
                    value={
                      formik.values.organisationUnitId
                        ? formik.values.organisationUnitId
                        : ""
                    }
                    error={Boolean(
                      formik.touched.organisationUnitId &&
                        formik.errors.organisationUnitId
                    )}
                    fullWidth
                    helperText={
                      formik.touched.organisationUnitId &&
                      formik.errors.organisationUnitId
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled>Select Organization Unit</MenuItem>
                    {!isLoading
                      ? organizationUnitsData.data.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))
                      : []}
                  </TextField>
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
const NewAdministrativeProgramme = () => {
  return (
    <React.Fragment>
      <Helmet title="New Administrative Programme" />
      <Typography variant="h3" gutterBottom display="inline">
        New Administrative Programme
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/programme/administrative-programmes">
          Administrative Programme
        </Link>
        <Typography>New Administrative Programme</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <NewAdministrativeProgrammeForm />
    </React.Fragment>
  );
};
export default NewAdministrativeProgramme;
