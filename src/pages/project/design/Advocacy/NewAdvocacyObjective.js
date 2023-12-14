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
  title: "",
  shortTitle: "",
  initiativeType: "",
  influence: "",
  intendedChange: "",
  reportingFrequency: "",
  policyType: "",
  status: "",
};

const AdvocacyObjectiveForm = ({
  processLevelItemId,
  processLevelTypeId,
  id,
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    data: AdvocacyObjectiveData,
    isLoading: isLoadingAdvocacyObjectiveData,
    isError: isErrorAdvocacyObjectiveData,
  } = useQuery(["getAdvocacyObjectiveById", id], getAdvocacyObjectiveById, {
    enabled: !!id,
  });
  const { isLoading: isLoadingCurrency, data: currencyData } = useQuery(
    ["currencyType", "CurrencyType"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );
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
      title: Yup.string().required("Required"),
      initiativeType: Yup.string().required("Required"),
      influence: Yup.string().required("Required"),
      intendedChange: Yup.string().required("Required"),
      reportingFrequency: Yup.string().required("Required"),
      policyType: Yup.string().required("Required"),
      status: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const saveAdvocacyObjective = {
          id: id ? id : new Guid(),
          createDate: new Date(),
          initiativeType: values.initiativeType,
          influence: values.influence,
          policyType: values.policyType,
          title: values.title,
          reportingFrequency: values.reportingFrequency,
          intendedChange: values.intendedChange,
          statusId: values.status,
          processLevelItemId: processLevelItemId,
          processLevelTypeId: processLevelTypeId,
        };

        const advocacyObjective = await mutation.mutateAsync(
          saveAdvocacyObjective
        );

        toast("Successfully Created an Advocacy Objective", {
          type: "success",
        });
        await queryClient.invalidateQueries(["getAdvocacyObjectiveById"]);
        navigate(`/project/design/advocacy/advocacy-objective/`);
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
              name="initiativeType"
              label="Type of Initiative"
              select
              value={formik.values.initiativeType}
              error={Boolean(
                formik.touched.initiativeType && formik.errors.initiativeType
              )}
              fullWidth
              helperText={
                formik.touched.initiativeType && formik.errors.initiativeType
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
              name="policyType"
              label="Type of Policy"
              select
              value={formik.values.status}
              error={Boolean(
                formik.touched.policyType && formik.errors.policyType
              )}
              fullWidth
              helperText={formik.touched.policyType && formik.errors.policyType}
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
              name="title"
              label="Name (topic) of policy/ advocacy initiative"
              value={formik.values.title}
              error={Boolean(formik.touched.title && formik.errors.title)}
              fullWidth
              helperText={formik.touched.title && formik.errors.title}
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
              name="influence"
              label="Kind of Influence"
              select
              value={formik.values.influence}
              error={Boolean(
                formik.touched.influence && formik.errors.influence
              )}
              fullWidth
              helperText={formik.touched.influence && formik.errors.influence}
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
              name="status"
              label="Status"
              select
              value={formik.values.status}
              error={Boolean(formik.touched.status && formik.errors.status)}
              fullWidth
              helperText={formik.touched.status && formik.errors.status}
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
              name="intendedChange"
              label="Intended (targeted) change in status"
              select
              value={formik.values.status}
              error={Boolean(
                formik.touched.intendedChange && formik.errors.intendedChange
              )}
              fullWidth
              helperText={
                formik.touched.intendedChange && formik.errors.intendedChange
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
              name="reportingFrequency"
              label="Reporting Frequency"
              select
              value={formik.values.reportingFrequency}
              error={Boolean(
                formik.touched.reportingFrequency &&
                  formik.errors.reportingFrequency
              )}
              fullWidth
              helperText={
                formik.touched.reportingFrequency &&
                formik.errors.reportingFrequency
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
  let { processLevelItemId, processLevelTypeId, id } = useParams();
  return (
    <React.Fragment>
      <Helmet title="New Advocacy Objective" />
      <Typography variant="h3" gutterBottom display="inline">
        New Advocacy Objective
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link
          component={NavLink}
          to={`/project/design-project/${processLevelItemId}/${processLevelTypeId}`}
        >
          Project Design
        </Link>
        <Typography>New Advocacy Objective</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <AdvocacyObjectiveForm
                processLevelItemId={processLevelItemId}
                processLevelTypeId={processLevelTypeId}
                id={id}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default AdvocacyObjective;
