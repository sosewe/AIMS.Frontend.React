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
import { getAdministrativeProgrammes } from "../../../../api/administrative-programme";
import { getDonors } from "../../../../api/donor";
import { getAllThematicAreas } from "../../../../api/thematic-area";
import { getOrganizationUnits } from "../../../../api/organization-unit";
import { getAmrefEntities } from "../../../../api/amref-entity";
import { getLearningByLearningId, newLearning } from "../../../../api/learning";
import { newLearningDonor } from "../../../../api/learning-donor";
import {
  newLearningPartner,
  getLearningPartnerByLearningId,
  deleteLearningPartnerById,
} from "../../../../api/learning-partner";
import {
  newLearningStaff,
  getLearningStaff,
  getLearningStaffByLearningId,
} from "../../../../api/learning-staff";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { getProjectRoles } from "../../../../api/project-role";
import { Helmet } from "react-helmet-async";
import { Guid } from "../../../../utils/guid";
import { YEAR_RANGE } from "../../../../constants";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Autocomplete = styled(MuiAutocomplete)(spacing);
const Button = styled(MuiButton)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const Divider = styled(MuiDivider)(spacing);

const initialValues = {
  learningQuestion: "",
  learningMethodologyId: "",
  keyDecisionPoint: "",
  startDate: "",
  endDate: "",
  extensionDate: "",
  statusId: "",
  staffNameId: "",
  implementingOfficeId: "",
  regionalProgrammeId: "",
  administrativeProgrammeId: "",
  enaOfficeId: "",
  totalBudget: "",
  currencyTypeId: "",
  costCenter: "",
  donors: [],
  partners: [],
};

const staffDetailsInitial = {
  staffId: "",
  staffDetailsName: "",
  staffDetailsAIMSRole: "",
  staffDetailsWorkFlowTask: "",
  primaryRole: false,
};

const partnerDetailsInitial = {
  partnerName: "",
  partnerType: "",
};

const PartnerDetailsForm = ({
  learningPartnerTypeData,
  isLoadingPartnerType,
  handlePartnerClick,
}) => {
  const formik = useFormik({
    initialValues: partnerDetailsInitial,
    validationSchema: Yup.object().shape({
      partnerName: Yup.string().required("Required"),
      partnerType: Yup.object().required("Required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        handlePartnerClick(values);
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
            <Grid item md={12}>
              <TextField
                name="partnerType"
                label="Partner Type"
                required
                select
                value={formik.values.partnerType}
                error={Boolean(
                  formik.touched.partnerType && formik.errors.partnerType
                )}
                fullWidth
                helperText={
                  formik.touched.partnerType && formik.errors.partnerType
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
              >
                <MenuItem disabled value="">
                  Select
                </MenuItem>
                {!isLoadingPartnerType
                  ? learningPartnerTypeData.data.map((option) => (
                      <MenuItem key={option.lookupItemId} value={option}>
                        {option.lookupItemName}
                      </MenuItem>
                    ))
                  : []}
              </TextField>
            </Grid>

            <Grid item md={12}>
              <TextField
                name="partnerName"
                label="Partner Name"
                value={formik.values.partnerName}
                error={Boolean(
                  formik.touched.partnerName && formik.errors.partnerName
                )}
                fullWidth
                helperText={
                  formik.touched.partnerName && formik.errors.partnerName
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                multiline
                variant="outlined"
                my={2}
                rows={3}
              />
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

const EditLearningForm = ({ id, onActionChange }) => {
  const [openAddStaffDetails, setOpenAddStaffDetails] = useState(false);
  const [staffDetailsList, setStaffDetailsList] = useState([]);
  const [openAddPartnerDetails, setOpenAddPartnerDetails] = useState(false);
  const [partnerDetailsList, setPartnerDetailsList] = useState([]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    data: LearningData,
    isLoading: isLoadingLearningData,
    isError: isErrorLearningData,
  } = useQuery(["getLearningByLearningId", id], getLearningByLearningId, {
    enabled: !!id,
  });

  const {
    isLoading: isLoadingLearningMethodology,
    data: learningMethodologyData,
  } = useQuery(
    ["learningMethodology", "LearningMethodology"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const { isLoading: isLoadingPartnerType, data: learningPartnerTypeData } =
    useQuery(["partnerType", "PartnerType"], getLookupMasterItemsByName, {
      refetchOnWindowFocus: false,
    });

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

  const mutation = useMutation({ mutationFn: newLearning });

  const learningDonorsMutation = useMutation({
    mutationFn: newLearningDonor,
  });

  const learningStaffMutation = useMutation({
    mutationFn: newLearningStaff,
  });

  const learningPartnersMutation = useMutation({
    mutationFn: newLearningPartner,
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      learningQuestion: Yup.string().required("Required"),
      learningMethodologyId: Yup.string().required("Required"),
      keyDecisionPoint: Yup.string().required("Required"),
      startDate: Yup.date().required("Required"),
      endDate: Yup.date().required("Required"),
      extensionDate: Yup.date().when("endDate", (endDate, schema) => {
        return endDate
          ? schema.min(endDate, "Must be after End Date").nullable()
          : schema;
      }),
      statusId: Yup.string().required("Required"),
      staffNameId: Yup.object().required("Required"),
      implementingOfficeId: Yup.string().required("Required"),
      //regionalProgrammeId: Yup.string().required("Required"),
      administrativeProgrammeId: Yup.string().required("Required"),
      //enaOfficeId: Yup.string().required("Required"),
      totalBudget: Yup.number()
        .required("Required")
        .positive("Must be positive"),
      currencyTypeId: Yup.string().required("Required"),
      costCenter: Yup.string().required("Required"),
      donors: Yup.array().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const saveLearning = {
          id: id,
          createDate: new Date(),
          learningQuestion: values.learningQuestion,
          learningMethodologyId: values.learningMethodologyId,
          keyDecisionPoint: values.keyDecisionPoint,
          startDate: values.startDate,
          endDate: values.endDate,
          extensionDate: values.extensionDate,
          statusId: values.statusId,
          staffNameId: values.staffNameId.id,
          implementingOfficeId: values.implementingOfficeId,
          regionalProgrammeId: values.regionalProgrammeId,
          administrativeProgrammeId: values.administrativeProgrammeId,
          enaOfficeId: values.enaOfficeId,
          totalBudget: values.totalBudget,
          currencyTypeId: values.currencyTypeId,
          costCenter: values.costCenter,
        };
        await mutation.mutateAsync(saveLearning);

        let learningDonors = [];
        for (const donor of values.donors) {
          const learningDonor = {
            donorId: donor.id,
            researchId: id,
            createDate: new Date(),
          };
          learningDonors.push(learningDonor);
        }
        await learningDonorsMutation.mutateAsync(learningDonors);

        const learningStaff = [];
        for (const staffDetail of staffDetailsList) {
          const projectRole = {
            researchId: id,
            aimsRoleId: staffDetail.staffDetailsAIMSRole.id,
            aimsRoleName: staffDetail.staffDetailsAIMSRole.name,
            createDate: new Date(),
            dqaRoleId: staffDetail.staffDetailsWorkFlowTask.roleId,
            dqaRoleName: staffDetail.staffDetailsWorkFlowTask.roleName,
            isPrimary:
              staffDetail.primaryRole === "" ? false : staffDetail.primaryRole,
            staffNames: staffDetail.staffDetailsName,
            void: false,
          };
          learningStaff.push(projectRole);
        }
        await learningStaffMutation.mutateAsync(learningStaff);

        console.log(
          "logging partnerDetailsList " + JSON.stringify(partnerDetailsList)
        );
        const learningPartners = [];
        for (const partnerDetail of partnerDetailsList) {
          const projectRole = {
            researchId: id,
            partnerTypeId: partnerDetail.partnerType.lookupItemId,
            partnerTypeName: partnerDetail.partnerType.lookupItemName,
            partnerName: partnerDetail.partnerName,
            partnerId: new Guid().toString(),
            createDate: new Date(),
            void: false,
          };
          learningPartners.push(projectRole);
        }
        await learningPartnersMutation.mutateAsync(learningPartners);

        toast("Successfully Updated Learning", {
          type: "success",
        });
        await queryClient.invalidateQueries(["getlearningBylearningId"]);

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

  function removePartner(row) {
    setPartnerDetailsList((current) =>
      current.filter((staff) => staff.staffDetailsName !== row.staffDetailsName)
    );
  }

  const handlePartnerDetailsAdd = (values) => {
    setPartnerDetailsList((current) => [...current, values]);
  };

  useEffect(() => {
    function setCurrentFormValues() {
      if (!isLoadingLearningData && !isErrorLearningData && LearningData) {
        let staffId;
        let staffEmail;
        if (!isLoadingStaffList) {
          staffId = staffListData.data.find(
            (obj) => obj.id === LearningData.data.staffNameId
          );
          if (staffId != null) {
            staffEmail = staffId.emailAddress;
          }
        }

        let enaSupportOffice;
        if (!isLoadingAmrefEntities) {
          enaSupportOffice = amrefEntities.data.find(
            (obj) => obj.id === LearningData.data.office
          );
        }

        let implementingOffice;
        if (!isLoadingOrgUnits) {
          implementingOffice = orgUnitsData.data.find(
            (obj) => obj.id === LearningData.data.implementingOfficeId
          );
        }

        let currencyType;
        if (!isLoadingCurrency) {
          currencyType = currencyData.data.find(
            (obj) => obj.id === LearningData.data.currencyTypeId
          );
        }

        let donorsList = [];
        if (!isLoadingDonor) {
          for (const donor of LearningData.data.donors) {
            const result = donorData.data.find(
              (obj) => obj.id === donor.donorId
            );
            if (result) {
              donorsList.push(result);
            }
          }
        }

        formik.setValues({
          learningQuestion: LearningData.data.learningQuestion,
          learningMethodologyId: LearningData.data.learningMethodologyId,
          keyDecisionPoint: LearningData.data.keyDecisionPoint,
          startDate: LearningData.data.startDate,
          endDate: LearningData.data.endDate,
          extensionDate: LearningData.data.extensionDate,
          statusId: LearningData.data.statusId,
          staffNameId: staffId ? staffId : "",
          leadStaffEmail: staffEmail ? staffEmail : "",
          implementingOfficeId: implementingOffice ? implementingOffice.id : "",
          enaOfficeId: LearningData.data.enaOfficeId,
          regionalProgrammeId: LearningData.data.regionalProgrammeId,
          administrativeProgrammeId:
            LearningData.data.administrativeProgrammeId,
          totalBudget: LearningData.data.totalBudget,
          costCenter: LearningData.data.costCenter,
          currencyTypeId: LearningData.data.currencyTypeId,
          donors: donorsList,
          partners: [],
        });

        if (LearningData.data.staffs && LearningData.data.staffs.length > 0) {
          const allStaff = [];
          for (const staffData of LearningData.data.staffs) {
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

        if (
          LearningData.data.partners &&
          LearningData.data.partners.length > 0
        ) {
          const allPartners = [];
          for (const partnerData of LearningData.data.partners) {
            const lookupPartner =
              !isLoadingPartnerType &&
              learningPartnerTypeData.data.filter(
                (obj) => obj.id === partnerData.partnerTypeId
              );

            const partner = {
              id: partnerData.id,
              partnerId: partnerData.partnerId,
              partnerName: partnerData.partnerName,
              partnerType: {
                lookupItemId: partnerData.partnerTypeId,
                lookupItemName: partnerData.partnerTypeName,
              },
            };
            allPartners.push(partner);
          }
          setPartnerDetailsList(allPartners);
        }
      }
    }
    setCurrentFormValues();
  }, [
    LearningData,
    isLoadingLearningData,
    isErrorLearningData,
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
              name="learningQuestion"
              label="Learning Question"
              value={formik.values.learningQuestion}
              error={Boolean(
                formik.touched.learningQuestion &&
                  formik.errors.learningQuestion
              )}
              fullWidth
              helperText={
                formik.touched.learningQuestion &&
                formik.errors.learningQuestion
              }
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
              name="learningMethodologyId"
              label="Learning Methodology"
              select
              value={formik.values.learningMethodologyId}
              error={Boolean(
                formik.touched.learningMethodologyId &&
                  formik.errors.learningMethodologyId
              )}
              fullWidth
              helperText={
                formik.touched.learningMethodologyId &&
                formik.errors.learningMethodologyId
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            >
              <MenuItem disabled value="">
                Select
              </MenuItem>
              {!isLoadingLearningMethodology
                ? learningMethodologyData.data.map((option) => (
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
              name="keyDecisionPoint"
              label="Key Decision Point"
              value={formik.values.keyDecisionPoint}
              error={Boolean(
                formik.touched.keyDecisionPoint &&
                  formik.errors.keyDecisionPoint
              )}
              fullWidth
              helperText={
                formik.touched.keyDecisionPoint &&
                formik.errors.keyDecisionPoint
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              multiline
              variant="outlined"
              my={2}
              rows={3}
            />
          </Grid>

          <Grid container item spacing={2}>
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
                onChange={(value) =>
                  formik.setFieldValue("endDate", value, true)
                }
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
                      formik.touched.extensionDate &&
                        formik.errors.extensionDate
                    )}
                    helperText={
                      formik.touched.extensionDate &&
                      formik.errors.extensionDate
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
          </Grid>

          <Grid container item spacing={2}>
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
                  Select
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
          </Grid>

          <Grid container item spacing={2}>
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
                  Select
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
                name="enaOfficeId"
                label="E/NA Supporting Office"
                select
                value={formik.values.enaOfficeId}
                error={Boolean(
                  formik.touched.enaOfficeId && formik.errors.enaOfficeId
                )}
                fullWidth
                helperText={
                  formik.touched.enaOfficeId && formik.errors.enaOfficeId
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
              >
                <MenuItem disabled value="">
                  Select
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
                  Select
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
          </Grid>

          <Grid container item spacing={2}>
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
                  Select
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
                helperText={
                  formik.touched.costCenter && formik.errors.costCenter
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                multiline
                variant="outlined"
                my={2}
              />
            </Grid>
          </Grid>

          <Grid container item spacing={2}>
            <Grid item md={4}>
              <TextField
                name="statusId"
                label="Status"
                select
                value={formik.values.statusId}
                error={Boolean(
                  formik.touched.statusId && formik.errors.statusId
                )}
                fullWidth
                helperText={formik.touched.statusId && formik.errors.statusId}
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
            <Grid item md={8}>
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
                    error={Boolean(
                      formik.touched.donors && formik.errors.donors
                    )}
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

          <Grid container spacing={12} pt={10}>
            <Grid item md={12}>
              <Typography variant="h3" gutterBottom display="inline">
                Partner Details
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenAddPartnerDetails(true)}
              >
                <AddIcon /> Partner Details
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={12}>
            <Grid item md={12}>
              <Paper>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Partner Type</TableCell>
                      <TableCell>Partner Name</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {partnerDetailsList.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.partnerType.lookupItemName}</TableCell>
                        <TableCell component="th" scope="row">
                          {row.partnerName}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            startIcon={<TrashIcon />}
                            size="small"
                            onClick={() => removePartner(row)}
                          ></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          </Grid>

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
              <Button
                onClick={() => setOpenAddStaffDetails(false)}
                color="primary"
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            fullWidth={true}
            maxWidth="md"
            open={openAddPartnerDetails}
            onClose={() => setOpenAddPartnerDetails(false)}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Partner Details</DialogTitle>
            <DialogContent>
              <DialogContentText>Add Partner Details</DialogContentText>
              <PartnerDetailsForm
                learningPartnerTypeData={learningPartnerTypeData}
                isLoadingPartnerType={isLoadingPartnerType}
                handlePartnerClick={handlePartnerDetailsAdd}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenAddPartnerDetails(false)}
                color="primary"
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>

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
    </form>
  );
};

const Learning = (props) => {
  let { id } = useParams();
  return (
    <React.Fragment>
      <Helmet title="Edit learning" />
      <Typography variant="h3" gutterBottom display="inline">
        Basic Information
      </Typography>
      <Divider my={6} />
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <EditLearningForm
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

export default Learning;
