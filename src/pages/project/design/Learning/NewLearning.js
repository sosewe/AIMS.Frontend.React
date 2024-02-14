import React, { useEffect, useCallback } from "react";
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
import { YEAR_RANGE } from "../../../../constants";
import {
  getAMREFStaffList,
  getLookupMasterItemsByName,
} from "../../../../api/lookup";
import { getDonors } from "../../../../api/donor";
import { getOrganizationUnits } from "../../../../api/organization-unit";
import { getAmrefEntities } from "../../../../api/amref-entity";
import { getAdministrativeProgrammes } from "../../../../api/administrative-programme";
import { newLearning } from "../../../../api/learning";
import { newLearningDonor } from "../../../../api/learning-donor";
import { newLearningPartner } from "../../../../api/learning-partner";
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
};

const LearningForm = ({
  processLevelItemId,
  processLevelTypeId,
  onActionChange,
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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

  const { isLoading: isLoadingStaffList, data: staffListData } = useQuery(
    ["staffList"],
    getAMREFStaffList,
    {
      refetchOnWindowFocus: false,
      retry: 0,
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

  const { isLoading: isLoadingAmrefEntities, data: amrefEntities } = useQuery(
    ["amrefEntities"],
    getAmrefEntities,
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

  const { isLoading: isLoadingDonor, data: donorData } = useQuery(
    ["donors"],
    getDonors,
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
          id: new Guid().toString(),
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
          processLevelItemId: processLevelItemId,
          processLevelTypeId: processLevelTypeId,
        };

        const learning = await mutation.mutateAsync(saveLearning);

        let learningDonors = [];
        for (const donor of values.donors) {
          const learningDonor = {
            donorId: donor.id,
            researchId: learning.data.id,
            createDate: new Date(),
          };
          learningDonors.push(learningDonor);
        }
        await learningDonorsMutation.mutateAsync(learningDonors);

        toast("Successfully Created Learning", {
          type: "success",
        });

        await queryClient.invalidateQueries(["getLearningByLearningId"]);

        handleActionChange(false, 0);
      } catch (error) {
        console.log(error);
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  useEffect(() => {
    function setCurrentFormValues() {}
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

const Learning = ({ onActionChange }) => {
  let { id, processLevelTypeId } = useParams();
  return (
    <React.Fragment>
      <Helmet title="New Learning" />
      <Typography variant="h3" gutterBottom display="inline">
        New Learning
      </Typography>

      <Divider my={6} />
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <LearningForm
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

export default Learning;
