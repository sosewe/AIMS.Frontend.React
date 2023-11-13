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
  InputLabel,
  FormControl,
  Select,
  OutlinedInput,
  Stack,
  Chip,
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
  getAMREFStaffList,
  getLookupMasterItemsByName,
} from "../../../../api/lookup";
import { getDonors } from "../../../../api/donor";
import { getOrganizationUnits } from "../../../../api/organization-unit";
import { getAmrefEntities } from "../../../../api/amref-entity";
import {
  getTechnicalAssistanceById,
  newTechnicalAssistance,
} from "../../../../api/technical-assistance";
import { newTechnicalAssistanceDonor } from "../../../../api/technical-assistance-donor";
import { NavLink, useNavigate, useParams } from "react-router-dom";

import { Helmet } from "react-helmet-async";
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
  goal: "",
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

const TechnicalAssistanceForm = ({
  processLevelItemId,
  processLevelTypeId,
  id,
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    data: TechnicalAssistanceData,
    isLoading: isLoadingTechnicalAssistanceData,
    isError: isErrorTechnicalAssistanceData,
  } = useQuery(["getTechnicalAssistanceById", id], getTechnicalAssistanceById, {
    enabled: !!id,
  });
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
  const { isLoading: isLoadingPartner, data: partnerData } = useQuery(
    ["partners"],
    getDonors,
    {
      refetchOnWindowFocus: false,
    }
  );
  const {
    isLoading: isLoadingAdministrativeProgram,
    data: administrativeProgramData,
  } = useQuery(["administrativePrograms"], getDonors, {
    refetchOnWindowFocus: false,
  });
  const {
    isLoading: isLoadingAmrefEntities,
    data: amrefEntities,
    isError: isErrorAmrefEntities,
  } = useQuery(["amrefEntities"], getAmrefEntities, {
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({ mutationFn: newTechnicalAssistance });

  const technicalAssistanceDonorsMutation = useMutation({
    mutationFn: newTechnicalAssistanceDonor,
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
      implementingOfficeId: Yup.string().required("Required"),
      enaSupportOffice: Yup.string().required("Required"),
      regionalProgrammeId: Yup.string().required("Required"),
      administrativeProgrammeId: Yup.string().required("Required"),
      //office: Yup.string().required("Required"),
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
          id: id ? id : new Guid(),
          createDate: new Date(),
          title: values.title,
          shortTitle: values.shortTitle,
          startDate: values.startDate,
          endDate: values.endDate,
          extensionDate: values.extensionDate,
          staffNameId: values.staffNameId.id,
          /*implementingOfficeId: values.implementingOfficeId,
          regionalProgrammeId: values.regionalProgrammeId,
          administrativeProgrammeId: values.administrativeProgrammeId.id,
          office: values.enaSupportOffice,
          totalBudget: values.totalBudget,
          currencyTypeId: values.currencyTypeId,
          costCenter: values.costCenter,
          status: values.status,
          processLevelItemId: processLevelItemId,
          processLevelTypeId: processLevelTypeId,*/
        };
        console.log(
          "saveTechnicalAssistance  : " +
            JSON.stringify(saveTechnicalAssistance)
        );
        /*const technicalAssistance = await mutation.mutateAsync(
          saveTechnicalAssistance
        );

        let technicalAssistanceDonors = [];
        for (const donor of values.donors) {
          const technicalAssistanceDonor = {
            donorId: donor.id,
            innovationId: null, //technicalAssistance.data.id,
            createDate: new Date(),
          };
          technicalAssistanceDonors.push(technicalAssistanceDonor);
        }
        console.log(
          "technicalAssistanceDonors  : " +
            JSON.stringify(technicalAssistanceDonors)
        );
        await technicalAssistanceDonorsMutation.mutateAsync(
          technicalAssistanceDonors
        );

        let technicalAssistancePartners = [];
        for (const partner of values.partners) {
          const technicalAssistancePartner = {
            donorId: partner.id,
            innovationId: null, //technicalAssistance.data.id,
            createDate: new Date(),
          };
          technicalAssistancePartners.push(technicalAssistancePartner);
        }
        console.log(
          "technicalAssistancePartners  : " +
            JSON.stringify(technicalAssistancePartners)
        );
        await technicalAssistanceDonorsMutation.mutateAsync(
          technicalAssistancePartners
        );
        */

        toast("Successfully Created a Technical Assistance", {
          type: "success",
        });
        await queryClient.invalidateQueries(["getTechnicalAssistanceById"]);
        navigate(
          `/project/design/technical-assistance/technical-assistance-detail/bc7fd0b3-3406-490d-a3fa-abf8ffd9f13e`
        );
      } catch (error) {
        console.log(error);
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  useEffect(() => {});

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
              label="Manager Name"
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
              {!isLoadingAdministrativeProgram
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
            <FormControl sx={{ width: "100%" }}>
              <InputLabel>Donors</InputLabel>
              <Select
                fullWidth
                multiple
                value={formik.values.donors}
                error={Boolean(formik.touched.donors && formik.errors.donors)}
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
                        key={value.id}
                        label={value.donorName}
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
              >
                {!isLoadingPartner
                  ? partnerData.data.map((option) => (
                      <MenuItem key={option.id} value={option}>
                        {option.donorName}({option.donorInitial})
                      </MenuItem>
                    ))
                  : []}
              </Select>
            </FormControl>
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

const TechnicalAssistance = () => {
  let { processLevelItemId, processLevelTypeId, id } = useParams();
  return (
    <React.Fragment>
      <Helmet title="New Technical Assistance" />
      <Typography variant="h3" gutterBottom display="inline">
        New Technical Assistance
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link
          component={NavLink}
          to={`/project/design-project/${processLevelItemId}/${processLevelTypeId}`}
        >
          Project Design
        </Link>
        <Typography>New Technical Assistance</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <TechnicalAssistanceForm
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

export default TechnicalAssistance;
