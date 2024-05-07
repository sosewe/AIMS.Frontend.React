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
  Link,
  Breadcrumbs as MuiBreadcrumbs,
  Divider as MuiDivider,
  Box,
  CircularProgress,
  InputLabel,
  FormControl,
  Select,
  OutlinedInput,
  Stack,
  Chip,
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
import { getAdministrativeProgrammes } from "../../../../api/administrative-programme";
import { getDonors } from "../../../../api/donor";
import { getOrganizationUnits } from "../../../../api/organization-unit";
import { getAmrefEntities } from "../../../../api/amref-entity";
import {
  getTechnicalAssistanceByTechnicalAssistanceId,
  newTechnicalAssistance,
} from "../../../../api/technical-assistance";
import { newTechnicalAssistanceDonor } from "../../../../api/technical-assistance-donor";
import { newTechnicalAssistancePartner } from "../../../../api/technical-assistance-partner";
import { newTechnicalAssistanceStaff } from "../../../../api/technical-assistance-staff";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { getProjectRoles } from "../../../../api/project-role";

import { Helmet } from "react-helmet-async";
import { Guid } from "../../../../utils/guid";
import useKeyCloakAuth from "../../../../hooks/useKeyCloakAuth";
import { parseISO } from "date-fns";

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
  goal: "",
  startDate: "",
  endDate: "",
  extensionDate: "",
  status: "",
  staffNameId: "",
  emailAddress: "",
  implementingOfficeId: "",
  regionalProgrammeId: "",
  enaSupportOffice: "",
  totalBudget: "",
  currencyTypeId: "",
  costCentre: "",
  donors: [], // multiple select
  partners: [], // multiple select
  administrativeProgrammeId: "",
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

const EditTechnicalAssistanceForm = ({ id, onActionChange }) => {
  const [openAddStaffDetails, setOpenAddStaffDetails] = useState(false);
  const [staffDetailsList, setStaffDetailsList] = useState([]);
  const queryClient = useQueryClient();
  const user = useKeyCloakAuth();
  const {
    data: TechnicalAssistanceData,
    isLoading: isLoadingTechnicalAssistanceData,
    isError: isErrorTechnicalAssistanceData,
  } = useQuery(
    ["getTechnicalAssistanceByTechnicalAssistanceId", id],
    getTechnicalAssistanceByTechnicalAssistanceId,
    { enabled: !!id }
  );
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
  const { isLoading: isLoadingAdminProg, data: adminProgData } = useQuery(
    ["AdministrativeProgramme"],
    getAdministrativeProgrammes,
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
  const { isLoading: isLoadingPartner, data: partnerData } = useQuery(
    ["partnerType", "PartnerType"],
    getLookupMasterItemsByName,
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

  const mutation = useMutation({ mutationFn: newTechnicalAssistance });

  const technicalAssistanceDonorsMutation = useMutation({
    mutationFn: newTechnicalAssistanceDonor,
  });

  const technicalAssistancePartnersMutation = useMutation({
    mutationFn: newTechnicalAssistancePartner,
  });

  const technicalAssistanceStaffMutation = useMutation({
    mutationFn: newTechnicalAssistanceStaff,
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      title: Yup.string().required("Required"),
      shortTitle: Yup.string().required("Required"),
      goal: Yup.string().required("Required"),
      startDate: Yup.date().required("Required"),
      endDate: Yup.date().required("Required"),
      extensionDate: Yup.date().when("endDate", (endDate, schema) => {
        return endDate
          ? schema.min(endDate, "Must be after End Date").nullable()
          : schema;
      }),
      staffNameId: Yup.object().required("Required"),
      implementingOfficeId: Yup.string().required("Required"),
      regionalProgrammeId: Yup.string().required("Required"),
      administrativeProgrammeId: Yup.string().required("Required"),
      totalBudget: Yup.number()
        .required("Required")
        .positive("Must be positive"),
      currencyTypeId: Yup.string().required("Required"),
      costCenter: Yup.string().required("Required"),
      status: Yup.string().required("Required"),
      donors: Yup.array().required("Required"),
      partners: Yup.array().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const saveTechnicalAssistance = {
          id: id,
          createDate: new Date(),
          title: values.title,
          shortTitle: values.shortTitle,
          goal: values.goal,
          startDate: values.startDate,
          endDate: values.endDate,
          extensionDate: values.extensionDate,
          staffNameId: values.staffNameId.id,
          implementingOfficeId: values.implementingOfficeId,
          regionalProgrammeId: values.regionalProgrammeId,
          administrativeProgrammeId: values.administrativeProgrammeId,
          office: values.enaSupportOffice,
          totalBudget: values.totalBudget,
          currencyTypeId: values.currencyTypeId,
          costCenter: values.costCenter,
          status: values.status,
          userId: user.sub,
        };
        await mutation.mutateAsync(saveTechnicalAssistance);

        let technicalAssistanceDonors = [];
        for (const donor of values.donors) {
          const technicalAssistanceDonor = {
            donorId: donor.id,
            technicalAssistanceId: id,
            createDate: new Date(),
            userId: user.sub,
          };
          technicalAssistanceDonors.push(technicalAssistanceDonor);
        }
        await technicalAssistanceDonorsMutation.mutateAsync(
          technicalAssistanceDonors
        );

        let technicalAssistancePartners = [];
        for (const partner of values.partners) {
          const technicalAssistancePartner = {
            partnerId: partner.id,
            technicalAssistanceId: id,
            createDate: new Date(),
            userId: user.sub,
          };
          technicalAssistancePartners.push(technicalAssistancePartner);
        }
        await technicalAssistancePartnersMutation.mutateAsync(
          technicalAssistancePartners
        );

        const technicalAssistanceStaff = [];
        for (const staffDetail of staffDetailsList) {
          const projectRole = {
            technicalAssistanceId: id,
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
            userId: user.sub,
          };
          technicalAssistanceStaff.push(projectRole);
        }
        await technicalAssistanceStaffMutation.mutateAsync(
          technicalAssistanceStaff
        );

        toast("Successfully Created a Technical Assistance", {
          type: "success",
        });
        await queryClient.invalidateQueries([
          "getTechnicalAssistanceByTechnicalAssistanceId",
        ]);
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
      if (
        !isLoadingTechnicalAssistanceData &&
        !isErrorTechnicalAssistanceData &&
        TechnicalAssistanceData
      ) {
        let staffId;
        let staffEmail;
        if (!isLoadingStaffList) {
          staffId = staffListData.data.find(
            (obj) => obj.id === TechnicalAssistanceData.data.staffNameId
          );
          if (staffId != null) {
            staffEmail = staffId.emailAddress;
          }
        }

        let enaSupportOffice;
        if (!isLoadingAmrefEntities) {
          enaSupportOffice = amrefEntities.data.find(
            (obj) => obj.id === TechnicalAssistanceData.data.office
          );
        }

        let implementingOffice;
        if (!isLoadingOrgUnits) {
          implementingOffice = orgUnitsData.data.find(
            (obj) =>
              obj.id === TechnicalAssistanceData.data.implementingOfficeId
          );
        }

        let currencyType;
        if (!isLoadingCurrency) {
          currencyType = currencyData.data.find(
            (obj) => obj.id === TechnicalAssistanceData.data.currencyTypeId
          );
        }

        let donorsList = [];
        if (!isLoadingDonor) {
          for (const donor of TechnicalAssistanceData.data.donors) {
            const result = donorData.data.find(
              (obj) => obj.id === donor.donorId
            );
            if (result) {
              donorsList.push(result);
            }
          }
        }

        let partnersList = [];
        if (!isLoadingPartner) {
          for (const partner of TechnicalAssistanceData.data
            .technicalAssistancePartners) {
            const result = partnerData.data.find(
              (obj) => obj.id === partner.partnerId
            );
            if (result) {
              partnersList.push(result);
            }
          }
        }

        formik.setValues({
          title: TechnicalAssistanceData.data.title,
          shortTitle: TechnicalAssistanceData.data.shortTitle,
          goal: TechnicalAssistanceData.data.goal,
          startDate: parseISO(TechnicalAssistanceData.data.startDate),
          endDate: parseISO(TechnicalAssistanceData.data.endDate),
          extensionDate: parseISO(TechnicalAssistanceData.data.extensionDate),
          status: TechnicalAssistanceData.data.status,
          staffNameId: staffId ? staffId : "",
          leadStaffEmail: staffEmail ? staffEmail : "",
          implementingOfficeId: implementingOffice ? implementingOffice.id : "",
          enaSupportOffice: enaSupportOffice ? enaSupportOffice.id : "",
          regionalProgrammeId: TechnicalAssistanceData.data.regionalProgrammeId,
          administrativeProgrammeId:
            TechnicalAssistanceData.data.administrativeProgrammeId,
          totalBudget: TechnicalAssistanceData.data.totalBudget,
          costCenter: TechnicalAssistanceData.data.costCenter,
          currencyTypeId: TechnicalAssistanceData.data.currencyTypeId,
          donors: donorsList,
          partners: partnersList,
        });

        if (
          TechnicalAssistanceData.data.staff &&
          TechnicalAssistanceData.data.staff.length > 0
        ) {
          const allStaff = [];
          for (const staffData of TechnicalAssistanceData.data.staff) {
            const lookupRole =
              !isLoadingAimsRole &&
              aimsRolesData.data.filter(
                (obj) => obj.id === staffData.aimsRoleId
              );
            const staff = {
              id: staffData.id,
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
    TechnicalAssistanceData,
    isLoadingTechnicalAssistanceData,
    isErrorTechnicalAssistanceData,
    isLoadingStaffList,
    isErrorStaffList,
    staffListData,
    amrefEntities,
    isLoadingAmrefEntities,
    isLoadingOrgUnits,
    isLoadingCurrency,
    isLoadingDonor,
    isLoadingPartner,
    orgUnitsData,
    currencyData,
    donorData,
    partnerData,
    isLoadingAimsRole,
    aimsRolesData,
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
              label="Technical Assistance Name"
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
              label="Technical Assistance Short Title"
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
          <Grid item md={12}>
            <TextField
              name="goal"
              label="Technical Assistance Goal"
              value={formik.values.goal}
              error={Boolean(formik.touched.goal && formik.errors.goal)}
              fullWidth
              helperText={formik.touched.goal && formik.errors.goal}
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
              onChange={(value) => formik.setFieldValue("endDate", value, true)}
              renderInput={(params) => (
                <TextField
                  error={Boolean(
                    formik.touched.startDate && formik.errors.endDate
                  )}
                  helperText={formik.touched.startDate && formik.errors.endDate}
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
              onChange={(value) =>
                formik.setFieldValue("extensionDate", value, true)
              }
              renderInput={(params) => (
                <TextField
                  error={Boolean(
                    formik.touched.startDate && formik.errors.extensionDate
                  )}
                  helperText={
                    formik.touched.startDate && formik.errors.extensionDate
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
              name="administrativeProgrammeId"
              label="Administrative Programme"
              select
              value={formik.values.administrativeProgrammeId}
              error={Boolean(
                formik.touched.administrativeProgrammeId &&
                  formik.errors.administrativeProgrammeId
              )}
              fullWidth
              helperText={
                formik.touched.administrativeProgrammeId &&
                formik.errors.administrativeProgrammeId
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            >
              <MenuItem disabled value="">
                Select Administrative Programme
              </MenuItem>
              {!isLoadingAdminProg
                ? adminProgData.data.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.shortTitle}
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

          <Grid item md={4}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel>Partners</InputLabel>
              <Select
                fullWidth
                multiple
                value={formik.values.partners}
                onChange={(e) => {
                  const selectedPartners = Array.isArray(e.target.value)
                    ? e.target.value
                    : [e.target.value]; // Ensure it's always an array
                  formik.setFieldValue("partners", selectedPartners);
                }}
                input={<OutlinedInput label="Multiple Select" />}
                renderValue={(selected) => (
                  <Stack gap={1} direction="row" flexWrap="wrap">
                    {selected.map((value) => (
                      <Chip
                        key={value.lookupItemId}
                        label={value.lookupItemName}
                        onDelete={() =>
                          formik.setFieldValue(
                            "partners",
                            formik.values.partners.filter(
                              (item) => item !== value
                            )
                          )
                        }
                        deleteIcon={
                          <CancelIcon
                            onMouseDown={(event) => event.stopPropagation()}
                          />
                        }
                      />
                    ))}
                  </Stack>
                )}
                my={2}
              >
                {!isLoadingPartner
                  ? partnerData.data.map((option) => (
                      <MenuItem key={option.lookupItemId} value={option}>
                        {option.lookupItemName}
                      </MenuItem>
                    ))
                  : []}
              </Select>
            </FormControl>
          </Grid>
          <Grid container spacing={12} pt={10}>
            <Grid item md={12}>
              <Typography variant="h3" gutterBottom display="inline">
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
            <Button type="submit" variant="contained" color="primary" mt={3}>
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

const TechnicalAssistance = (props) => {
  return (
    <React.Fragment>
      <Helmet title="Edit TechnicalAssistance" />
      <Typography variant="h3" gutterBottom display="inline">
        Basic Information
      </Typography>
      <Divider my={6} />
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <EditTechnicalAssistanceForm
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

export default TechnicalAssistance;
