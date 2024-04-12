import React, { useEffect, useCallback } from "react";
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
import { Check, Trash as TrashIcon, ChevronLeft } from "react-feather";
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

const AdvocacyObjectiveForm = (props) => {
  const id = props.id;
  const onAdvocacyActionChange = props.onAdvocacyActionChange;
  const queryClient = useQueryClient();
  const {
    data: AdvocacyObjectiveData,
    isLoading: isLoadingAdvocacyObjectiveData,
    isError: isErrorAdvocacyObjectiveData,
  } = useQuery(["getAdvocacyObjectiveById", id], getAdvocacyObjectiveById, {
    enabled: !!id,
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
    useQuery(["initiativetype", "InitiativeType"], getLookupMasterItemsByName, {
      refetchOnWindowFocus: false,
    });

  const { isLoading: isLoadingPolicyType, data: policyTypeData } = useQuery(
    ["policytype", "PolicyType"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const { isLoading: isLoadingInfluence, data: influenceData } = useQuery(
    ["influence", "Influence"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const { isLoading: isLoadingIntendedChange, data: intendedChangeData } =
    useQuery(["intendedchange", "IntendedChange"], getLookupMasterItemsByName, {
      refetchOnWindowFocus: false,
    });

  const handleAdvocacyActionChange = useCallback(
    (id, status) => {
      onAdvocacyActionChange({ id: 0, status: 1 });
    },
    [onAdvocacyActionChange]
  );

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
          id: new Guid(),
          createDate: new Date(),
          advocacyId: id,
          typeOfInitiativeId: values.typeOfInitiativeId,
          kindOfInfluenceId: values.kindOfInfluenceId,
          typeOfPolicyAdvocacyId: values.typeOfPolicyAdvocacyId,
          nameOfTopic: values.nameOfTopic,
          reportingFrequencyId: values.reportingFrequencyId,
          targetStatusId: values.targetStatusId,
          startStatusId: values.startStatusId,
        };

        await mutation.mutateAsync(saveAdvocacyObjective);

        toast("Successfully Created an Advocacy Objective", {
          type: "success",
        });
        await queryClient.invalidateQueries(["getAdvocacyObjectiveById"]);

        handleAdvocacyActionChange();
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
        let status;
        if (!!isLoadingStatuses) {
          status = status.data.find(
            (obj) => obj.id === AdvocacyObjectiveData.data.status
          );
        }

        formik.setValues({});
      }
    }
    setCurrentFormValues();
  }, []);

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
          <Grid item mt={5} md={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              mt={3}
              onClick={() => handleAdvocacyActionChange()}
            >
              <ChevronLeft /> Back
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              mt={3}
              ml={3}
            >
              <Check /> Save Changes
            </Button>
          </Grid>
        </Grid>
      )}
    </form>
  );
};

const NewAdvocacyObjective = (props) => {
  return (
    <React.Fragment>
      <Helmet title="New Advocacy Objective" />
      <Typography variant="h5" gutterBottom display="inline">
        New Advocacy Objective
      </Typography>

      <Divider my={6} />
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <AdvocacyObjectiveForm
                id={props.id}
                processLevelItemId={props.processLevelItemId}
                processLevelTypeId={props.processLevelTypeId}
                onAdvocacyActionChange={props.onAdvocacyActionChange}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default NewAdvocacyObjective;
