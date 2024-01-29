import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import styled from "@emotion/styled";
import {
  Box,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  Paper as MuiPaper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Check } from "react-feather";
import { spacing } from "@mui/system";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  getAdministrativeRoles,
  getAMREFStaffList,
  getLookupMasterItemsByName,
} from "../../../api/lookup";
import { DatePicker } from "@mui/x-date-pickers";
import { getDonors } from "../../../api/donor";
import { getOrganizationUnits } from "../../../api/organization-unit";
import { getAmrefEntities } from "../../../api/amref-entity";
import { getAdministrativeProgrammes } from "../../../api/administrative-programme";
import { getProjectById, newProject } from "../../../api/project";
import {
  GetDonorByProcessLevelIdAndProcessLevelTypeId,
  newDonorProcessLevel,
} from "../../../api/donor-process-level";
import {
  getProcessLevelContactByProcessLevelItemId,
  newProcessLevelContact,
} from "../../../api/process-level-contact";
import {
  getProcessLevelRoleByProcessLevelItemId,
  newProcessLevelRole,
} from "../../../api/process-level-role";
import {
  getProjectAdministrativeProgramme,
  newProjectAdministrativeProgramme,
} from "../../../api/project-administrative-programme";
import {
  getImplementingOrganisationByProcessLevelItemIdAndProcessLevelTypeId,
  newImplementingOrganisation,
} from "../../../api/implementing-organisation";
import {
  getOfficeInvolvedByProcessLevelItemId,
  newOfficeInvolvedProcessLevel,
} from "../../../api/office-involved";
import { Guid } from "../../../utils/guid";
import { useNavigate } from "react-router-dom";
import CostCentreForm from "./CostCentreForm";
import {
  getProcessLevelCostCentreByProcessLevelItemId,
  newProcessLevelCostCentre,
} from "../../../api/process-level-cost-centre";
import { getProjectRoles } from "../../../api/project-role";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);
const Paper = styled(MuiPaper)(spacing);

const staffDetailsInitial = {
  staffDetailsName: "",
  staffDetailsAIMSRole: "",
  staffDetailsWorkFlowTask: "",
  primaryRole: false,
};
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
  personnelId: "",
  projectManagerEmail: "",
  totalBudget: "",
  currencyTypeId: "",
  costCentre: "",
  donors: "",
  recipientTypeId: "",
  projectOrganisationUnitId: "",
  regionalProgrammeId: "",
  eNASupportingOffice: "",
  administrativeProgramme: "",
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
      staffDetailsName: Yup.object().required("Required"),
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
              <TextField
                name="staffDetailsName"
                label="Name"
                select
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
                variant="outlined"
                my={2}
              >
                <MenuItem disabled value="">
                  Select Name
                </MenuItem>
                {!isLoadingStaffList &&
                !isErrorStaffList &&
                staffListData.data &&
                staffListData.data.length > 0
                  ? staffListData.data.map((option) => (
                      <MenuItem key={option.id} value={option}>
                        {option.firstName} {option.lastName}
                      </MenuItem>
                    ))
                  : []}
              </TextField>
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

const NewProjectForm = ({ id }) => {
  const navigate = useNavigate();
  const [errorSet, setIsErrorSet] = useState(false);
  const [open, setOpen] = useState(false);
  const [openCostCentre, setOpenCostCentre] = useState(false);
  const [staffDetailsArray, setStaffDetailsArray] = useState([]);
  const [costCentreArray, setCostCentreArray] = useState([]);
  let processLevelTypeId;
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
  const { data: ProjectData } = useQuery(
    ["getProjectById", id],
    getProjectById,
    {
      refetchOnWindowFocus: false,
      enabled: !!id,
    }
  );
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
  const {
    isLoading: isLoadingStaffList,
    isError: isErrorStaffList,
    data: staffListData,
  } = useQuery(["staffList"], getAMREFStaffList, {
    refetchOnWindowFocus: false,
    retry: 0,
  });
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
  const { isLoading: isLoadingProcessLevelType, data: processLevelData } =
    useQuery(
      ["processLevelType", "ProcessLevelType"],
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
  const { isLoading: isLoadingAdminProgrammes, data: adminProgrammes } =
    useQuery(["administrativeProgrammes"], getAdministrativeProgrammes, {
      refetchOnWindowFocus: false,
    });

  if (isErrorStaffList && !errorSet) {
    setIsErrorSet(true);
    toast("Error loading staff list", {
      type: "error",
    });
  }

  if (!isLoadingProcessLevelType) {
    const projectProcessLevel = processLevelData.data.filter(
      (obj) => obj.lookupItemName === "Project"
    );
    if (projectProcessLevel.length > 0) {
      processLevelTypeId = projectProcessLevel[0].lookupItemId;
    }
  }

  const { data: donorProcessLevelData } = useQuery(
    ["donorProcessLevel", id, processLevelTypeId],
    GetDonorByProcessLevelIdAndProcessLevelTypeId,
    {
      refetchOnWindowFocus: false,
      enabled: !!processLevelTypeId && !!id,
    }
  );
  const { data: implementingOrganizationsData } = useQuery(
    [
      "implementingOrganizationByProcessLevelItemIdAndProcessLevelTypeId",
      id,
      processLevelTypeId,
    ],
    getImplementingOrganisationByProcessLevelItemIdAndProcessLevelTypeId,
    {
      refetchOnWindowFocus: false,
      enabled: !!processLevelTypeId && !!id,
    }
  );
  const { data: administrativeProgrammeByProject } = useQuery(
    ["getAdministrativeProgrammeByProjectId", id],
    getProjectAdministrativeProgramme,
    {
      refetchOnWindowFocus: false,
      enabled: !!id,
    }
  );
  const { data: officeInvolvedeNAData } = useQuery(
    ["eNAOfficeInvolvedQuery", id],
    getOfficeInvolvedByProcessLevelItemId,
    {
      refetchOnWindowFocus: false,
      enabled: !!id,
    }
  );
  const { data: processLevelRolesData } = useQuery(
    ["processLevelRolesQuery", id],
    getProcessLevelRoleByProcessLevelItemId,
    {
      refetchOnWindowFocus: false,
      enabled: !!id,
    }
  );
  const { data: processLevelContactsData } = useQuery(
    ["processLevelContactsQuery", id],
    getProcessLevelContactByProcessLevelItemId,
    {
      refetchOnWindowFocus: false,
      enabled: !!id,
    }
  );
  const { data: processLevelCostCentreData } = useQuery(
    ["getProcessLevelCostCentreByProcessLevelItemId", id],
    getProcessLevelCostCentreByProcessLevelItemId,
    { enabled: !!id }
  );

  const mutation = useMutation({ mutationFn: newProject });
  const donorProcessMutation = useMutation({
    mutationFn: newDonorProcessLevel,
  });
  const processLevelContactMutation = useMutation({
    mutationFn: newProcessLevelContact,
  });
  const processLevelRoleMutation = useMutation({
    mutationFn: newProcessLevelRole,
  });
  const administrativeProgrammeMutation = useMutation({
    mutationFn: newProjectAdministrativeProgramme,
  });
  const implementingOrganizationMutation = useMutation({
    mutationFn: newImplementingOrganisation,
  });
  const officeInvolvedMutation = useMutation({
    mutationFn: newOfficeInvolvedProcessLevel,
  });
  const processLevelCostCentreMutation = useMutation({
    mutationFn: newProcessLevelCostCentre,
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      projectCode: Yup.string().required("Required"),
      projectType: Yup.string().required("Required"),
      shortTitle: Yup.string().required("Required"),
      longTitle: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
      goal: Yup.string().required("Required"),
      startingDate: Yup.date().required("Required"),
      endingDate: Yup.date().required("Required"),
      currentStatus: Yup.string().required("Required"),
      personnelId: Yup.object(),
      projectManagerEmail: Yup.string(),
      totalBudget: Yup.number().integer().required("Required"),
      currencyTypeId: Yup.string().required("Required"),
      costCentre: "",
      donors: Yup.string().required("Required"),
      recipientTypeId: Yup.string().required("Required"),
      projectOrganisationUnitId: Yup.string().required("Required"),
      regionalProgrammeId: Yup.string().required("Required"),
      eNASupportingOffice: Yup.string().required("Required"),
      administrativeProgramme: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      values.createDate = new Date();
      if (id) {
        values.id = id;
      } else {
        values.id = new Guid().toString();
      }
      try {
        const project = await mutation.mutateAsync(values);

        const projectDonor = {
          createDate: new Date(),
          donorId: values.donors,
          processLevelId: project.data.id,
          processLevelTypeId: processLevelTypeId,
          void: false,
        };
        const projectContact = {
          createDate: new Date(),
          personnelId: values.personnelId.id,
          processLevelItemId: project.data.id,
          processLevelTypeId: processLevelTypeId,
          void: false,
        };
        const projectAdministrativeProgramme = {
          administrativeProgrammeId: values.administrativeProgramme,
          createDate: new Date(),
          projectId: project.data.id,
        };
        const projectImplementingOrganization = {
          createDate: new Date(),
          organizationId: values.projectOrganisationUnitId,
          processLevelItemId: project.data.id,
          processLevelTypeId: processLevelTypeId,
          projectManager: "",
          void: false,
        };
        const eNAOfficeInvolved = {
          createDate: new Date(),
          processLevelItemId: project.data.id,
          processLevelTypeId: processLevelTypeId,
          office: values.eNASupportingOffice,
          entityTypeId: values.eNASupportingOffice,
        };

        const projectRoles = [];
        for (const staffDetailsArrayElement of staffDetailsArray) {
          const projectRole = {
            aimsRoleId: staffDetailsArrayElement.staffDetailsAIMSRole.id,
            createDate: new Date(),
            dqaRoleId: staffDetailsArrayElement.staffDetailsWorkFlowTask.roleId,
            dqaRoleName:
              staffDetailsArrayElement.staffDetailsWorkFlowTask.roleName,
            isPrimary:
              staffDetailsArrayElement.primaryRole === ""
                ? false
                : staffDetailsArrayElement.primaryRole,
            processLevelId: project.data.id,
            processLevelTypeId: processLevelTypeId,
            staffNames:
              staffDetailsArrayElement.staffDetailsName.firstName +
              " " +
              staffDetailsArrayElement.staffDetailsName.lastName,
            void: false,
            staffId: staffDetailsArrayElement.staffDetailsName.id,
          };
          if (staffDetailsArrayElement.id) {
            projectRole.id = staffDetailsArrayElement.id;
          }
          projectRoles.push(projectRole);
        }

        const processLevelCostCentres = [];
        for (const costCentre of costCentreArray) {
          const processLevelCostCentre = {
            id: new Guid().toString(),
            createDate: new Date(),
            processLevelTypeId: processLevelTypeId,
            processLevelId: project.data.id,
            costCentreCode: costCentre.name,
          };
          processLevelCostCentres.push(processLevelCostCentre);
        }

        await donorProcessMutation.mutateAsync(projectDonor);
        await administrativeProgrammeMutation.mutateAsync(
          projectAdministrativeProgramme
        );
        await implementingOrganizationMutation.mutateAsync(
          projectImplementingOrganization
        );
        await processLevelRoleMutation.mutateAsync(projectRoles);
        await officeInvolvedMutation.mutateAsync(eNAOfficeInvolved);
        await processLevelContactMutation.mutateAsync(projectContact);
        await processLevelCostCentreMutation.mutateAsync(
          processLevelCostCentres
        );
        toast("Successfully Created an Project", {
          type: "success",
        });
        navigate("/project/projects");
      } catch (error) {
        if (error.response !== undefined) {
          toast(error.response.data, {
            type: "error",
          });
        } else {
          if (error.response !== undefined) {
            toast(error.response.data, {
              type: "error",
            });
          } else {
            toast(error, {
              type: "error",
            });
          }
        }
      }
    },
  });

  const handleClick = (values) => {
    setStaffDetailsArray((current) => [...current, values]);
  };

  const handleCostCentreAdd = (values) => {
    setCostCentreArray((current) => [...current, values]);
  };

  function removeStaff(row) {
    setStaffDetailsArray((current) =>
      current.filter((staff) => staff.staffDetailsName !== row.staffDetailsName)
    );
  }

  function removeCostCentre(row) {
    setCostCentreArray((current) =>
      current.filter((obj) => obj.name !== row.name)
    );
  }

  // console.log(processLevelRolesData);
  useEffect(() => {
    function setCurrentFormValues() {
      if (ProjectData) {
        let managerName;
        if (
          !isLoadingStaffList &&
          !isErrorStaffList &&
          processLevelContactsData &&
          processLevelContactsData.data.length > 0
        ) {
          managerName = staffListData.data.filter(
            (obj) => obj.id === processLevelContactsData.data[0].personnelId
          );
        }
        formik.setValues({
          projectCode: ProjectData.data.projectCode,
          projectType: ProjectData.data.projectType,
          shortTitle: ProjectData.data.shortTitle,
          longTitle: ProjectData.data.longTitle,
          description: ProjectData.data.description,
          goal: ProjectData.data.goal,
          startingDate: new Date(ProjectData.data.startingDate),
          endingDate: new Date(ProjectData.data.endingDate),
          currentStatus: ProjectData.data.currentStatus,
          personnelId:
            managerName && managerName.length > 0 ? managerName[0] : "",
          projectManagerEmail:
            managerName && managerName.length > 0
              ? managerName[0].emailAddress
              : "",
          //check email
          totalBudget: ProjectData.data.totalBudget,
          currencyTypeId: ProjectData.data.currencyTypeId,
          //cost center
          //donors
          donors:
            donorProcessLevelData && donorProcessLevelData.data.length > 0
              ? donorProcessLevelData && donorProcessLevelData.data[0].donorId
              : "",
          recipientTypeId: ProjectData.data.recipientTypeId,
          //implementing offices
          projectOrganisationUnitId:
            implementingOrganizationsData &&
            implementingOrganizationsData.data.length > 0
              ? implementingOrganizationsData.data[0].organizationId
              : "",
          //regional programme
          regionalProgrammeId: ProjectData.data.regionalProgrammeId,
          //e/na
          eNASupportingOffice:
            officeInvolvedeNAData && officeInvolvedeNAData.data.length > 0
              ? officeInvolvedeNAData.data[0].entityTypeId
              : "",
          //administrative programme
          administrativeProgramme: administrativeProgrammeByProject
            ? administrativeProgrammeByProject.data.administrativeProgrammeId
            : "",
        });
        if (processLevelRolesData && processLevelRolesData.data.length > 0) {
          const allStaff = [];
          for (const staffData of processLevelRolesData.data) {
            const lookupRole =
              !isLoadingAimsRole &&
              aimsRolesData.data.filter(
                (obj) => obj.id === staffData.aimsRoleId
              );
            const staffNames =
              !isLoadingStaffList && !isErrorStaffList
                ? staffListData.data.find((obj) => obj.id == staffData.staffId)
                : null;
            const staff = {
              id: staffData.id,
              staffDetailsName: staffNames,
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
          setStaffDetailsArray(allStaff);
          console.log(allStaff);
        }
        if (
          processLevelCostCentreData &&
          processLevelCostCentreData.data.length > 0
        ) {
          const processLevelCostCentre = [];
          for (const datum of processLevelCostCentreData.data) {
            processLevelCostCentre.push({ name: datum.costCentreCode });
          }
          setCostCentreArray(processLevelCostCentre);
        }
      }
    }
    setCurrentFormValues();
  }, [
    ProjectData,
    donorProcessLevelData,
    implementingOrganizationsData,
    administrativeProgrammeByProject,
    officeInvolvedeNAData,
    processLevelRolesData,
    processLevelContactsData,
    aimsRolesData,
    isErrorStaffList,
    isLoadingAimsRole,
    isLoadingStaffList,
    staffListData,
    processLevelCostCentreData,
  ]);

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
                    Project Details
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={6}>
                <Grid item md={6}>
                  <TextField
                    name="projectCode"
                    label="Project Code"
                    required
                    value={formik.values.projectCode}
                    error={Boolean(
                      formik.touched.projectCode && formik.errors.projectCode
                    )}
                    fullWidth
                    helperText={
                      formik.touched.projectCode && formik.errors.projectCode
                    }
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
                    label="Current Status"
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
                        "projectManagerEmail",
                        e.target.value.emailAddress
                      );
                    }}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Project Manager's Name
                    </MenuItem>
                    {!isLoadingStaffList &&
                    !isErrorStaffList &&
                    staffListData.data &&
                    staffListData.data.length > 0
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
                            {option.donorName}({option.donorInitial})
                          </MenuItem>
                        ))
                      : []}
                  </TextField>
                </Grid>
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
              <Grid container spacing={12}>
                <Grid item md={12}>
                  <Typography variant="h3" gutterBottom display="inline">
                    Cost Centre
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={12}>
                <Grid item md={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenCostCentre(true)}
                  >
                    <AddIcon /> Add Cost Centre
                  </Button>
                </Grid>
              </Grid>
              <Grid container spacing={12}>
                <Grid item md={12}>
                  <Paper>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Cost Centre Name</TableCell>
                          <TableCell align="right">Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {costCentreArray.map((row) => (
                          <TableRow key={Math.random().toString(36)}>
                            <TableCell component="th" scope="row">
                              {row.name}
                            </TableCell>
                            <TableCell align="right">
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => removeCostCentre(row)}
                              >
                                <DeleteIcon />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Paper>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={12}>
                <Grid item md={12}>
                  <Typography variant="h3" gutterBottom display="inline">
                    Offices
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={4}>
                <Grid item md={4}>
                  <TextField
                    name="projectOrganisationUnitId"
                    label="Implementing Office"
                    required
                    select
                    value={formik.values.projectOrganisationUnitId}
                    error={Boolean(
                      formik.touched.projectOrganisationUnitId &&
                        formik.errors.projectOrganisationUnitId
                    )}
                    fullWidth
                    helperText={
                      formik.touched.projectOrganisationUnitId &&
                      formik.errors.projectOrganisationUnitId
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
                    required
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
                    name="eNASupportingOffice"
                    label="E/NA Supporting Office"
                    required
                    select
                    value={formik.values.eNASupportingOffice}
                    error={Boolean(
                      formik.touched.eNASupportingOffice &&
                        formik.errors.eNASupportingOffice
                    )}
                    fullWidth
                    helperText={
                      formik.touched.eNASupportingOffice &&
                      formik.errors.eNASupportingOffice
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
              </Grid>
              <Grid container spacing={12}>
                <Grid item md={12}>
                  <Typography variant="h3" gutterBottom display="inline">
                    Administration
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={4}>
                <Grid item md={4}>
                  <TextField
                    name="administrativeProgramme"
                    label="Administrative Programme"
                    required
                    select
                    value={formik.values.administrativeProgramme}
                    error={Boolean(
                      formik.touched.administrativeProgramme &&
                        formik.errors.administrativeProgramme
                    )}
                    fullWidth
                    helperText={
                      formik.touched.administrativeProgramme &&
                      formik.errors.administrativeProgramme
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Administrative Programme
                    </MenuItem>
                    {!isLoadingAdminProgrammes
                      ? adminProgrammes.data.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.shortTitle}
                          </MenuItem>
                        ))
                      : []}
                  </TextField>
                </Grid>
              </Grid>
              <Grid container spacing={12}>
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
                    onClick={() => setOpen(true)}
                  >
                    <AddIcon /> Add Staff Details
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
                        {staffDetailsArray.map((row) => (
                          <TableRow key={row?.staffDetailsName?.id}>
                            <TableCell component="th" scope="row">
                              {row?.staffDetailsName?.firstName +
                                " " +
                                row?.staffDetailsName?.lastName}
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
                                variant="contained"
                                color="primary"
                                onClick={() => removeStaff(row)}
                              >
                                <DeleteIcon />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Paper>
                </Grid>
              </Grid>
              <br />
              <Button type="submit" variant="contained" color="primary" mt={3}>
                <Check /> Save changes
              </Button>
            </>
          )}
        </CardContent>
      </Card>
      <Dialog
        fullWidth={true}
        maxWidth="md"
        open={open}
        onClose={() => setOpen(false)}
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
            handleClick={handleClick}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth={true}
        maxWidth="md"
        open={openCostCentre}
        onClose={() => setOpenCostCentre(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Cost Centre</DialogTitle>
        <DialogContent>
          <DialogContentText>Add Cost Centre</DialogContentText>
          <CostCentreForm handleClick={handleCostCentreAdd} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCostCentre(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default NewProjectForm;
