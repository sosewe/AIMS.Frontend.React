import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import styled from "@emotion/styled";
import {
  // Alert as MuiAlert,
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
import { NavLink, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  getAMREFStaffList,
  getLookupMasterItemsByName,
  newLookupItem,
} from "../../../api/lookup";
import { DatePicker } from "@mui/x-date-pickers";
import { getDonors } from "../../../api/donor";

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const CardContent = styled(MuiCardContent)(spacing);

const TextField = styled(MuiTextField)(spacing);

const Button = styled(MuiButton)(spacing);

const initialValues = {
  projectCode: "",
  projectType: "",
  shortTitle: "",
  longTitle: "",
  description: "",
  goal: "",
  startingDate: "",
  endingDate: "",
  currentStatus: "",
  projectManagerName: "",
  projectManagerEmail: "",
  totalBudget: "",
  currencyTypeId: "",
  costCentre: "",
  donors: "",
  recipientTypeId: "",
  projectOrganisationUnitId: "",
  regionalProgramme: "",
  eNASupportingOffice: "",
  administrativeProgramme: "",
};

const NewProjectForm = () => {
  let { id } = useParams();
  const { isLoading, data: projectTypesData } = useQuery(
    ["projectTypes", "ProjectType"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );
  const { isLoading: isLoadingStatuses, data: statusesData } = useQuery(
    ["currentStatus", "CurrentStatus"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );
  const { isLoading: isLoadingStaffList, data: staffListData } = useQuery(
    ["staffList"],
    getAMREFStaffList,
    {
      refetchOnWindowFocus: false,
    }
  );
  const { isLoading: isLoadingCurrency, data: currencyData } = useQuery(
    ["currencyType", "CurrencyType"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );
  const { isLoading: isLoadingDonor, data: donorData } = useQuery(
    ["donors"],
    getDonors,
    {
      refetchOnWindowFocus: false,
    }
  );
  const { isLoading: isLoadingRecipientType, data: recipientTypeData } =
    useQuery(["recipientType", "RecipientType"], getLookupMasterItemsByName, {
      refetchOnWindowFocus: false,
    });

  // const mutation = useMutation(newLookupItem, {
  //   onSuccess: () => {
  //     toast("New Lookup Item Created Successfully!", {
  //       type: "success",
  //     });
  //   },
  //   onError: (error) => {
  //     toast(error.response.data, {
  //       type: "error",
  //     });
  //   },
  // });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Required"),
      alias: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      values.createDate = new Date();
      // mutation.mutate(values);
      resetForm();
      setSubmitting(false);
    },
  });

  // useEffect(() => {
  //   function setCurrentFormValues() {
  //     if (lookupItemData) {
  //       formik.setValues({
  //         name: lookupItemData.data.name,
  //         alias: lookupItemData.data.alias,
  //       });
  //     }
  //   }
  //   setCurrentFormValues();
  // }, [lookupItemData]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card mb={6}>
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
                    name="projectCode"
                    label="Project Code"
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
                <Grid item md={6}>
                  <TextField
                    name="projectType"
                    label="Project Type"
                    required
                    select
                    value={formik.values.projectType}
                    error={Boolean(
                      formik.touched.projectType && formik.errors.projectType
                    )}
                    fullWidth
                    helperText={
                      formik.touched.projectType && formik.errors.projectType
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Project Type
                    </MenuItem>
                    {!isLoading
                      ? projectTypesData.data.map((option) => (
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
                    name="shortTitle"
                    label="Project Short Title"
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
                <Grid item md={6}>
                  <TextField
                    name="longTitle"
                    label="Project Long Title"
                    required
                    multiline
                    rows={3}
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
              <Grid container spacing={4}>
                <Grid item md={4}>
                  <DatePicker
                    label="Start Date"
                    value={formik.values.startingDate}
                    onChange={(value) =>
                      formik.setFieldValue("startingDate", value, true)
                    }
                    renderInput={(params) => (
                      <TextField
                        error={Boolean(
                          formik.touched.startingDate &&
                            formik.errors.startingDate
                        )}
                        helperText={
                          formik.touched.startingDate &&
                          formik.errors.startingDate
                        }
                        margin="normal"
                        name="startingDate"
                        variant="outlined"
                        fullWidth
                        my={2}
                        {...params}
                      />
                    )}
                  />
                </Grid>
                <Grid item md={4}>
                  <DatePicker
                    label="End Date"
                    value={formik.values.endingDate}
                    onChange={(value) =>
                      formik.setFieldValue("endingDate", value, true)
                    }
                    renderInput={(params) => (
                      <TextField
                        error={Boolean(
                          formik.touched.endingDate && formik.errors.endingDate
                        )}
                        helperText={
                          formik.touched.endingDate && formik.errors.endingDate
                        }
                        margin="normal"
                        name="endingDate"
                        variant="outlined"
                        fullWidth
                        my={2}
                        {...params}
                      />
                    )}
                  />
                </Grid>
                <Grid item md={4}>
                  <TextField
                    name="currentStatus"
                    label="Project Type"
                    required
                    select
                    value={formik.values.currentStatus}
                    error={Boolean(
                      formik.touched.currentStatus &&
                        formik.errors.currentStatus
                    )}
                    fullWidth
                    helperText={
                      formik.touched.currentStatus &&
                      formik.errors.currentStatus
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Current Status
                    </MenuItem>
                    {!isLoadingStatuses
                      ? statusesData.data.map((option) => (
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
              <Grid container spacing={6}>
                <Grid item md={6}>
                  <TextField
                    name="projectManagerName"
                    label="Project Manager's Name"
                    required
                    select
                    value={formik.values.projectManagerName}
                    error={Boolean(
                      formik.touched.projectManagerName &&
                        formik.errors.projectManagerName
                    )}
                    fullWidth
                    helperText={
                      formik.touched.projectManagerName &&
                      formik.errors.projectManagerName
                    }
                    onBlur={formik.handleBlur}
                    onChange={(e) => {
                      formik.handleChange(e);
                      formik.setFieldValue(
                        "projectManagerEmail",
                        e.target.value.Company_E_Mail
                      );
                      console.log(e.target.value);
                    }}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Project Manager's Name
                    </MenuItem>
                    {!isLoadingStaffList
                      ? staffListData.data.map((option) => (
                          <MenuItem key={option.Full_Name} value={option}>
                            {option.Full_Name}
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
                    value={formik.values.projectManagerEmail}
                    error={Boolean(
                      formik.touched.projectManagerEmail &&
                        formik.errors.projectManagerEmail
                    )}
                    fullWidth
                    helperText={
                      formik.touched.projectManagerEmail &&
                      formik.errors.projectManagerEmail
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={12}>
                <Grid item md={12}>
                  <Typography variant="h3" gutterBottom display="inline">
                    Financial Details
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item md={3}>
                  <TextField
                    name="totalBudget"
                    label="Overall Budget"
                    type="number"
                    required
                    value={formik.values.totalBudget}
                    error={Boolean(
                      formik.touched.totalBudget && formik.errors.totalBudget
                    )}
                    fullWidth
                    helperText={
                      formik.touched.totalBudget && formik.errors.totalBudget
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  />
                </Grid>
                <Grid item md={3}>
                  <TextField
                    name="currencyTypeId"
                    label="Currency"
                    required
                    select
                    value={formik.values.currencyTypeId}
                    error={Boolean(
                      formik.touched.currencyTypeId &&
                        formik.errors.currencyTypeId
                    )}
                    fullWidth
                    helperText={
                      formik.touched.currencyTypeId &&
                      formik.errors.currencyTypeId
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Currency
                    </MenuItem>
                    {!isLoadingCurrency
                      ? currencyData.data.map((option) => (
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
                <Grid item md={3}>
                  <TextField
                    name="costCentre"
                    label="Cost Centre"
                    select
                    value={formik.values.costCentre}
                    error={Boolean(
                      formik.touched.costCentre && formik.errors.costCentre
                    )}
                    fullWidth
                    helperText={
                      formik.touched.costCentre && formik.errors.costCentre
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Cost Centre
                    </MenuItem>
                  </TextField>
                </Grid>
                <Grid item md={3}>
                  <TextField
                    name="donors"
                    label="Donors"
                    select
                    required
                    value={formik.values.donors}
                    error={Boolean(
                      formik.touched.donors && formik.errors.donors
                    )}
                    fullWidth
                    helperText={formik.touched.donors && formik.errors.donors}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Donors
                    </MenuItem>
                    {!isLoadingDonor
                      ? donorData.data.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.donorInitial}
                          </MenuItem>
                        ))
                      : []}
                  </TextField>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item md={3}>
                  <TextField
                    name="recipientTypeId"
                    label="Recipient Type"
                    required
                    select
                    value={formik.values.recipientTypeId}
                    error={Boolean(
                      formik.touched.recipientTypeId &&
                        formik.errors.recipientTypeId
                    )}
                    fullWidth
                    helperText={
                      formik.touched.recipientTypeId &&
                      formik.errors.recipientTypeId
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Currency
                    </MenuItem>
                    {!isLoadingRecipientType
                      ? recipientTypeData.data.map((option) => (
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

const NewProject = () => {
  return (
    <React.Fragment>
      <Helmet title="New Project" />
      <Typography variant="h3" gutterBottom display="inline">
        Project Details
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/project/projects">
          Projects
        </Link>
        <Typography>New Project Details</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <NewProjectForm />
    </React.Fragment>
  );
};

export default NewProject;
