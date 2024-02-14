import React, { useEffect, useState, useCallback } from "react";
import styled from "@emotion/styled";
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  TextField as MuiTextField,
  Autocomplete as MuiAutocomplete,
  Typography,
  Breadcrumbs as MuiBreadcrumbs,
  Divider as MuiDivider,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import * as Yup from "yup";
import { spacing } from "@mui/system";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { Check, Trash as TrashIcon, ChevronLeft } from "react-feather";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdministrativeRoles,
  getAMREFStaffList,
  getLookupMasterItemsByName,
} from "../../../../api/lookup";
import { YEAR_RANGE } from "../../../../constants";
import { getDonors } from "../../../../api/donor";
import { getAllThematicAreas } from "../../../../api/thematic-area";
import { getOrganizationUnits } from "../../../../api/organization-unit";
import { getAmrefEntities } from "../../../../api/amref-entity";
import { getInnovationById, newInnovation } from "../../../../api/innovation";
import { newInnovationDonor } from "../../../../api/innovation-donor";
import {
  newInnovationStaff,
  getInnovationStaff,
} from "../../../../api/innovation-staff";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { getProjectRoles } from "../../../../api/project-role";

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
  staffId: "",
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
      staffId: Yup.object().required("Required"),
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
                id="staffId"
                options={!isLoadingStaffList ? staffListData.data : []}
                getOptionLabel={(option) => {
                  if (!option) {
                    return ""; // Return an empty string for null or undefined values
                  }
                  return `${option.emailAddress}`;
                }}
                renderOption={(props, option) => {
                  return (
                    <li {...props} key={option.id}>
                      {option ? `${option.emailAddress}` : ""}
                    </li>
                  );
                }}
                onChange={(e, val) => {
                  formik.setFieldValue("staffId", val);
                  formik.setFieldValue(
                    "staffDetailsName",
                    `${val.firstName} ${val.lastName}`
                  );
                }}
                value={formik.values.staffId}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={Boolean(
                      formik.touched.staffId && formik.errors.staffId
                    )}
                    fullWidth
                    helperText={formik.touched.staffId && formik.errors.staffId}
                    label="Staff Email"
                    name="staffId"
                    variant="outlined"
                    my={2}
                  />
                )}
              />
            </Grid>
            <Grid item md={3}>
              <TextField
                name="staffDetailsName"
                value={formik.values.staffDetailsName}
                error={Boolean(
                  formik.touched.staffDetailsName &&
                    formik.errors.staffDetailsName
                )}
                fullWidth
                helperText={
                  formik.touched.staffDetailsName &&
                  formik.errors.staffDetailsName
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                label="Staff Name"
                variant="outlined"
                my={2}
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
                {!isLoadingAdministrativeRoles
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

const EditInnovationForm = ({ id, onActionChange }) => {
  const [openAddStaffDetails, setOpenAddStaffDetails] = useState(false);
  const [staffDetailsList, setStaffDetailsList] = useState([]);
  const queryClient = useQueryClient();

  const {
    data: InnovationData,
    isLoading: isLoadingInnovationData,
    isError: isErrorInnovationData,
  } = useQuery(["getInnovationById", id], getInnovationById, { enabled: !!id });

  const { isLoading: isLoadingCurrency, data: currencyData } = useQuery(
    ["currencyType", "CurrencyType"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );
  const { data: aimsRolesData, isLoading: isLoadingAimsRole } = useQuery(
    ["getProjectRoles"],
    getProjectRoles,
    {
      refetchOnWindowFocus: false,
    }
  );
  const {
    isLoading: isLoadingAdministrativeRoles,
    isError: isErrorAdministrativeRoles,
    data: administrativeRoles,
  } = useQuery(["administrativeRoles"], getAdministrativeRoles, {
    refetchOnWindowFocus: false,
  });
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

  const {
    isLoading: isLoadingAmrefEntities,
    data: amrefEntities,
    isError: isErrorAmrefEntities,
  } = useQuery(["amrefEntities"], getAmrefEntities, {
    refetchOnWindowFocus: false,
  });

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

  const innovationStaffMutation = useMutation({
    mutationFn: newInnovationStaff,
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      title: Yup.string().required("Required"),
      shortTitle: Yup.string().required("Required"),
      startDate: Yup.date().required("Required"),
      endDate: Yup.date().required("Required"),
      extensionDate: Yup.date().when("endDate", (endDate, schema) => {
        return endDate
          ? schema.min(endDate, "Must be after End Date").nullable()
          : schema;
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
        const saveInnovation = {
          id: id,
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
        };
        await mutation.mutateAsync(saveInnovation);

        let innovationDonors = [];
        for (const donor of values.donors) {
          const innovationDonor = {
            donorId: donor.id,
            innovationId: id,
            createDate: new Date(),
          };
          innovationDonors.push(innovationDonor);
        }
        await innovationDonorsMutation.mutateAsync(innovationDonors);

        const projectRoles = [];
        for (const staffDetail of staffDetailsList) {
          const projectRole = {
            innovationId: id,
            aimsRoleId: staffDetail.staffDetailsAIMSRole.id,
            aimsRoleName: staffDetail.staffDetailsAIMSRole.name,
            createDate: new Date(),
            dqaRoleId: staffDetail.staffDetailsWorkFlowTask.roleId,
            dqaRoleName: staffDetail.staffDetailsWorkFlowTask.roleName,
            isPrimary:
              staffDetail.primaryRole === "" ? false : staffDetail.primaryRole,
            staffNames: staffDetail.staffDetailsName,
            staffId: staffDetail.staffId.personId,
            void: false,
          };
          projectRoles.push(projectRole);
        }

        await innovationStaffMutation.mutateAsync(projectRoles);

        toast("Successfully Updated an Innovation", {
          type: "success",
        });
        await queryClient.invalidateQueries(["getInnovations"]);

        handleActionChange(0, true);
      } catch (error) {
        console.log(error);
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  function removeStaff(row) {
    setStaffDetailsList((current) =>
      current.filter((staff) => staff.staffDetailsName !== row.staffDetailsName)
    );
  }

  const handleStaffDetailsAdd = (values) => {
    setStaffDetailsList((current) => [...current, values]);
  };

  useEffect(() => {
    function setCurrentFormValues() {
      if (!isLoadingInnovationData && !isErrorInnovationData) {
        let staffId;
        let staffEmail;
        if (!isLoadingStaffList && InnovationData.data.staffNameId) {
          staffId = staffListData.data.find(
            (obj) => obj.id === InnovationData.data.staffNameId
          );

          staffEmail = staffId.emailAddress;
        }

        let reviewerId;
        let reviewerEmail;
        if (!isLoadingStaffList && InnovationData.data.technicalReviewerId) {
          reviewerId = staffListData.data.find(
            (obj) => obj.id === InnovationData.data.technicalReviewerId
          );

          reviewerEmail = reviewerId.emailAddress;
        }

        let donorsList = [];
        if (!isLoadingDonor && InnovationData.data.donors) {
          for (const donor of InnovationData.data.donors) {
            const result = donorData.data.find(
              (obj) => obj.id === donor.donorId
            );
            if (result) {
              donorsList.push(result);
            }
          }
        }

        formik.setValues({
          title: InnovationData.data.title,
          shortTitle: InnovationData.data.shortTitle,
          startDate: InnovationData.data.startDate,
          endDate: InnovationData.data.endDate,
          extensionDate: InnovationData.data.extensionDate,
          staffNameId: staffId ? staffId : "",
          leadStaffEmail: staffEmail ? staffEmail : "",
          technicalReviewerId: reviewerId ? reviewerId : "",
          technicalReviewerEmailAddress: reviewerEmail ? reviewerEmail : "",
          implementingOfficeId: InnovationData.data.implementingOfficeId,
          regionalProgrammeId: InnovationData.data.regionalProgrammeId,
          enaSupportOffice: InnovationData.data.office,
          totalBudget: InnovationData.data.totalBudget,
          costCenter: InnovationData.data.costCenter,
          currencyTypeId: InnovationData.data.currencyTypeId,
          status: InnovationData.data.statusId,
          donors: donorsList,
        });

        if (InnovationData.data.staff && InnovationData.data.staff.length > 0) {
          const allStaff = [];
          for (const staffData of InnovationData.data.staff) {
            const lookupRole =
              !isLoadingAimsRole &&
              aimsRolesData.data.filter(
                (obj) => obj.id === staffData.aimsRoleId
              );
            const staff = {
              id: staffData.id,
              staffId: staffData.staffId,
              staffDetailsName: staffData.staffNames,
              staffDetailsAIMSRole:
                lookupRole && lookupRole.length > 0 ? lookupRole[0] : "",
              staffDetailsWorkFlowTask: {
                roleId: staffData.dqaRoleId,
                roleName: staffData.dqaRoleName,
              },
              primaryRole: staffData.isPrimary,
            };
            allStaff.push(staff);
          }
          setStaffDetailsList(allStaff);
        }
      }
    }
    setCurrentFormValues();
  }, [
    InnovationData,
    isLoadingInnovationData,
    isErrorInnovationData,
    isLoadingStaffList,
    isErrorStaffList,
    staffListData,
    amrefEntities,
  ]);

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
                  label="Lead Staff name"
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
          <Grid container spacing={12} pt={10}>
            <Grid item md={12}>
              <Typography variant="h5" gutterBottom display="inline">
                Staff Details
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenAddStaffDetails(true)}
              >
                <AddIcon /> Staff Details
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={12}>
            <Grid item md={12}>
              <Paper>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Staff Name</TableCell>
                      <TableCell align="right">Project Role</TableCell>
                      <TableCell align="right">DQA Workflow Role</TableCell>
                      <TableCell align="right">Primary Role</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {staffDetailsList.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell component="th" scope="row">
                          {row.staffDetailsName}
                        </TableCell>
                        <TableCell align="right">
                          {row.staffDetailsAIMSRole.name}
                        </TableCell>
                        <TableCell align="right">
                          {row.staffDetailsWorkFlowTask.roleName}
                        </TableCell>
                        <TableCell align="right">
                          {row.primaryRole ? "Yes" : "No"}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            startIcon={<TrashIcon />}
                            size="small"
                            onClick={() => removeStaff(row)}
                          ></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          </Grid>

          <Grid item mt={5} md={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              mt={3}
              onClick={() => handleActionChange()}
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
      <Dialog
        fullWidth={true}
        maxWidth="md"
        open={openAddStaffDetails}
        onClose={() => setOpenAddStaffDetails(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Staff Details</DialogTitle>
        <DialogContent>
          <DialogContentText>Add Staff Details</DialogContentText>
          <StaffDetailsForm
            aimsRolesData={aimsRolesData}
            administrativeRoles={administrativeRoles}
            isLoading={isLoadingAimsRole}
            isLoadingAdministrativeRoles={isLoadingAdministrativeRoles}
            isErrorAdministrativeRoles={isErrorAdministrativeRoles}
            staffListData={staffListData}
            isLoadingStaffList={isLoadingStaffList}
            isErrorStaffList={isErrorStaffList}
            handleClick={handleStaffDetailsAdd}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddStaffDetails(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

const Innovation = (props) => {
  return (
    <React.Fragment>
      <Typography variant="h5" gutterBottom display="inline">
        Edit Innovation
      </Typography>
      <Divider my={2} />
      <Card mb={2}>
        <CardContent>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <EditInnovationForm
                id={props.id}
                onActionChange={props.onActionChange}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default Innovation;
