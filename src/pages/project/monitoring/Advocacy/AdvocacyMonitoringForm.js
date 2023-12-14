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
  statusChange: "",
  amrefContribution: "",
  implimentationYear: "",
  description: "",
  actorInvolved: "",
  intendedChange: "",
  reportingFrequency: "",
  bragStatus: "",
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

  const { isLoading: isLoadingStatusChange, data: statusChangeData } = useQuery(
    ["statuschange", "statusChange"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const { isLoading: isLoadingAmrefContribution, data: amrefContributionData } =
    useQuery(
      ["amrefcontribution", "amrefContribution"],
      getLookupMasterItemsByName,
      {
        refetchOnWindowFocus: false,
      }
    );

  const {
    isLoading: isLoadingImplimentationYear,
    data: implimentationYearData,
  } = useQuery(
    ["implimentationyear", "implimentationYear"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const { isLoading: isLoadingActorInvolved, data: actorInvolvedData } =
    useQuery(["actorinvolved", "actorInvolved"], getLookupMasterItemsByName, {
      refetchOnWindowFocus: false,
    });

  const { isLoading: isLoadingBragStatuses, data: bragStatusesData } = useQuery(
    ["bragstatus", "bragStatus"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const mutation = useMutation({ mutationFn: newAdvocacyObjective });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      statusChange: Yup.string().required("Required"),
      implimentationYear: Yup.string().required("Required"),
      amrefContribution: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
      actorInvolved: Yup.string().required("Required"),
      intendedChange: Yup.string().required("Required"),
      reportingFrequency: Yup.string().required("Required"),
      bragStatus: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const saveAdvocacyObjective = {
          id: id ? id : new Guid(),
          createDate: new Date(),
          statusChange: values.statusChange,
          description: values.description,
          implimentationYear: values.implimentationYear,
          amrefContribution: values.amrefContribution,
          reportingFrequency: values.reportingFrequency,
          actorInvolved: values.actorInvolved,
          bragStatus: values.status,
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
          <Grid item md={6}>
            <TextField
              name="implimentationYear"
              label="Implimentation Year"
              select
              value={formik.values.implimentationYear}
              error={Boolean(
                formik.touched.implimentationYear &&
                  formik.errors.implimentationYear
              )}
              fullWidth
              helperText={
                formik.touched.implimentationYear &&
                formik.errors.implimentationYear
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            >
              <MenuItem disabled value="">
                Implimentation Year
              </MenuItem>
              {!isLoadingImplimentationYear
                ? implimentationYearData.data.map((option) => (
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
              name="reportingFrequency"
              label="Frequency"
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
            <TextField
              name="statusChange"
              label="Actual change in status of advocacy/policy during the reporting period "
              select
              value={formik.values.statusChange}
              error={Boolean(
                formik.touched.statusChange && formik.errors.statusChange
              )}
              fullWidth
              helperText={
                formik.touched.statusChange && formik.errors.statusChange
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            >
              <MenuItem disabled value="">
                Status Change
              </MenuItem>
              {!isLoadingStatusChange
                ? statusChangeData.data.map((option) => (
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
              name="amrefContribution"
              label="Contribution of Amref during the reporting period"
              select
              value={formik.values.amrefContribution}
              error={Boolean(
                formik.touched.amrefContribution &&
                  formik.errors.amrefContribution
              )}
              fullWidth
              helperText={
                formik.touched.amrefContribution &&
                formik.errors.amrefContribution
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            >
              <MenuItem disabled value="">
                Amref Contribution
              </MenuItem>
              {!isLoadingAmrefContribution
                ? amrefContributionData.data.map((option) => (
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
              name="description"
              label="Additional description of policy /advocacy progress"
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
              variant="outlined"
              my={2}
              rows={3}
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              name="actorInvolved"
              label="Actors involved during the period"
              select
              value={formik.values.actorInvolved}
              error={Boolean(
                formik.touched.actorInvolved && formik.errors.actorInvolved
              )}
              fullWidth
              helperText={
                formik.touched.actorInvolved && formik.errors.actorInvolved
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            >
              <MenuItem disabled value="">
                Actors Involved
              </MenuItem>
              {!isLoadingActorInvolved
                ? actorInvolvedData.data.map((option) => (
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
              name="bragstatus"
              label="Brag Status"
              select
              value={formik.values.bragstatus}
              error={Boolean(
                formik.touched.bragstatus && formik.errors.bragstatus
              )}
              fullWidth
              helperText={formik.touched.bragstatus && formik.errors.bragstatus}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            >
              <MenuItem disabled value="">
                Status
              </MenuItem>
              {!isLoadingBragStatuses
                ? bragStatusesData.data.map((option) => (
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

const AdvocacyMonitoringForm = () => {
  let { processLevelItemId, processLevelTypeId, id } = useParams();
  return (
    <React.Fragment>
      <Helmet title="Advocacy Objective Monitoring" />
      <Typography variant="h3" gutterBottom display="inline">
        Advocacy Objective Monitoring
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link
          component={NavLink}
          to={`/project/design-project/${processLevelItemId}/${processLevelTypeId}`}
        >
          Advocacy Monitoring
        </Link>
        <Typography>Advocacy Objective Monitoring</Typography>
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

export default AdvocacyMonitoringForm;
