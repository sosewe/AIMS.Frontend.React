import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import styled from "@emotion/styled";
import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  CircularProgress,
  Divider as MuiDivider,
  Grid,
  Link,
  MenuItem,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { NavLink, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAdministrativeProgrammeById,
  newAdministrativeProgramme,
} from "../../api/administrative-programme";
import { getLookupMasterItemsByName } from "../../api/lookup";
import { Guid } from "../../utils/guid";
import { getAllIndicators, newIndicator } from "../../api/indicator";
import { getProgrammes } from "../../api/programmes";
import {
  getProgrammeThematicAreaSubThemes,
  GetUniqueSubThemesByThematicAreaId,
  GetUniqueThematicAreasByProgrammeId,
} from "../../api/programme-thematic-area-sub-theme";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const initialValues = {
  name: "",
  code: "",
  indicatorTypeId: "",
  indicatorCalculationId: "",
  definition: "",
  indicatorMeasure: "",
  numeratorId: "",
  denominatorId: "",
  indicatorCumulative: "",
  indicatorProgrammeId: "",
  indicatorThematicAreaId: "",
  indicatorSubThemeId: "",
};

const IndicatorProgrammesForm = () => {

};

const NewIndicatorForm = () => {
  let { id } = useParams();
  const [indicatorProgrammeId, setIndicatorProgrammeId] = useState();
  const [thematicAreaId, setThematicAreaId] = useState();
  const { data: OrganizationUnitData } = useQuery(
    ["getAdministrativeProgrammeById", id],
    getAdministrativeProgrammeById,
    {
      refetchOnWindowFocus: false,
      enabled: !!id,
    }
  );
  // fetch all indicators
  const { data, isLoading } = useQuery(["getAllIndicators"], getAllIndicators, {
    retry: 0,
  });
  // fetch IndicatorType Lookup
  const { data: indicatorTypeData, isLoading: isLoadingIndicatorType } =
    useQuery(["IndicatorType", "IndicatorType"], getLookupMasterItemsByName, {
      refetchOnWindowFocus: false,
    });
  // fetch IndicatorMeasure Lookup
  const { data: indicatorMeasureData, isLoading: isLoadingIndicatorMeasure } =
    useQuery(
      ["IndicatorMeasure", "IndicatorMeasure"],
      getLookupMasterItemsByName,
      {
        refetchOnWindowFocus: false,
      }
    );
  // fetch YesNo Lookup
  const { data: yesNoData, isLoading: isLoadingYesNo } = useQuery(
    ["YesNo", "YesNo"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );
  const { data: programmesData, isLoading: isLoadingProgrammes } = useQuery(
    ["getProgrammes"],
    getProgrammes
  );
  const {
    data: thematicAreasData,
    isLoading: isLoadingThematicAreas,
    isError,
  } = useQuery(
    ["GetUniqueThematicAreasByProgrammeId", indicatorProgrammeId],
    GetUniqueThematicAreasByProgrammeId,
    { enabled: !!indicatorProgrammeId }
  );
  const {
    data: subThemesData,
    isLoading: isLoadingSubThemes,
    isError: isErrorSubThemes,
  } = useQuery(
    [
      "GetUniqueSubThemesByThematicAreaId",
      indicatorProgrammeId,
      thematicAreaId,
    ],
    GetUniqueSubThemesByThematicAreaId,
    { enabled: !!indicatorProgrammeId && !!thematicAreaId }
  );
  const mutation = useMutation({ mutationFn: newIndicator });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Required"),
      code: Yup.string().required("Required"),
      indicatorTypeId: Yup.string().required("Required"),
      indicatorCalculationId: Yup.string().required("Required"),
      definition: Yup.string().required("Required"),
      indicatorMeasure: Yup.string().required("Required"),
      numeratorId: Yup.string().required("Required"),
      denominatorId: Yup.string().required("Required"),
      indicatorCumulative: Yup.string().required("Required"),
      indicatorProgrammeId: Yup.object().required("Required"),
      indicatorThematicAreaId: Yup.string().required("Required"),
      indicatorSubThemeId: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      values.createDate = new Date();
      if (id) {
        values.id = id;
      } else {
        values.id = new Guid().toString();
      }
      try {
        await mutation.mutateAsync(values);
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
  useEffect(() => {
    function setCurrentFormValues() {
      // if (OrganizationUnitData) {
      //   formik.setValues({
      //     shortTitle: OrganizationUnitData.data.shortTitle,
      //     longTitle: OrganizationUnitData.data.longTitle,
      //     description: OrganizationUnitData.data.description,
      //     goal: OrganizationUnitData.data.goal,
      //     organisationUnitId: OrganizationUnitData.data.organisationUnitId,
      //     managerName:
      //       managerName && managerName.length > 0 ? managerName[0] : "",
      //     managerEmail: OrganizationUnitData.data.managerEmail,
      //   });
      // }
    }
    setCurrentFormValues();
  }, []);

  const onProgrammeSelected = (e) => {
    setIndicatorProgrammeId(e.target.value.id);
    formik.setFieldValue("indicatorThematicAreaId", "");
  };

  const onThematicAreaSelected = (e) => {
    setThematicAreaId(e.target.value);
  };

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
                    NEW INDICATOR
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item md={12}>
                  <TextField
                    name="name"
                    label="Indicator Name"
                    required
                    value={formik.values.name}
                    error={Boolean(formik.touched.name && formik.errors.name)}
                    fullWidth
                    helperText={formik.touched.name && formik.errors.name}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item md={4}>
                  <TextField
                    name="code"
                    label="Indicator Code"
                    required
                    value={formik.values.code}
                    error={Boolean(formik.touched.code && formik.errors.code)}
                    fullWidth
                    helperText={formik.touched.code && formik.errors.code}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  />
                </Grid>
                <Grid item md={4}>
                  <TextField
                    name="indicatorTypeId"
                    label="Indicator Type"
                    required
                    select
                    value={formik.values.indicatorTypeId}
                    error={Boolean(
                      formik.touched.indicatorTypeId &&
                        formik.errors.indicatorTypeId
                    )}
                    fullWidth
                    helperText={
                      formik.touched.indicatorTypeId &&
                      formik.errors.indicatorTypeId
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Indicator Type
                    </MenuItem>
                    {!isLoadingIndicatorType
                      ? indicatorTypeData.data.map((option) => (
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
                    name="indicatorMeasure"
                    label="Indicator Measure"
                    required
                    select
                    value={formik.values.indicatorMeasure}
                    error={Boolean(
                      formik.touched.indicatorMeasure &&
                        formik.errors.indicatorMeasure
                    )}
                    fullWidth
                    helperText={
                      formik.touched.indicatorMeasure &&
                      formik.errors.indicatorMeasure
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Indicator Measure
                    </MenuItem>
                    {!isLoadingIndicatorMeasure
                      ? indicatorMeasureData.data.map((option) => (
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
              <TextField
                name="definition"
                label="Definition"
                value={formik.values.definition}
                error={Boolean(
                  formik.touched.definition && formik.errors.definition
                )}
                fullWidth
                helperText={
                  formik.touched.definition && formik.errors.definition
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                multiline
                required
                variant="outlined"
                rows={3}
                my={2}
              />
              <Grid container spacing={2}>
                <Grid item md={3}>
                  <TextField
                    name="indicatorCalculationId"
                    label="Indicator Calculation"
                    required
                    select
                    value={formik.values.indicatorCalculationId}
                    error={Boolean(
                      formik.touched.indicatorCalculationId &&
                        formik.errors.indicatorCalculationId
                    )}
                    fullWidth
                    helperText={
                      formik.touched.indicatorCalculationId &&
                      formik.errors.indicatorCalculationId
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Indicator Calculation
                    </MenuItem>
                    {!isLoadingYesNo
                      ? yesNoData.data.map((option) => (
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
                    name="numeratorId"
                    label="Indicator Numerator"
                    required
                    select
                    value={formik.values.numeratorId}
                    error={Boolean(
                      formik.touched.numeratorId && formik.errors.numeratorId
                    )}
                    fullWidth
                    helperText={
                      formik.touched.numeratorId && formik.errors.numeratorId
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Indicator Numerator
                    </MenuItem>
                    {!isLoading
                      ? data.data.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))
                      : []}
                  </TextField>
                </Grid>
                <Grid item md={3}>
                  <TextField
                    name="denominatorId"
                    label="Indicator Denominator"
                    required
                    select
                    value={formik.values.denominatorId}
                    error={Boolean(
                      formik.touched.denominatorId &&
                        formik.errors.denominatorId
                    )}
                    fullWidth
                    helperText={
                      formik.touched.denominatorId &&
                      formik.errors.denominatorId
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Indicator Denominator
                    </MenuItem>
                    {!isLoading
                      ? data.data.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))
                      : []}
                  </TextField>
                </Grid>
                <Grid item md={3}>
                  <TextField
                    name="indicatorCumulative"
                    label="Indicator Cumulative"
                    required
                    select
                    value={formik.values.indicatorCumulative}
                    error={Boolean(
                      formik.touched.indicatorCumulative &&
                        formik.errors.indicatorCumulative
                    )}
                    fullWidth
                    helperText={
                      formik.touched.indicatorCumulative &&
                      formik.errors.indicatorCumulative
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Indicator Cumulative
                    </MenuItem>
                    {!isLoadingYesNo
                      ? yesNoData.data.map((option) => (
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
                  <Card
                    variant="outlined"
                    style={{ borderStyle: "dashed", borderRadius: 1 }}
                  >
                    <Grid container spacing={2}>
                      <Grid item md={3}>
                        <TextField
                          name="indicatorProgrammeId"
                          label="Programme"
                          required
                          select
                          value={formik.values.indicatorProgrammeId}
                          error={Boolean(
                            formik.touched.indicatorProgrammeId &&
                              formik.errors.indicatorProgrammeId
                          )}
                          fullWidth
                          helperText={
                            formik.touched.indicatorProgrammeId &&
                            formik.errors.indicatorProgrammeId
                          }
                          onBlur={formik.handleBlur}
                          onChange={(e) => {
                            formik.handleChange(e);
                            onProgrammeSelected(e);
                          }}
                          variant="outlined"
                          my={2}
                        >
                          <MenuItem disabled value="">
                            Select Programme
                          </MenuItem>
                          {!isLoadingProgrammes
                            ? programmesData.data.map((option) => (
                                <MenuItem key={option.id} value={option}>
                                  {option.code + " - " + option.name}
                                </MenuItem>
                              ))
                            : []}
                        </TextField>
                      </Grid>
                      <Grid item md={3}>
                        <TextField
                          name="indicatorThematicAreaId"
                          label="Thematic Area"
                          required
                          select
                          value={formik.values.indicatorThematicAreaId}
                          error={Boolean(
                            formik.touched.indicatorThematicAreaId &&
                              formik.errors.indicatorThematicAreaId
                          )}
                          fullWidth
                          helperText={
                            formik.touched.indicatorThematicAreaId &&
                            formik.errors.indicatorThematicAreaId
                          }
                          onBlur={formik.handleBlur}
                          onChange={(e) => {
                            formik.handleChange(e);
                            onThematicAreaSelected(e);
                          }}
                          variant="outlined"
                          my={2}
                        >
                          <MenuItem disabled value="">
                            Select Thematic Area
                          </MenuItem>
                          {!isLoadingThematicAreas && !isError
                            ? thematicAreasData.data.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                  {option.code + " - " + option.name}
                                </MenuItem>
                              ))
                            : []}
                        </TextField>
                      </Grid>
                      <Grid item md={3}>
                        <TextField
                          name="indicatorSubThemeId"
                          label="Sub Theme"
                          required
                          select
                          value={formik.values.indicatorSubThemeId}
                          error={Boolean(
                            formik.touched.indicatorSubThemeId &&
                              formik.errors.indicatorSubThemeId
                          )}
                          fullWidth
                          helperText={
                            formik.touched.indicatorSubThemeId &&
                            formik.errors.indicatorSubThemeId
                          }
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          variant="outlined"
                          my={2}
                        >
                          <MenuItem disabled value="">
                            Select Sub Theme
                          </MenuItem>
                          {!isLoadingSubThemes && !isErrorSubThemes
                            ? subThemesData.data.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                  {option.code + " - " + option.name}
                                </MenuItem>
                              ))
                            : []}
                        </TextField>
                      </Grid>
                      <Grid item md={3}></Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
              <Button type="submit" variant="contained" color="primary" mt={3}>
                Save changes
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </form>
  );
};

const NewIndicator = () => {
  return (
    <React.Fragment>
      <Helmet title="New Indicator" />
      <Typography variant="h3" gutterBottom display="inline">
        New Indicator
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/indicator/indicators">
          Indicators
        </Link>
        <Typography>New Indicator</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <NewIndicatorForm />
    </React.Fragment>
  );
};
export default NewIndicator;
