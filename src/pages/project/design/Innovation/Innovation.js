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
  title: "",
  duration_from: "",
  duration_to: "",
  staffNameId: "",
  thematicAreaId: "",
  countryId: [],
  proposedSolution: "",
  targetBeneficiary: "",
  difference: "",
  scaling: "",
  sustainability: "",
  whyInnovative: "",
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
      title: Yup.string().required("Required"),
      duration_from: Yup.date().required("Required"),
      duration_to: Yup.date().required("Required"),
      thematicAreaId: Yup.string().required("Required"),
      countryId: Yup.array().required("Required"),
      staffNameId: Yup.object().required("Required"),
      proposedSolution: Yup.string().required("Required"),
      targetBeneficiary: Yup.string().required("Required"),
      difference: Yup.string().required("Required"),
      scaling: Yup.string().required("Required"),
      sustainability: Yup.string().required("Required"),
      whyInnovative: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const guid = new Guid();
        const saveInnovation = {
          id: id ? id : guid.toString(),
          createDate: new Date(),
          title: values.title,
          staffNameId: values.staffNameId.id,
          proposedSolution: values.proposedSolution,
          targetBeneficiary: values.targetBeneficiary,
          difference: values.difference,
          scaling: values.scaling,
          sustainability: values.sustainability,
          processLevelItemId: processLevelItemId,
          processLevelTypeId: processLevelTypeId,
          whyInnovative: values.whyInnovative,
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
            name="title"
            label="Title"
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
        <Grid item md={4}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="From"
              value={formik.values.duration_from}
              onChange={(value) =>
                formik.setFieldValue("duration_from", value, true)
              }
              renderInput={(params) => (
                <TextField
                  error={Boolean(
                    formik.touched.duration_from && formik.errors.duration_from
                  )}
                  helperText={
                    formik.touched.duration_from && formik.errors.duration_from
                  }
                  margin="normal"
                  name="duration_from"
                  variant="outlined"
                  fullWidth
                  my={2}
                  {...params}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item md={4}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="To"
              value={formik.values.duration_to}
              onChange={(value) =>
                formik.setFieldValue("duration_to", value, true)
              }
              renderInput={(params) => (
                <TextField
                  error={Boolean(
                    formik.touched.duration_to && formik.errors.duration_to
                  )}
                  helperText={
                    formik.touched.duration_to && formik.errors.duration_to
                  }
                  margin="normal"
                  name="duration_to"
                  variant="outlined"
                  fullWidth
                  my={2}
                  {...params}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item md={4}>
          <Autocomplete
            id="staffNameId"
            options={
              !isLoadingStaffList && !isErrorStaffList ? staffListData.data : []
            }
            getOptionLabel={(staff) => `${staff?.firstName} ${staff?.lastName}`}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.id}>
                  {option.firstName} {option.lastName}
                </li>
              );
            }}
            onChange={(_, val) => formik.setFieldValue("staffNameId", val)}
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
                label="Lead/Staff Name"
                name="staffNameId"
                variant="outlined"
                my={2}
              />
            )}
          />
        </Grid>
        <Grid item md={4}>
          <TextField
            name="thematicAreaId"
            label="Thematic Area(s)"
            select
            value={formik.values.thematicAreaId}
            error={Boolean(
              formik.touched.thematicAreaId && formik.errors.thematicAreaId
            )}
            fullWidth
            helperText={
              formik.touched.thematicAreaId && formik.errors.thematicAreaId
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            variant="outlined"
            my={2}
          >
            <MenuItem disabled value="">
              Select Thematic Area(s)
            </MenuItem>
            {!isLoadingThematicAreas && !isErrorThematicAreas
              ? ThematicAreas.data.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}({option.initial})
                  </MenuItem>
                ))
              : []}
          </TextField>
        </Grid>
        <Grid item md={4}>
          <Autocomplete
            id="countryId"
            multiple
            options={
              !isLoadingAmrefEntities && !isErrorAmrefEntities
                ? amrefEntities.data
                : []
            }
            getOptionLabel={(entity) => `${entity?.name}`}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.id}>
                  {option.name}
                </li>
              );
            }}
            onChange={(_, val) => formik.setFieldValue("countryId", val)}
            value={formik.values.countryId}
            renderInput={(params) => (
              <TextField
                {...params}
                error={Boolean(
                  formik.touched.countryId && formik.errors.countryId
                )}
                fullWidth
                helperText={formik.touched.countryId && formik.errors.countryId}
                label="Select Countries/entities of implementation"
                name="countryId"
                variant="outlined"
                my={2}
              />
            )}
          />
        </Grid>
        <Grid item md={12}>
          <TextField
            name="proposedSolution"
            label="What is the proposed solution?"
            value={formik.values.proposedSolution}
            error={Boolean(
              formik.touched.proposedSolution && formik.errors.proposedSolution
            )}
            fullWidth
            helperText={
              formik.touched.proposedSolution && formik.errors.proposedSolution
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
            name="targetBeneficiary"
            label="Who are the target beneficiaries?"
            value={formik.values.targetBeneficiary}
            error={Boolean(
              formik.touched.targetBeneficiary &&
                formik.errors.targetBeneficiary
            )}
            fullWidth
            helperText={
              formik.touched.targetBeneficiary &&
              formik.errors.targetBeneficiary
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
            name="difference"
            label="What difference will the innovation make as a result?"
            value={formik.values.difference}
            error={Boolean(
              formik.touched.difference && formik.errors.difference
            )}
            fullWidth
            helperText={formik.touched.difference && formik.errors.difference}
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
            name="whyInnovative"
            label="Why is this innovative (in your country/context)?"
            value={formik.values.whyInnovative}
            error={Boolean(
              formik.touched.whyInnovative && formik.errors.whyInnovative
            )}
            fullWidth
            helperText={
              formik.touched.whyInnovative && formik.errors.whyInnovative
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
            name="scaling"
            label="How will this be scaled up?(if it's not scaled up why)"
            value={formik.values.scaling}
            error={Boolean(formik.touched.scaling && formik.errors.scaling)}
            fullWidth
            helperText={formik.touched.scaling && formik.errors.scaling}
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
            name="sustainability"
            label="How will this innovation be sustained in the next three years?"
            value={formik.values.sustainability}
            error={Boolean(
              formik.touched.sustainability && formik.errors.sustainability
            )}
            fullWidth
            helperText={
              formik.touched.sustainability && formik.errors.sustainability
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            multiline
            variant="outlined"
            my={2}
            rows={3}
          />
        </Grid>
      </Grid>
      <Button type="submit" variant="contained" color="primary" mt={3}>
        Save
      </Button>
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
