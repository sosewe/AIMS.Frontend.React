import React, { useEffect } from "react";
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
  InputLabel,
  FormControl,
  Select,
  OutlinedInput,
  Stack,
  Chip,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import * as Yup from "yup";
import { spacing } from "@mui/system";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdministrativeRoles,
  getAMREFStaffList,
  getLookupMasterItemsByName,
} from "../../../../api/lookup";
import { getDonors } from "../../../../api/donor";
import { getAllThematicAreas } from "../../../../api/thematic-area";
import { getOrganizationUnits } from "../../../../api/organization-unit";
import { getAmrefEntities } from "../../../../api/amref-entity";
import { getInnovationById, newInnovation } from "../../../../api/innovation";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { getProjectRoles } from "../../../../api/project-role";

import { Helmet } from "react-helmet-async";
import {
  getQualitativeCountryByTypeItemId,
  newQualitativeCountry,
} from "../../../../api/qualitative-country";
import {
  getQualitativePeriodByTypeItemId,
  newQualitativePeriod,
} from "../../../../api/qualitative-period";
import {
  getQualitativeThematicAreaByTypeItemId,
  newQualitativeThematicArea,
} from "../../../../api/qualitative-thematic-area";
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
  startDate: "",
  endDate: "",
  extensionDate: "",
  status: "",
  staffNameId: "",
  emailAddress: "",
  role: "",
  staffDetailsWorkFlowTask: "",
  implementingOffice: "",
  regionalProgrammeId: "",
  enaSupportOffice: "",
  totalBudget: "",
  currencyTypeId: "",
  costCentre: "",
  donors: [], // multiple select
};

const InnovationForm = ({ processLevelItemId, processLevelTypeId, id }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  let innovationQualitativeTypeId;
  const {
    data: InnovationData,
    isLoading: isLoadingInnovationData,
    isError: isErrorInnovationData,
  } = useQuery(["getInnovationById", id], getInnovationById, { enabled: !!id });
  const {
    data: QualitativeCountryData,
    isLoading: isLoadingQualitativeCountry,
    isError: isErrorQualitativeCountry,
  } = useQuery(
    ["getQualitativeCountryByTypeItemId", id],
    getQualitativeCountryByTypeItemId,
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
    data: QualitativePeriodData,
    isLoading: isLoadingQualitativePeriod,
    isError: isErrorQualitativePeriod,
  } = useQuery(
    ["getQualitativePeriodByTypeItemId", id],
    getQualitativePeriodByTypeItemId,
    { enabled: !!id }
  );
  const {
    data: QualitativeThematicAreaData,
    isLoading: isLoadingQualitativeThematicArea,
    isError: isErrorQualitativeThematicArea,
  } = useQuery(
    ["getQualitativeThematicAreaByTypeItemId", id],
    getQualitativeThematicAreaByTypeItemId,
    { enabled: !!id }
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
  // const {
  //   data: ThematicAreas,
  //   isLoading: isLoadingThematicAreas,
  //   isError: isErrorThematicAreas,
  // } = useQuery(["getAllThematicAreas"], getAllThematicAreas, {
  //   refetchOnWindowFocus: false,
  // });
  const {
    isLoading: isLoadingAmrefEntities,
    data: amrefEntities,
    isError: isErrorAmrefEntities,
  } = useQuery(["amrefEntities"], getAmrefEntities, {
    refetchOnWindowFocus: false,
  });
  const {
    data: QualitativeResultTypesData,
    isLoading: isLoadingQualitativeResultTypes,
    isError: isErrorQualitativeResultTypes,
  } = useQuery(
    ["qualitativeResultType", "QualitativeResultType"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );
  if (!isLoadingQualitativeResultTypes && !isErrorQualitativeResultTypes) {
    const filterInnovation = QualitativeResultTypesData.data.find(
      (obj) => obj.lookupItemName === "Innovation"
    );
    innovationQualitativeTypeId = filterInnovation.lookupItemId;
  }
  const mutation = useMutation({ mutationFn: newInnovation });
  const qualitativeCountryMutation = useMutation({
    mutationFn: newQualitativeCountry,
  });
  const qualitativePeriodMutation = useMutation({
    mutationFn: newQualitativePeriod,
  });
  const qualitativeThematicAreaMutation = useMutation({
    mutationFn: newQualitativeThematicArea,
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
      status: Yup.string().required("Required"),
      staffNameId: Yup.object().required("Required"),
      staffDetailsAIMSRole: Yup.string().required("Required"),
      staffDetailsWorkFlowTask: Yup.string().required("Required"),
      implementingOffice: Yup.string().required("Required"),
      regionalProgrammeId: Yup.string().required("Required"),
      enaSupportOffice: Yup.string().required("Required"),
      totalBudget: Yup.number()
        .required("Required")
        .positive("Must be positive"),
      currencyTypeId: Yup.string().required("Required"),
      costCentre: Yup.string().required("Required"),
      donors: Yup.array().required("Required"),
    }),
    onSubmit: async (values) => {
      console.log(values);
      try {
        const guid = new Guid();
        const saveInnovation = {
          id: id ? id : guid.toString(),
          createDate: new Date(),
          title: values.title,
          shortTitle: values.shortTitle,
          startDate: values.startDate,
          endDate: values.endDate,
          extensionDate: values.extensionDate,
          status: true,
          staffNameId: values.staffNameId.id,
          totalBudget: values.totalBudget,
          // leadStaffName: values.leadStaffName.id,
          //leadStaffEmail: values.leadStaffEmail, // Add auto-populate logic
          // staffDetailsAIMSRole: values.staffDetailsAIMSRole,
          // staffDetailsWorkFlowTask: values.staffDetailsWorkFlowTask,
          office: values.enaSupportOffice,
          regionalProgrammeId: values.regionalProgrammeId,
          // enaSupportOffice: values.enaSupportOffice,
          currencyTypeId: values.currencyTypeId,
          costCentre: values.costCentre,
          processLevelItemId: processLevelItemId,
          processLevelTypeId: processLevelTypeId,
          //donorName: values.donors.map((donor) => donor.id), // Assuming donorName is an array of objects with id property
        };
        const innovation = await mutation.mutateAsync(saveInnovation);
        let qualitativeCountries = [];
        for (const country of values.countryId) {
          const qualitativeCountry = {
            createDate: new Date(),
            organizationUnitId: country.id,
            qualitativeTypeId: innovationQualitativeTypeId,
            qualitativeTypeItemId: innovation.data.id,
          };
          qualitativeCountries.push(qualitativeCountry);
        }
        const qualitativePeriod = {
          createDate: new Date(),
          qualitativeTypeId: innovationQualitativeTypeId,
          qualitativeTypeItemId: innovation.data.id,
          periodTo: values.duration_to,
          periodFrom: values.duration_from,
        };
        // const qualitativeThematicArea = {
        //   createDate: new Date(),
        //   thematicAreaId: values.thematicAreaId,
        //   qualitativeTypeId: innovationQualitativeTypeId,
        //   qualitativeTypeItemId: innovation.data.id,
        // };
        //await processLevelRoleMutation.mutateAsync(projectRoles);
        await qualitativeCountryMutation.mutateAsync(qualitativeCountries);
        await qualitativePeriodMutation.mutateAsync(qualitativePeriod);
        // await qualitativeThematicAreaMutation.mutateAsync(
        //   qualitativeThematicArea
        // );
        toast("Successfully Created an Innovation", {
          type: "success",
        });
        await queryClient.invalidateQueries(["getInnovations"]);
        navigate(
          `/project/design-project/${processLevelItemId}/${processLevelTypeId}`
        );
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
      if (
        !isLoadingInnovationData &&
        !isErrorInnovationData &&
        !isLoadingQualitativeThematicArea &&
        !isErrorQualitativeThematicArea &&
        !isErrorQualitativePeriod &&
        !isLoadingQualitativePeriod &&
        !isLoadingQualitativeCountry &&
        !isErrorQualitativeCountry
      ) {
        let staff;
        let countries = [];
        if (!isErrorStaffList && !isLoadingStaffList) {
          staff = staffListData.data.find(
            (obj) => obj.id === InnovationData.data.staffNameId
          );
        }
        for (const qualitativeCountryFind of QualitativeCountryData.data) {
          const result = amrefEntities.data.find(
            (obj) => obj.id === qualitativeCountryFind.organizationUnitId
          );
          if (result) {
            countries.push(result);
          }
        }
        formik.setValues({
          title: InnovationData.data.title,
          staffNameId: staff ? staff : "",
          countryId: countries && countries.length > 0 ? countries : [],
          proposedSolution: InnovationData.data.proposedSolution,
          targetBeneficiary: InnovationData.data.targetBeneficiary,
          difference: InnovationData.data.difference,
          scaling: InnovationData.data.scaling,
          sustainability: InnovationData.data.sustainability,
          whyInnovative: InnovationData.data.whyInnovative,
          thematicAreaId:
            QualitativeThematicAreaData.data.length > 0
              ? QualitativeThematicAreaData.data[0].thematicAreaId
              : "",
          duration_from:
            QualitativePeriodData.data.length > 0
              ? new Date(QualitativePeriodData.data[0].periodFrom)
              : "",
          duration_to:
            QualitativePeriodData.data.length > 0
              ? new Date(QualitativePeriodData.data[0].periodTo)
              : "",
        });
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
    isErrorQualitativePeriod,
    isLoadingQualitativePeriod,
    isErrorQualitativeThematicArea,
    isLoadingQualitativeThematicArea,
    QualitativePeriodData,
    QualitativeThematicAreaData,
    QualitativeCountryData,
    isLoadingQualitativeCountry,
    isErrorQualitativeCountry,
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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                name="startDate"
                label="Start Date"
                value={formik.values.startDate}
                onChange={(value) =>
                  formik.setFieldValue("startDate", value, true)
                }
                renderInput={(params) => <TextField {...params} />}
                error={Boolean(
                  formik.touched.startDate && formik.errors.startDate
                )}
                helperText={formik.touched.startDate && formik.errors.startDate}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item md={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                name="endDate"
                label="End Date"
                value={formik.values.endDate}
                onChange={(value) =>
                  formik.setFieldValue("endDate", value, true)
                }
                renderInput={(params) => <TextField {...params} />}
                error={Boolean(formik.touched.endDate && formik.errors.endDate)}
                helperText={formik.touched.endDate && formik.errors.endDate}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item md={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                name="extensionDate"
                label="Extension Date"
                value={formik.values.extensionDate}
                onChange={(value) =>
                  formik.setFieldValue("extensionDate", value, true)
                }
                renderInput={(params) => <TextField {...params} />}
                error={Boolean(
                  formik.touched.extensionDate && formik.errors.extensionDate
                )}
                helperText={
                  formik.touched.extensionDate && formik.errors.extensionDate
                }
              />
            </LocalizationProvider>
          </Grid>
          <Grid item md={12}>
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
          </Grid>
          <Grid item md={4}>
            <TextField
              name="staffNameId"
              label="Lead Staff name"
              select
              value={formik.values.staffNameId}
              error={Boolean(
                formik.touched.staffNameId && formik.errors.staffNameId
              )}
              fullWidth
              helperText={
                formik.touched.staffNameId && formik.errors.staffNameId
              }
              onBlur={formik.handleBlur}
              onChange={(e) => {
                formik.handleChange(e);
                formik.setFieldValue(
                  "leadStaffEmail",
                  e.target.value.emailAddress
                );
              }}
              variant="outlined"
              my={2}
            >
              <MenuItem disabled value="">
                Select staff's Name
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
          <Grid item md={3}>
            <TextField
              name="staffDetailsAIMSRole"
              label="Role"
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
                Role
              </MenuItem>
              {!isLoadingAimsRole
                ? aimsRolesData.data.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))
                : []}
            </TextField>
          </Grid>
          <Grid item md={4}>
            <TextField
              name="staffDetailsWorkFlowTask"
              label="DQA Role"
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
                    <MenuItem key={option.roleId} value={option.roleId}>
                      {option.roleName}
                    </MenuItem>
                  ))
                : []}
            </TextField>
          </Grid>
          <Grid item md={4}>
            <TextField
              name="implementingOffice"
              label="Implementing Office"
              select
              value={formik.values.implementingOffice}
              error={Boolean(
                formik.touched.implementingOffice &&
                  formik.errors.implementingOffice
              )}
              fullWidth
              helperText={
                formik.touched.implementingOffice &&
                formik.errors.implementingOffice
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
          <Grid item md={3}>
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
          <Grid item md={3}>
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
              name="costCentre"
              label="Cost Centre Name"
              value={formik.values.costCentre}
              error={Boolean(
                formik.touched.costCentre && formik.errors.costCentre
              )}
              fullWidth
              helperText={formik.touched.costCentre && formik.errors.costCentre}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              multiline
              variant="outlined"
              my={2}
            />
          </Grid>
          <Grid item md={3}>
            <FormControl sx={{ m: 1, width: 500 }}>
              <InputLabel>Donors</InputLabel>
              <Select
                multiple
                value={formik.values.donors}
                onChange={(e) => {
                  const selectedDonors = Array.isArray(e.target.value)
                    ? e.target.value
                    : [e.target.value]; // Ensure it's always an array
                  formik.setFieldValue("donors", selectedDonors);
                }}
                input={<OutlinedInput label="Multiple Select" />}
                renderValue={(selected) => (
                  <Stack gap={1} direction="row" flexWrap="wrap">
                    {selected.map((value) => (
                      <Chip
                        key={value.id}
                        label={value.donorName}
                        onDelete={() =>
                          formik.setFieldValue(
                            "donors",
                            formik.values.donors.filter(
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
              >
                {!isLoadingDonor
                  ? donorData.data.map((option) => (
                      <MenuItem key={option.id} value={option}>
                        {option.donorName}({option.donorInitial})
                      </MenuItem>
                    ))
                  : []}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={12}>
            <Button variant="contained" color="primary" type="submit">
              Save
            </Button>
          </Grid>
        </Grid>
      )}
    </form>
  );
};
const Innovation = () => {
  let { processLevelItemId, processLevelTypeId, id } = useParams();
  return (
    <React.Fragment>
      <Helmet title="New Innovation" />
      <Typography variant="h3" gutterBottom display="inline">
        New Innovation
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link
          component={NavLink}
          to={`/project/design-project/${processLevelItemId}/${processLevelTypeId}`}
        >
          Project Design
        </Link>
        <Typography>New Innovation</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <InnovationForm
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
export default Innovation;
