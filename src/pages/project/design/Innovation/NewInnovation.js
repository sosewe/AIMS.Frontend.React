import React, { useEffect, useCallback } from "react";
import styled from "@emotion/styled";
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
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
import SelectSearch from "react-select-search";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import * as Yup from "yup";
import { spacing } from "@mui/system";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { Check } from "react-feather";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { YEAR_RANGE } from "../../../../constants";
import {
  getAMREFStaffList,
  getLookupMasterItemsByName,
} from "../../../../api/lookup";
import { getDonors } from "../../../../api/donor";
import { getOrganizationUnits } from "../../../../api/organization-unit";
import { getAmrefEntities } from "../../../../api/amref-entity";
import { getInnovationById, newInnovation } from "../../../../api/innovation";
import { newInnovationDonor } from "../../../../api/innovation-donor";
import { NavLink, useNavigate, useParams } from "react-router-dom";

import { Helmet } from "react-helmet-async";
import { Guid } from "../../../../utils/guid";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Autocomplete = styled(MuiAutocomplete)(spacing);
const Button = styled(MuiButton)(spacing);
const Divider = styled(MuiDivider)(spacing);

const initialValues = {
  title: "",
  shortTitle: "",
  startDate: "",
  endDate: "",
  extensionDate: "",
  status: "",
  staffNameId: "",
  emailAddress: "",
  technicalReviewerId: "",
  technicalReviewerEmailAddress: "",
  implementingOfficeId: "",
  regionalProgrammeId: "",
  enaSupportOffice: "",
  totalBudget: "",
  currencyTypeId: "",
  costCentre: "",
  donors: [], // multiple select
};

const staffDetailsInitial = {
  staffDetailsName: "",
  staffDetailsAIMSRole: "",
  staffDetailsWorkFlowTask: "",
  primaryRole: false,
};

const StaffDetailsForm = ({
  aimsRolesData,
  administrativeRoles,
  isLoading,
  isLoadingAdministrativeRoles,
  isErrorAdministrativeRoles,
  staffListData,
  isLoadingStaffList,
  isErrorStaffList,
  handleClick,
}) => {
  const formik = useFormik({
    initialValues: staffDetailsInitial,
    validationSchema: Yup.object().shape({
      staffDetailsName: Yup.string().required("Required"),
      staffDetailsAIMSRole: Yup.object().required("Required"),
      staffDetailsWorkFlowTask: Yup.object().required("Required"),
      primaryRole: Yup.boolean().required("Required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        handleClick(values);
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      } finally {
        resetForm();
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={3}>
              <Autocomplete
                id="staffDetailsName"
                options={!isLoadingStaffList ? staffListData.data : []}
                getOptionLabel={(option) => {
                  if (!option) {
                    return ""; // Return an empty string for null or undefined values
                  }
                  return `${option.firstName} ${option.lastName}`;
                }}
                renderOption={(props, option) => {
                  return (
                    <li {...props} key={option.id}>
                      {option ? `${option.firstName} ${option.lastName}` : ""}
                    </li>
                  );
                }}
                onChange={(e, val) => {
                  formik.setFieldValue("staffDetailsName", val);
                }}
                value={formik.values.staffDetailsName}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={Boolean(
                      formik.touched.staffDetailsName &&
                        formik.errors.staffDetailsName
                    )}
                    fullWidth
                    helperText={
                      formik.touched.staffDetailsName &&
                      formik.errors.staffDetailsName
                    }
                    label="Name"
                    name="staffDetailsName"
                    variant="outlined"
                    my={2}
                  />
                )}
              />
            </Grid>
            <Grid item md={3}>
              <TextField
                name="staffDetailsAIMSRole"
                label="Project Role"
                required
                select
                value={formik.values.staffDetailsAIMSRole}
                error={Boolean(
                  formik.touched.staffDetailsAIMSRole &&
                    formik.errors.staffDetailsAIMSRole
                )}
                fullWidth
                helperText={
                  formik.touched.staffDetailsAIMSRole &&
                  formik.errors.staffDetailsAIMSRole
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
              >
                <MenuItem disabled value="">
                  Select Project Role
                </MenuItem>
                {!isLoading
                  ? aimsRolesData.data.map((option) => (
                      <MenuItem key={option.id} value={option}>
                        {option.name}
                      </MenuItem>
                    ))
                  : []}
              </TextField>
            </Grid>
            <Grid item md={3}>
              <TextField
                name="staffDetailsWorkFlowTask"
                label="DQA Work Flow Role"
                required
                select
                value={formik.values.staffDetailsWorkFlowTask}
                error={Boolean(
                  formik.touched.staffDetailsWorkFlowTask &&
                    formik.errors.staffDetailsWorkFlowTask
                )}
                fullWidth
                helperText={
                  formik.touched.staffDetailsWorkFlowTask &&
                  formik.errors.staffDetailsWorkFlowTask
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
              >
                <MenuItem disabled value="">
                  Select DQA Work Flow Role
                </MenuItem>
                {!isLoadingAdministrativeRoles && !isErrorAdministrativeRoles
                  ? administrativeRoles.data.map((option) => (
                      <MenuItem key={option.roleId} value={option}>
                        {option.roleName}
                      </MenuItem>
                    ))
                  : []}
              </TextField>
            </Grid>
            <Grid item md={2}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.primaryRole}
                      onChange={formik.handleChange}
                      name="primaryRole"
                    />
                  }
                  label="Primary Role?"
                />
              </FormGroup>
            </Grid>
            <Grid item md={1}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                mt={3}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};

const InnovationForm = ({
  processLevelItemId,
  processLevelTypeId,
  onActionChange,
}) => {
  const queryClient = useQueryClient();

  const { isLoading: isLoadingCurrency, data: currencyData } = useQuery(
    ["currencyType", "CurrencyType"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
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
  const { isLoading: isLoadingStatuses, data: statusesData } = useQuery(
    ["status", "status"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );
  const { isLoading: isLoadingOrgUnits, data: orgUnitsData } = useQuery(
    ["organizationUnits"],
    getOrganizationUnits,
    {
      refetchOnWindowFocus: false,
    }
  );
  const { isLoading: isLoadingRegProg, data: regProgData } = useQuery(
    ["regionalProgramme", "RegionalProgramme"],
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
  const { isLoading: isLoadingAmrefEntities, data: amrefEntities } = useQuery(
    ["amrefEntities"],
    getAmrefEntities,
    {
      refetchOnWindowFocus: false,
    }
  );

  const handleActionChange = useCallback(
    (event) => {
      onActionChange({ id: 0, status: 1 });
    },
    [onActionChange]
  );

  const mutation = useMutation({ mutationFn: newInnovation });

  const innovationDonorsMutation = useMutation({
    mutationFn: newInnovationDonor,
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      title: Yup.string().required("Required"),
      shortTitle: Yup.string().required("Required"),
      startDate: Yup.date().required("Required"),
      endDate: Yup.date().required("Required"),
      extensionDate: Yup.date().when("endDate", (endDate, schema) => {
        return endDate ? schema.min(endDate, "Must be after End Date") : schema;
      }),
      staffNameId: Yup.object().required("Required"),
      technicalReviewerId: Yup.object().required("Required"),
      implementingOfficeId: Yup.string().required("Required"),
      regionalProgrammeId: Yup.string().required("Required"),
      totalBudget: Yup.number()
        .required("Required")
        .positive("Must be positive"),
      currencyTypeId: Yup.string().required("Required"),
      costCenter: Yup.string().required("Required"),
      status: Yup.string().required("Required"),
      donors: Yup.array().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const guid = new Guid();
        const saveInnovation = {
          id: guid.toString(),
          createDate: new Date(),
          title: values.title,
          shortTitle: values.shortTitle,
          startDate: values.startDate,
          endDate: values.endDate,
          extensionDate: values.extensionDate,
          staffNameId: values.staffNameId.id,
          technicalReviewerId: values.technicalReviewerId.id,
          implementingOfficeId: values.implementingOfficeId,
          regionalProgrammeId: values.regionalProgrammeId,
          office: values.enaSupportOffice,
          totalBudget: values.totalBudget,
          currencyTypeId: values.currencyTypeId,
          costCenter: values.costCenter,
          statusId: values.status,
          processLevelItemId: processLevelItemId,
          processLevelTypeId: processLevelTypeId,
        };
        const innovation = await mutation.mutateAsync(saveInnovation);

        let innovationDonors = [];
        for (const donor of values.donors) {
          const innovationDonor = {
            donorId: donor.id,
            innovationId: innovation.data.id,
            createDate: new Date(),
          };
          innovationDonors.push(innovationDonor);
        }
        await innovationDonorsMutation.mutateAsync(innovationDonors);

        toast("Successfully Created an Innovation", {
          type: "success",
        });
        await queryClient.invalidateQueries(["getInnovations"]);

        handleActionChange(false, 0);
      } catch (error) {
        console.log(error);
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  useEffect(() => {}, []);

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
              name="title"
              label="Innovation Name"
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
          <Grid item md={12}>
            <TextField
              name="shortTitle"
              label="Innovation Short Title"
              value={formik.values.shortTitle}
              error={Boolean(
                formik.touched.shortTitle && formik.errors.shortTitle
              )}
              fullWidth
              helperText={formik.touched.shortTitle && formik.errors.shortTitle}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              multiline
              variant="outlined"
              my={2}
              rows={3}
            />
          </Grid>
          <Grid item md={4}>
            <DatePicker
              label="Start Date"
              value={formik.values.startDate || null}
              minDate={YEAR_RANGE.MIN_YEAR}
              maxDate={YEAR_RANGE.MAX_YEAR}
              onChange={(value) =>
                formik.setFieldValue("startDate", value, true)
              }
              renderInput={(params) => (
                <TextField
                  error={Boolean(
                    formik.touched.startDate && formik.errors.startDate
                  )}
                  helperText={
                    formik.touched.startDate && formik.errors.startDate
                  }
                  margin="normal"
                  name="startDate"
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
              value={formik.values.endDate || null}
              minDate={YEAR_RANGE.MIN_YEAR}
              maxDate={YEAR_RANGE.MAX_YEAR}
              onChange={(value) => formik.setFieldValue("endDate", value, true)}
              renderInput={(params) => (
                <TextField
                  error={Boolean(
                    formik.touched.endDate && formik.errors.endDate
                  )}
                  helperText={formik.touched.endDate && formik.errors.endDate}
                  margin="normal"
                  name="endDate"
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
              label="Extension Date"
              value={formik.values.extensionDate || null}
              minDate={YEAR_RANGE.MIN_YEAR}
              maxDate={YEAR_RANGE.MAX_YEAR}
              onChange={(value) =>
                formik.setFieldValue("extensionDate", value, true)
              }
              renderInput={(params) => (
                <TextField
                  error={Boolean(
                    formik.touched.extensionDate && formik.errors.extensionDate
                  )}
                  helperText={
                    formik.touched.extensionDate && formik.errors.extensionDate
                  }
                  margin="normal"
                  name="endDate"
                  variant="outlined"
                  fullWidth
                  my={2}
                  {...params}
                />
              )}
            />
          </Grid>
          <Grid item md={4}>
            <Autocomplete
              id="staffNameId"
              options={!isLoadingStaffList ? staffListData.data : []}
              getOptionLabel={(option) => {
                if (!option) {
                  return ""; // Return an empty string for null or undefined values
                }
                return `${option.firstName} ${option.lastName}`;
              }}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id}>
                    {option ? `${option.firstName} ${option.lastName}` : ""}
                  </li>
                );
              }}
              onChange={(e, val) => {
                formik.setFieldValue("staffNameId", val);
                formik.setFieldValue("leadStaffEmail", val.emailAddress);
              }}
              value={formik.values.staffNameId}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={Boolean(
                    formik.touched.staffNameId && formik.errors.staffNameId
                  )}
                  fullWidth
                  helperText={
                    formik.touched.staffNameId && formik.errors.staffNameId
                  }
                  label="Lead Staff Name"
                  name="staffNameId"
                  variant="outlined"
                  my={2}
                />
              )}
            />
          </Grid>
          <Grid item md={4}>
            <TextField
              name="leadStaffEmail"
              // label="Lead staff email address"
              value={formik.values.leadStaffEmail}
              error={Boolean(
                formik.touched.leadStaffEmail && formik.errors.leadStaffEmail
              )}
              fullWidth
              helperText={
                formik.touched.leadStaffEmail && formik.errors.leadStaffEmail
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            />
          </Grid>
          <Grid item md={4}>
            <TextField
              name="implementingOfficeId"
              label="Implementing Office"
              select
              value={formik.values.implementingOfficeId}
              error={Boolean(
                formik.touched.implementingOfficeId &&
                  formik.errors.implementingOfficeId
              )}
              fullWidth
              helperText={
                formik.touched.implementingOfficeId &&
                formik.errors.implementingOfficeId
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            >
              <MenuItem disabled value="">
                Select Implementing Office
              </MenuItem>
              {!isLoadingOrgUnits
                ? orgUnitsData.data.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))
                : []}
            </TextField>
          </Grid>
          <Grid item md={4}>
            <Autocomplete
              id="technicalReviewerId"
              options={!isLoadingStaffList ? staffListData.data : []}
              getOptionLabel={(option) => {
                if (!option) {
                  return ""; // Return an empty string for null or undefined values
                }
                return `${option.firstName} ${option.lastName}`;
              }}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id}>
                    {option ? `${option.firstName} ${option.lastName}` : ""}
                  </li>
                );
              }}
              onChange={(e, val) => {
                formik.setFieldValue("technicalReviewerId", val);
                formik.setFieldValue(
                  "technicalReviewerEmailAddress",
                  val.emailAddress
                );
              }}
              value={formik.values.technicalReviewerId}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={Boolean(
                    formik.touched.technicalReviewerId &&
                      formik.errors.technicalReviewerId
                  )}
                  fullWidth
                  helperText={
                    formik.touched.technicalReviewerId &&
                    formik.errors.technicalReviewerId
                  }
                  label="Technical Reviewer"
                  name="technicalReviewerId"
                  variant="outlined"
                  my={2}
                />
              )}
            />
          </Grid>
          <Grid item md={4}>
            <TextField
              name="technicalReviewerEmailAddress"
              // label="Lead staff email address"
              value={formik.values.technicalReviewerEmailAddress}
              error={Boolean(
                formik.touched.technicalReviewerEmailAddress &&
                  formik.errors.technicalReviewerEmailAddress
              )}
              fullWidth
              helperText={
                formik.touched.technicalReviewerEmailAddress &&
                formik.errors.technicalReviewerEmailAddress
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            />
          </Grid>
          <Grid item md={4}>
            <TextField
              name="regionalProgrammeId"
              label="Regional Programme"
              select
              value={formik.values.regionalProgrammeId}
              error={Boolean(
                formik.touched.regionalProgrammeId &&
                  formik.errors.regionalProgrammeId
              )}
              fullWidth
              helperText={
                formik.touched.regionalProgrammeId &&
                formik.errors.regionalProgrammeId
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            >
              <MenuItem disabled value="">
                Select Regional Programme
              </MenuItem>
              {!isLoadingRegProg
                ? regProgData.data.map((option) => (
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
              name="enaSupportOffice"
              label="E/NA Supporting Office"
              select
              value={formik.values.enaSupportOffice}
              error={Boolean(
                formik.touched.enaSupportOffice &&
                  formik.errors.enaSupportOffice
              )}
              fullWidth
              helperText={
                formik.touched.enaSupportOffice &&
                formik.errors.enaSupportOffice
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            >
              <MenuItem disabled value="">
                Select E/NA Supporting Office
              </MenuItem>
              {!isLoadingAmrefEntities
                ? amrefEntities.data.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))
                : []}
            </TextField>
          </Grid>
          <Grid item md={4}>
            <TextField
              name="totalBudget"
              label="Overall Budget"
              type="number"
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
          <Grid item md={4}>
            <TextField
              name="currencyTypeId"
              label="Currency"
              select
              value={formik.values.currencyTypeId}
              error={Boolean(
                formik.touched.currencyTypeId && formik.errors.currencyTypeId
              )}
              fullWidth
              helperText={
                formik.touched.currencyTypeId && formik.errors.currencyTypeId
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
          <Grid item md={4}>
            <TextField
              name="costCenter"
              label="Cost Center Name"
              value={formik.values.costCenter}
              error={Boolean(
                formik.touched.costCenter && formik.errors.costCenter
              )}
              fullWidth
              helperText={formik.touched.costCenter && formik.errors.costCenter}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              multiline
              variant="outlined"
              my={2}
            />
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
            <Autocomplete
              id="donors"
              multiple
              options={!isLoadingDonor ? donorData.data : []}
              getOptionLabel={(option) => {
                if (!option) {
                  return ""; // Return an empty string for null or undefined values
                }
                return `${option.donorName}`;
              }}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id}>
                    {option?.donorName}
                  </li>
                );
              }}
              onChange={(e, val) => {
                formik.setFieldValue("donors", val);
              }}
              value={formik.values.donors}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={Boolean(formik.touched.donors && formik.errors.donors)}
                  fullWidth
                  helperText={formik.touched.donors && formik.errors.donors}
                  label="Donors"
                  name="donors"
                  variant="outlined"
                  my={2}
                />
              )}
            />
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

const Innovation = ({ onActionChange }) => {
  let { id, processLevelTypeId } = useParams();
  return (
    <React.Fragment>
      <Helmet title="New Innovation" />
      <Typography variant="h5" gutterBottom display="inline">
        New Innovation
      </Typography>
      <Divider my={2} />
      <Card mb={2}>
        <CardContent>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <InnovationForm
                processLevelItemId={id}
                processLevelTypeId={processLevelTypeId}
                onActionChange={onActionChange}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default Innovation;
