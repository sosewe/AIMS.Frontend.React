import React, { useEffect, useState } from "react";
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
import { Check } from "react-feather";
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
import { newInnovationDonor } from "../../../../api/innovation-donor";
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
  implementingOffice: "",
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

const InnovationForm = ({ processLevelItemId, processLevelTypeId, id }) => {
  const [open, setOpen] = useState(false);
  const [openAddStaffDetails, setOpenAddStaffDetails] = useState(false);
  const [staffDetailsList, setStaffDetailsList] = useState([]);
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

  const innovationDonorsMutation = useMutation({
    mutationFn: newInnovationDonor,
  });

  // eslint-disable-next-line no-unused-vars
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
      costCenter: Yup.string().required("Required"),
      donors: Yup.array().required("Required"),
    }),
    onSubmit: async (values) => {
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
          status: values.status,
          staffNameId: values.staffNameId.id,
          totalBudget: values.totalBudget,
          office: values.enaSupportOffice,
          regionalProgrammeId: values.regionalProgrammeId,
          currencyTypeId: values.currencyTypeId,
          costCenter: values.costCenter,
          processLevelItemId: processLevelItemId,
          processLevelTypeId: processLevelTypeId,
        };

        /*STEP 1 : Save Basic Information */
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

  const handleStaffDetailsClick = (values) => {
    setStaffDetailsList((current) => [...current, values]);
  };

  const handleStaffDetailsAdd = (values) => {
    setStaffDetailsList((current) => [...current, values]);
  };

  function handleStaffDetailsRemove(row) {
    setStaffDetailsList((current) =>
      current.filter((staff) => staff.staffDetailsName !== row.staffDetailsName)
    );
  }

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
        let staffId;
        let staffEmail;
        if (!isLoadingStaffList) {
          staffId = staffListData.data.find(
            (obj) => obj.id === InnovationData.data.staffNameId
          );

          if (staffId != null) {
            staffEmail = InnovationData.data.staffName.emailAddress;
          }
        }

        let orgUnit;
        if (!!isLoadingOrgUnits) {
          orgUnit = orgUnitsData.data.find(
            (obj) => obj.id === InnovationData.data.staffNameId
          );

          if (staffId != null) {
            staffEmail = InnovationData.data.staffName.emailAddress;
          }
        }

        let donorsList = [];
        for (const donor of InnovationData.data.donors) {
          const result = donorData.data.find((obj) => obj.id === donor.donorId);
          if (result) {
            donorsList.push(result);
          }
        }

        formik.setValues({
          title: InnovationData.data.title,
          shortTitle: InnovationData.data.shortTitle,
          startDate: InnovationData.data.startDate,
          endDate: InnovationData.data.endDate,
          extensionDate: InnovationData.data.extensionDate,
          status: InnovationData.data.status,
          staffNameId: staffId ? staffId : "",
          leadStaffEmail: staffEmail ? staffEmail : "",
          costCenter: InnovationData.data.costCenter,
          donors: donorsList,
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
            <DatePicker
              label="Start Date"
              value={formik.values.startDate}
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
              value={formik.values.endDate}
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
              value={formik.values.extensionDate}
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
              onTe
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
          <Grid item md={12}>
            <FormControl sx={{ m: 1, width: 450 }}>
              <InputLabel>Donors</InputLabel>
              <Select
                fullWidth
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
                          {row.staffDetailsAIMSRole.lookupItemName}
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
                            onClick={() => handleStaffDetailsRemove(row)}
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
          <Grid item md={12}>
            <Button type="submit" variant="contained" color="primary" mt={3}>
              <Check /> Save changes
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
            handleClick={handleStaffDetailsClick}
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
const Innovation = () => {
  let { processLevelItemId, processLevelTypeId, id } = useParams();
  return (
    <React.Fragment>
      <Helmet title="New Innovation" />
      <Typography variant="h3" gutterBottom display="inline">
        Innovation
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link
          component={NavLink}
          to={`/project/design-project/${processLevelItemId}/${processLevelTypeId}`}
        >
          Project Design
        </Link>
        <Typography>Innovation</Typography>
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
                      <MenuItem
                        key={option.id}
                        value={option.firstName + " " + option.lastName}
                      >
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
export default Innovation;
