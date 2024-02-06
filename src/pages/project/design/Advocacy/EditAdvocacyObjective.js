import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Grid,
  MenuItem,
  TextField as MuiTextField,
  Autocomplete as MuiAutocomplete,
  Typography,
  Link,
  Breadcrumbs as MuiBreadcrumbs,
  Divider as MuiDivider,
  Box,
  CircularProgress,
} from "@mui/material";
import * as Yup from "yup";
import { spacing } from "@mui/system";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { Check } from "react-feather";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLookupMasterItemsByName } from "../../../../api/lookup";
import {
  newAdvocacyObjective,
  getAdvocacyObjectiveById,
} from "../../../../api/advocacy-objective";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Guid } from "../../../../utils/guid";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Autocomplete = styled(MuiAutocomplete)(spacing);
const Button = styled(MuiButton)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const Divider = styled(MuiDivider)(spacing);

const initialValues = {
  typeOfInitiativeId: "",
  typeOfPolicyAdvocacyId: "",
  nameOfTopic: "",
  kindOfInfluenceId: "",
  targetStatusId: "",
  reportingFrequencyId: "",
  startStatusId: "",
};

const AdvocacyObjectiveForm = ({ id, editId }) => {
  console.log("id .." + id);
  console.log("editId .." + editId);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    data: AdvocacyObjectiveData,
    isLoading: isLoadingAdvocacyObjectiveData,
    isError: isErrorAdvocacyObjectiveData,
  } = useQuery(["getAdvocacyObjectiveById", editId], getAdvocacyObjectiveById, {
    enabled: !!editId,
  });

  const { isLoading: isLoadingStatuses, data: statusesData } = useQuery(
    ["status", "status"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );
  const {
    isLoading: isLoadingReportingFrequency,
    data: reportingFrequencyData,
  } = useQuery(
    ["reportingFrequency", "reportingFrequency"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const { isLoading: isLoadingInitiativeType, data: initiativeTypeData } =
    useQuery(["initiativetype", "initiativeType"], getLookupMasterItemsByName, {
      refetchOnWindowFocus: false,
    });

  const { isLoading: isLoadingPolicyType, data: policyTypeData } = useQuery(
    ["policytype", "policyType"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const { isLoading: isLoadingInfluence, data: influenceData } = useQuery(
    ["influence", "influence"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const { isLoading: isLoadingIntendedChange, data: intendedChangeData } =
    useQuery(["intendedchange", "intendedChange"], getLookupMasterItemsByName, {
      refetchOnWindowFocus: false,
    });

  const mutation = useMutation({ mutationFn: newAdvocacyObjective });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      nameOfTopic: Yup.string().required("Required"),
      typeOfInitiativeId: Yup.string().required("Required"),
      kindOfInfluenceId: Yup.string().required("Required"),
      targetStatusId: Yup.string().required("Required"),
      reportingFrequencyId: Yup.string().required("Required"),
      typeOfPolicyAdvocacyId: Yup.string().required("Required"),
      startStatusId: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const saveAdvocacyObjective = {
          id: editId,
          typeOfInitiativeId: values.typeOfInitiativeId,
          kindOfInfluenceId: values.kindOfInfluenceId,
          typeOfPolicyAdvocacyId: values.typeOfPolicyAdvocacyId,
          nameOfTopic: values.nameOfTopic,
          reportingFrequencyId: values.reportingFrequencyId,
          targetStatusId: values.targetStatusId,
          startStatusId: values.startStatusId,
        };

        await mutation.mutateAsync(saveAdvocacyObjective);

        toast("Successfully Updated an Advocacy Objective", {
          type: "success",
        });
        await queryClient.invalidateQueries(["getAdvocacyObjectiveById"]);
        navigate(`/project/design/advocacy/advocacy-detail/${id}`);
      } catch (error) {
        console.log(error);
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  useEffect(() => {
    function setCurrentFormValues() {
      if (!isLoadingAdvocacyObjectiveData && !isErrorAdvocacyObjectiveData) {
        formik.setValues({
          typeOfInitiativeId: AdvocacyObjectiveData.data.typeOfInitiativeId,
          kindOfInfluenceId: AdvocacyObjectiveData.data.kindOfInfluenceId,
          typeOfPolicyAdvocacyId:
            AdvocacyObjectiveData.data.typeOfPolicyAdvocacyId,
          nameOfTopic: AdvocacyObjectiveData.data.nameOfTopic,
          reportingFrequencyId: AdvocacyObjectiveData.data.reportingFrequencyId,
          targetStatusId: AdvocacyObjectiveData.data.targetStatusId,
          startStatusId: AdvocacyObjectiveData.data.startStatusId,
        });
      }
    }
    setCurrentFormValues();
  }, [isErrorAdvocacyObjectiveData, isLoadingAdvocacyObjectiveData]);

  return (
    <form onSubmit={formik.handleSubmit}>
      {formik.isSubmitting ? (
        <Box display="flex" justifyContent="center" my={6}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container item spacing={2}>
          <Grid item md={12}>
            <TextField
              name="typeOfInitiativeId"
              label="Type of Initiative"
              select
              value={formik.values.typeOfInitiativeId}
              error={Boolean(
                formik.touched.typeOfInitiativeId &&
                  formik.errors.typeOfInitiativeId
              )}
              fullWidth
              helperText={
                formik.touched.typeOfInitiativeId &&
                formik.errors.typeOfInitiativeId
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            >
              <MenuItem disabled value="">
                Initiative Type
              </MenuItem>
              {!isLoadingInitiativeType
                ? initiativeTypeData.data.map((option) => (
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
          <Grid item md={12}>
            <TextField
              name="typeOfPolicyAdvocacyId"
              label="Type of Policy"
              select
              value={formik.values.typeOfPolicyAdvocacyId}
              error={Boolean(
                formik.touched.typeOfPolicyAdvocacyId &&
                  formik.errors.typeOfPolicyAdvocacyId
              )}
              fullWidth
              helperText={
                formik.touched.typeOfPolicyAdvocacyId &&
                formik.errors.typeOfPolicyAdvocacyId
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            >
              <MenuItem disabled value="">
                Policy Type
              </MenuItem>
              {!isLoadingPolicyType
                ? policyTypeData.data.map((option) => (
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
          <Grid item md={12}>
            <TextField
              name="nameOfTopic"
              label="Name (topic) of policy/ advocacy initiative"
              value={formik.values.nameOfTopic}
              error={Boolean(
                formik.touched.nameOfTopic && formik.errors.nameOfTopic
              )}
              fullWidth
              helperText={
                formik.touched.nameOfTopic && formik.errors.nameOfTopic
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              multiline
              variant="outlined"
              my={2}
              rows={3}
            />
          </Grid>
          <Grid item md={4}>
            <TextField
              name="kindOfInfluenceId"
              label="Kind of Influence"
              select
              value={formik.values.kindOfInfluenceId}
              error={Boolean(
                formik.touched.kindOfInfluenceId &&
                  formik.errors.kindOfInfluenceId
              )}
              fullWidth
              helperText={
                formik.touched.kindOfInfluenceId &&
                formik.errors.kindOfInfluenceId
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            >
              <MenuItem disabled value="">
                Status
              </MenuItem>
              {!isLoadingInfluence
                ? influenceData.data.map((option) => (
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
              name="startStatusId"
              label="Status"
              select
              value={formik.values.startStatusId}
              error={Boolean(
                formik.touched.startStatusId && formik.errors.startStatusId
              )}
              fullWidth
              helperText={
                formik.touched.startStatusId && formik.errors.startStatusId
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            >
              <MenuItem disabled value="">
                Status
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
          <Grid item md={4}>
            <TextField
              name="targetStatusId"
              label="Intended (targeted) change in status"
              select
              value={formik.values.targetStatusId}
              error={Boolean(
                formik.touched.targetStatusId && formik.errors.targetStatusId
              )}
              fullWidth
              helperText={
                formik.touched.targetStatusId && formik.errors.targetStatusId
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            >
              <MenuItem disabled value="">
                Status
              </MenuItem>
              {!isLoadingIntendedChange
                ? intendedChangeData.data.map((option) => (
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
          <Grid item md={12}>
            <TextField
              name="reportingFrequencyId"
              label="Reporting Frequency"
              select
              value={formik.values.reportingFrequencyId}
              error={Boolean(
                formik.touched.reportingFrequencyId &&
                  formik.errors.reportingFrequencyId
              )}
              fullWidth
              helperText={
                formik.touched.reportingFrequencyId &&
                formik.errors.reportingFrequencyId
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            >
              <MenuItem disabled value="">
                Reporting Frequency
              </MenuItem>
              {!isLoadingReportingFrequency
                ? reportingFrequencyData.data.map((option) => (
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
          <Grid item md={12}>
            <Button type="submit" variant="contained" color="primary" mt={3}>
              <Check /> Save changes
            </Button>
          </Grid>
        </Grid>
      )}
    </form>
  );
};

const AdvocacyObjective = () => {
  let { id, editId } = useParams();
  return (
    <React.Fragment>
      <Helmet title="New Advocacy Objective" />
      <Typography variant="h3" gutterBottom display="inline">
        Edit Advocacy Objective
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link
          component={NavLink}
          to={`/project/design/advocacy/advocacy-detail/${id}`}
        >
          Advocacy Design
        </Link>
        <Typography>Edit Advocacy Objective</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <AdvocacyObjectiveForm id={id} editId={editId} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default AdvocacyObjective;
