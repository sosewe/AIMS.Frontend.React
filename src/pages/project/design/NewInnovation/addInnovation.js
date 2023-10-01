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
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import * as Yup from "yup";
import { spacing } from "@mui/system";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAMREFStaffList,
  getLookupMasterItemsByName,
} from "../../../../api/lookup";
import { getAllThematicAreas } from "../../../../api/thematic-area";
import { getAmrefEntities } from "../../../../api/amref-entity";
import { getInnovationById, newInnovation } from "../../../../api/innovation";
import { NavLink, useNavigate, useParams } from "react-router-dom";
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
  innovationName: "",
  innovationShortTitle: "",
  startDate: null,
  endDate: null,
  extensionDate: null,
  status: "",
  leadStaffName: null,
  emailAddress: "", // auto-populate from staff name
  role: "",
  dqaRole: "",
  implementingOffice: "",
  regionalOffice: "",
  enaSupportOffice: "",
  totalBudget: "",
  currencyType: "",
  costCentre: "",
  donorName: [], // multiple select
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
  const {
    data: ThematicAreas,
    isLoading: isLoadingThematicAreas,
    isError: isErrorThematicAreas,
  } = useQuery(["getAllThematicAreas"], getAllThematicAreas, {
    refetchOnWindowFocus: false,
  });
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
      innovationName: Yup.string().required("Required"),
      innovationShortTitle: Yup.string().required("Required"),
      startDate: Yup.date().required("Required"),
      endDate: Yup.date().required("Required"),
      extensionDate: Yup.date().when("endDate", (endDate, schema) => {
        return endDate ? schema.min(endDate, "Must be after End Date") : schema;
      }),
      status: Yup.string().required("Required"),
      leadStaffName: Yup.object().required("Required"),
      role: Yup.string().required("Required"),
      dqaRole: Yup.string().required("Required"),
      implementingOffice: Yup.string().required("Required"),
      regionalOffice: Yup.string().required("Required"),
      enaSupportOffice: Yup.string().required("Required"),
      totalBudget: Yup.number()
        .required("Required")
        .positive("Must be positive"),
      currencyType: Yup.string().required("Required"),
      costCentre: Yup.string().required("Required"),
      donorName: Yup.array().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const guid = new Guid();
        const saveInnovation = {
          id: id ? id : guid.toString(),
          createDate: new Date(),
          innovationName: values.innovationName,
          innovationShortTitle: values.innovationShortTitle,
          startDate: values.startDate,
          endDate: values.endDate,
          extensionDate: values.extensionDate,
          status: values.status,
          leadStaffName: values.leadStaffName.id,
          emailAddress: values.emailAddress, // Add auto-populate logic
          role: values.role,
          dqaRole: values.dqaRole,
          implementingOffice: values.implementingOffice,
          regionalOffice: values.regionalOffice,
          enaSupportOffice: values.enaSupportOffice,
          totalBudget: values.totalBudget,
          currencyType: values.currencyType,
          costCentre: values.costCentre,
          donorName: values.donorName.map((donor) => donor.id), // Assuming donorName is an array of objects with id property
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
        const qualitativeThematicArea = {
          createDate: new Date(),
          thematicAreaId: values.thematicAreaId,
          qualitativeTypeId: innovationQualitativeTypeId,
          qualitativeTypeItemId: innovation.data.id,
        };
        await qualitativeCountryMutation.mutateAsync(qualitativeCountries);
        await qualitativePeriodMutation.mutateAsync(qualitativePeriod);
        await qualitativeThematicAreaMutation.mutateAsync(
          qualitativeThematicArea
        );
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
      <Grid container item spacing={2}>
        <Grid item md={12}>
          <TextField
            name="innovationName"
            label="Innovation Name"
            value={formik.values.innovationName}
            error={Boolean(
              formik.touched.innovationName && formik.errors.innovationName
            )}
            fullWidth
            helperText={
              formik.touched.innovationName && formik.errors.innovationName
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
            name="innovationShortTitle"
            label="Innovation Short Title"
            value={formik.values.innovationShortTitle}
            error={Boolean(
              formik.touched.innovationShortTitle &&
                formik.errors.innovationShortTitle
            )}
            fullWidth
            helperText={
              formik.touched.innovationShortTitle &&
              formik.errors.innovationShortTitle
            }
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
              label="End Date"
              value={formik.values.endDate}
              onChange={(value) => formik.setFieldValue("endDate", value, true)}
              renderInput={(params) => <TextField {...params} />}
              error={Boolean(formik.touched.endDate && formik.errors.endDate)}
              helperText={formik.touched.endDate && formik.errors.endDate}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item md={4}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
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
              required
              select
              value={formik.values.currentStatus}
              error={Boolean(
                formik.touched.currentStatus && formik.errors.currentStatus
              )}
              fullWidth
              helperText={
                formik.touched.currentStatus && formik.errors.currentStatus
              }
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
            name="personnelId"
            label="Lead Staff name"
            select
            value={formik.values.personnelId}
            error={Boolean(
              formik.touched.personnelId && formik.errors.personnelId
            )}
            fullWidth
            helperText={formik.touched.personnelId && formik.errors.personnelId}
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
            label="Lead staff email address"
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
        <Grid item md={12}>
          <TextField
            name="dqaRole"
            label="DQA Role"
            value={formik.values.dqaRole}
            error={Boolean(formik.touched.dqaRole && formik.errors.dqaRole)}
            fullWidth
            helperText={formik.touched.dqaRole && formik.errors.dqaRole}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            variant="outlined"
            my={2}
          />
        </Grid>
        <Grid item md={12}>
          <TextField
            name="implementingOffice"
            label="Implementing Office"
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
          />
        </Grid>
        <Grid item md={12}>
          <TextField
            name="regionalOffice"
            label="Regional Office"
            value={formik.values.regionalOffice}
            error={Boolean(
              formik.touched.regionalOffice && formik.errors.regionalOffice
            )}
            fullWidth
            helperText={
              formik.touched.regionalOffice && formik.errors.regionalOffice
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            variant="outlined"
            my={2}
          />
        </Grid>
        <Grid item md={12}>
          <TextField
            name="enaSupportOffice"
            label="ENA Support Office"
            value={formik.values.enaSupportOffice}
            error={Boolean(
              formik.touched.enaSupportOffice && formik.errors.enaSupportOffice
            )}
            fullWidth
            helperText={
              formik.touched.enaSupportOffice && formik.errors.enaSupportOffice
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            variant="outlined"
            my={2}
          />
        </Grid>
        <Grid item md={12}>
          <TextField
            name="totalBudget"
            label="Total Budget"
            value={formik.values.totalBudget}
            error={Boolean(
              formik.touched.totalBudget && formik.errors.totalBudget
            )}
            fullWidth
            helperText={formik.touched.totalBudget && formik.errors.totalBudget}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            variant="outlined"
            my={2}
          />
        </Grid>
        <Grid item md={12}>
          <TextField
            name="currencyType"
            label="Currency Type"
            value={formik.values.currencyType}
            error={Boolean(
              formik.touched.currencyType && formik.errors.currencyType
            )}
            fullWidth
            helperText={
              formik.touched.currencyType && formik.errors.currencyType
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            variant="outlined"
            my={2}
          />
        </Grid>
        <Grid item md={12}>
          <TextField
            name="costCentre"
            label="Cost Centre"
            value={formik.values.costCentre}
            error={Boolean(
              formik.touched.costCentre && formik.errors.costCentre
            )}
            fullWidth
            helperText={formik.touched.costCentre && formik.errors.costCentre}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            variant="outlined"
            my={2}
          />
        </Grid>
        {/* <Grid item md={12}>
          <Autocomplete
            name="donorName"
            label="Donor Name"
            options={donorList}
            getOptionLabel={(option) => option.name}
            multiple
            value={formik.values.donorName}
            onChange={(event, newValue) =>
              formik.setFieldValue("donorName", newValue, true)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Donor Name"
                variant="outlined"
                error={Boolean(
                  formik.touched.donorName && formik.errors.donorName
                )}
                helperText={formik.touched.donorName && formik.errors.donorName}
              />
            )}
          />
        </Grid> */}
        {/* Add other fields as needed */}
        <Grid item md={12}>
          <Button variant="contained" color="primary" type="submit">
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default InnovationForm;
