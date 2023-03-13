import React from "react";
import styled from "@emotion/styled";
import {
  Autocomplete as MuiAutocomplete,
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider as MuiDivider,
  Grid,
  Link,
  MenuItem,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAMREFStaffList,
  getLookupMasterItemsByName,
} from "../../../../api/lookup";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { DatePicker } from "@mui/x-date-pickers";
import { getAllThematicAreas } from "../../../../api/thematic-area";
import { getAmrefEntities } from "../../../../api/amref-entity";
import { newAdvocacy } from "../../../../api/advocacy";
import { newQualitativeCountry } from "../../../../api/qualitative-country";
import { newQualitativePeriod } from "../../../../api/qualitative-period";
import { newQualitativeThematicArea } from "../../../../api/qualitative-thematic-area";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Autocomplete = styled(MuiAutocomplete)(spacing);
const Button = styled(MuiButton)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const Divider = styled(MuiDivider)(spacing);

const initialValues = {
  title: "",
  dateOfEntry: "",
  duration_from: "",
  duration_to: "",
  staffNameId: "",
  thematicAreaId: "",
  countryId: "",
  beneficiary: "",
  objective: "",
  advocacyNeed: "",
  expectedResult: "",
};
const AdvocacyForm = ({ processLevelItemId, processLevelTypeId }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  let innovationQualitativeTypeId;
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
      (obj) => obj.lookupItemName === "Advocacy"
    );
    innovationQualitativeTypeId = filterInnovation.lookupItemId;
  }
  const mutation = useMutation({ mutationFn: newAdvocacy });
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
      dateOfEntry: Yup.date().required("Required"),
      duration_from: Yup.date().required("Required"),
      duration_to: Yup.date().required("Required"),
      staffNameId: Yup.string().required("Required"),
      thematicAreaId: Yup.string().required("Required"),
      countryId: Yup.array().required("Required"),
      beneficiary: Yup.string().required("Required"),
      objective: Yup.string().required("Required"),
      advocacyNeed: Yup.string().required("Required"),
      expectedResult: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const saveAdvocacy = {
          createDate: new Date(),
          title: values.title,
          staffNameId: values.staffNameId,
          beneficiary: values.beneficiary,
          advocacyNeed: values.advocacyNeed,
          expectedResult: values.expectedResult,
          processLevelItemId: processLevelItemId,
          processLevelTypeId: processLevelTypeId,
          advocacyObjective: {
            createDate: new Date(),
            objective: values.objective,
          },
          advocacyOutput: {
            createDate: new Date(),
            output: values.output,
          },
        };
        const advocacy = await mutation.mutateAsync(saveAdvocacy);
        let qualitativeCountries = [];
        for (const country of values.countryId) {
          const qualitativeCountry = {
            createDate: new Date(values.dateOfEntry),
            organizationUnitId: country.id,
            qualitativeTypeId: innovationQualitativeTypeId,
            qualitativeTypeItemId: advocacy.data.id,
          };
          qualitativeCountries.push(qualitativeCountry);
        }
        const qualitativePeriod = {
          createDate: new Date(values.dateOfEntry),
          qualitativeTypeId: innovationQualitativeTypeId,
          qualitativeTypeItemId: advocacy.data.id,
          periodTo: values.duration_to,
          periodFrom: values.duration_from,
        };
        const qualitativeThematicArea = {
          createDate: new Date(values.dateOfEntry),
          thematicAreaId: values.thematicAreaId,
          qualitativeTypeId: innovationQualitativeTypeId,
          qualitativeTypeItemId: advocacy.data.id,
        };
        await qualitativeCountryMutation.mutateAsync(qualitativeCountries);
        await qualitativePeriodMutation.mutateAsync(qualitativePeriod);
        await qualitativeThematicAreaMutation.mutateAsync(
          qualitativeThematicArea
        );
        toast("Successfully Created an Advocacy", {
          type: "success",
        });
        await queryClient.invalidateQueries(["getAdvocates"]);
        navigate(
          `/project/design-project/${processLevelItemId}/${processLevelTypeId}`
        );
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

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
            required
            variant="outlined"
            my={2}
            rows={3}
          />
        </Grid>
        <Grid item md={4}>
          <DatePicker
            label="Date Of Entry"
            value={formik.values.dateOfEntry}
            onChange={(value) =>
              formik.setFieldValue("dateOfEntry", value, true)
            }
            renderInput={(params) => (
              <TextField
                error={Boolean(
                  formik.touched.dateOfEntry && formik.errors.dateOfEntry
                )}
                helperText={
                  formik.touched.dateOfEntry && formik.errors.dateOfEntry
                }
                margin="normal"
                name="dateOfEntry"
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
        </Grid>
        <Grid item md={4}>
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
        </Grid>
        <Grid item md={4}>
          <TextField
            name="staffNameId"
            label="Lead/Staff Name"
            select
            required
            value={formik.values.staffNameId}
            error={Boolean(
              formik.touched.staffNameId && formik.errors.staffNameId
            )}
            fullWidth
            helperText={formik.touched.staffNameId && formik.errors.staffNameId}
            onBlur={formik.handleBlur}
            onChange={(e) => {
              formik.handleChange(e);
            }}
            variant="outlined"
            my={2}
          >
            <MenuItem disabled value="">
              Select Staff Name
            </MenuItem>
            {!isLoadingStaffList && !isErrorStaffList
              ? staffListData.data.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.firstName} {option.lastName}
                  </MenuItem>
                ))
              : []}
          </TextField>
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
            name="objective"
            label="What is the advocacy objective?"
            value={formik.values.objective}
            error={Boolean(formik.touched.objective && formik.errors.objective)}
            fullWidth
            helperText={formik.touched.objective && formik.errors.objective}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            multiline
            required
            variant="outlined"
            my={2}
            rows={3}
          />
        </Grid>
        <Grid item md={12}>
          <TextField
            name="beneficiary"
            label="Who are the target beneficiaries?"
            value={formik.values.beneficiary}
            error={Boolean(
              formik.touched.beneficiary && formik.errors.beneficiary
            )}
            fullWidth
            helperText={formik.touched.beneficiary && formik.errors.beneficiary}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            multiline
            required
            variant="outlined"
            my={2}
            rows={3}
          />
        </Grid>
        <Grid item md={12}>
          <TextField
            name="advocacyNeed"
            label="Why was this advocacy needed (in your country/context)? *this will serve as the baseline"
            value={formik.values.advocacyNeed}
            error={Boolean(
              formik.touched.advocacyNeed && formik.errors.advocacyNeed
            )}
            fullWidth
            helperText={
              formik.touched.advocacyNeed && formik.errors.advocacyNeed
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            multiline
            required
            variant="outlined"
            my={2}
            rows={3}
          />
        </Grid>
        <Grid item md={12}>
          <TextField
            name="expectedResult"
            label="What are the expected results of the advocacy?"
            value={formik.values.expectedResult}
            error={Boolean(
              formik.touched.expectedResult && formik.errors.expectedResult
            )}
            fullWidth
            helperText={
              formik.touched.expectedResult && formik.errors.expectedResult
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            multiline
            required
            variant="outlined"
            my={2}
            rows={3}
          />
        </Grid>
        <Grid item md={12}>
          <TextField
            name="output"
            label="Expected final concrete outputs at the end of the strategy (documents: e.g. standard, policy, guideline etc.)"
            value={formik.values.output}
            error={Boolean(formik.touched.output && formik.errors.output)}
            fullWidth
            helperText={formik.touched.output && formik.errors.output}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            multiline
            required
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

const Advocacy = () => {
  let { processLevelItemId, processLevelTypeId } = useParams();
  return (
    <React.Fragment>
      <Helmet title="New Advocacy" />
      <Typography variant="h3" gutterBottom display="inline">
        New Advocacy
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link
          component={NavLink}
          to={`/project/design-project/${processLevelItemId}/${processLevelTypeId}`}
        >
          Project Design
        </Link>
        <Typography>New Advocacy</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <AdvocacyForm
                processLevelItemId={processLevelItemId}
                processLevelTypeId={processLevelTypeId}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};
export default Advocacy;
