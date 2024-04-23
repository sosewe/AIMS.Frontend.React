import React, { useEffect, useState, useCallback } from "react";
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
  Breadcrumbs as MuiBreadcrumbs,
  Divider as MuiDivider,
  Box,
  CircularProgress,
} from "@mui/material";
import * as Yup from "yup";
import { display, spacing } from "@mui/system";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { Check, ChevronLeft } from "react-feather";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Guid } from "../../../../utils/guid";
import { getInnovationByMonitoringPeriod } from "../../../../api/innovation";
import { newInnovationMonitoringScaleUp } from "../../../../api/innovation-monitoring-scaleup";
import { getInnovationMonitoringTechnicalReviewByInnovationId } from "../../../../api/innovation-monitoring-technical-review";
import { getLookupMasterItemsByName } from "../../../../api/lookup";
import useKeyCloakAuth from "../../../../hooks/useKeyCloakAuth";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);
const Divider = styled(MuiDivider)(spacing);

const initialValues = {
  newCountriesScaledUp: "",
  newRegionsWithinCountries: "",
  newTargetGroups: "",
  newProportionScaledUp: "",
  innovationClosingStatus: "",
  innovationClosingReason: "",
};

const ScaleUpForm = (props) => {
  const [editId, setEditId] = useState();
  const id = props.innovationId;
  const geoFocusId = props.projectLocationId;
  const reportingFrequencyId = props.reportingPeriod;
  const reportingYearId = props.year;
  const MAX_COUNT = 5;
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isScalable, setIsScalable] = useState(true);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const user = useKeyCloakAuth();

  const {
    data: innovationMonitoring,
    isLoading: isLoadingInnovationMonitoring,
    isError: isErrorInnovationMonitoring,
  } = useQuery(
    [
      "getInnovationByMonitoringPeriod",
      id,
      geoFocusId,
      reportingFrequencyId,
      reportingYearId,
    ],
    getInnovationByMonitoringPeriod,
    { enabled: !!id }
  );

  const {
    isLoading: isLoadingInnovationClosingStatus,
    data: InnovationClosingStatusData,
  } = useQuery(
    ["innovationClosingStatus", "InnovationClosingStatus"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const {
    isLoading: isLoadingInnovationClosingReasons,
    data: innovationClosingReasonsData,
  } = useQuery(
    ["innovationClosingReasons", "InnovationClosingReasons"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const { isLoading: isLoadingTechnicalReviewData, data: TechnicalReviewData } =
    useQuery(
      ["getInnovationMonitoringTechnicalReviewByInnovationId", id],
      getInnovationMonitoringTechnicalReviewByInnovationId,
      { enabled: !!id }
    );

  const handleStatusChange = (e) => {
    const status = e.target.value;
    console.log("e.target.value " + JSON.stringify(e.target));
    if (status === "4803db33-d778-4530-5172-08dc11e4499b") {
      setIsOpen(true);
    }

    if (status === "1d2c305f-1f20-426a-5171-08dc11e4499b") {
      setIsOpen(false);
    }
  };

  const mutation = useMutation({
    mutationFn: newInnovationMonitoringScaleUp,
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      newCountriesScaledUp: Yup.number().required("Required"),
      newRegionsWithinCountries: Yup.number().required("Required"),
      newTargetGroups: Yup.number().required("Required"),
      newProportionScaledUp: Yup.number().required("Required"),
      innovationClosingStatus: Yup.string().required("Required"),
      innovationClosingReason: Yup.string().nullable(true),
    }),
    onSubmit: async (values) => {
      try {
        const saveScaleUp = {
          id: editId ?? new Guid().toString(),
          innovationId: id,
          newCountriesScaledUp: values.newCountriesScaledUp,
          newRegionsWithinCountries: values.newRegionsWithinCountries,
          newTargetGroups: values.newTargetGroups,
          newProportionScaledUp: values.newProportionScaledUp,
          innovationClosingStatus: values.innovationClosingStatus,
          innovationClosingReason: values.innovationClosingReason,
          reportingFrequencyId: reportingFrequencyId,
          reportingFrequency: "",
          implementationYearId: reportingYearId,
          implementationYear: "",
          administrativeUnitId: geoFocusId,
          createDate: new Date(),
          userId: user.sub,
        };

        await mutation.mutateAsync(saveScaleUp);

        toast("Successfully Updated Scale Up Monitoring", {
          type: "success",
        });
        await queryClient.invalidateQueries([
          "getInnovationMonitoringScaleUpByInnovationId",
        ]);
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  useEffect(() => {
    function setCurrentFormValues() {
      if (
        !isLoadingInnovationMonitoring &&
        !isErrorInnovationMonitoring &&
        innovationMonitoring &&
        innovationMonitoring.data
      ) {
        let data =
          innovationMonitoring.data?.innovationTechnicalReviewAtClosures[0];
        const effectiveness = data?.hasInnovationMetEffectivenessCriteria;
        const scalable = data?.canInnovationBeScaledUp;
        if (
          effectiveness === "e00518ba-7cc9-11eb-9439-0242ac130002" &&
          scalable === "e00518ba-7cc9-11eb-9439-0242ac130002"
        ) {
          setIsScalable(false);
        }

        data = innovationMonitoring.data.innovationScaleUps[0];
        formik.setValues({
          innovationId: id,
          newCountriesScaledUp: data?.newCountriesScaledUp,
          newRegionsWithinCountries: data?.newRegionsWithinCountries,
          newTargetGroups: data?.newTargetGroups,
          newProportionScaledUp: data?.newProportionScaledUp,
          innovationClosingStatus: data?.innovationClosingStatus,
          innovationClosingReason: data?.innovationClosingReason,
        });

        setEditId(data?.id);
      }
    }
    setCurrentFormValues();
  }, [
    innovationMonitoring,
    isErrorInnovationMonitoring,
    isLoadingInnovationMonitoring,
  ]);

  const handleActionChange = useCallback();

  return (
    <form onSubmit={formik.handleSubmit}>
      {formik.isSubmitting ? (
        <Box display="flex" justifyContent="center" my={6}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container item spacing={2}>
          <Grid container spacing={3}>
            {!isScalable ? (
              <Grid item md={12}>
                <Typography
                  variant="h3"
                  gutterBottom
                  display="inline"
                  style={{ color: "#dc3545" }}
                >
                  NB: Innovation Not Scalable
                </Typography>
              </Grid>
            ) : (
              <>
                <Grid item md={6}>
                  <TextField
                    name="newCountriesScaledUp"
                    label="New countries scaled up to "
                    value={formik.values.newCountriesScaledUp}
                    type="number"
                    error={Boolean(
                      formik.touched.newCountriesScaledUp &&
                        formik.errors.newCountriesScaledUp
                    )}
                    fullWidth
                    helperText={
                      formik.touched.newCountriesScaledUp &&
                      formik.errors.newCountriesScaledUp
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  />
                </Grid>

                <Grid item md={6}>
                  <TextField
                    name="newRegionsWithinCountries"
                    label="Number of new regions within countries"
                    value={formik.values.newRegionsWithinCountries}
                    type="number"
                    error={Boolean(
                      formik.touched.newRegionsWithinCountries &&
                        formik.errors.newRegionsWithinCountries
                    )}
                    fullWidth
                    helperText={
                      formik.touched.newRegionsWithinCountries &&
                      formik.errors.newRegionsWithinCountries
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    name="newTargetGroups"
                    label="Number of new target groups "
                    value={formik.values.newTargetGroups}
                    type="number"
                    error={Boolean(
                      formik.touched.newTargetGroups &&
                        formik.errors.newTargetGroups
                    )}
                    fullWidth
                    helperText={
                      formik.touched.newTargetGroups &&
                      formik.errors.newTargetGroups
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                    rows={3}
                  />
                </Grid>

                <Grid item md={6}>
                  <TextField
                    name="newProportionScaledUp"
                    label="Proportion of users where Innovation has been Scaled up"
                    value={formik.values.newProportionScaledUp}
                    type="number"
                    InputProps={{ inputProps: { min: 0, max: 100 } }}
                    error={Boolean(
                      formik.touched.newProportionScaledUp &&
                        formik.errors.newProportionScaledUp
                    )}
                    fullWidth
                    helperText={
                      formik.touched.newProportionScaledUp &&
                      formik.errors.newProportionScaledUp
                    }
                    onBlur={formik.handleBlur}
                    onChange={(e) => {
                      formik.handleChange(e);
                      if (e.target.value > 100) {
                        formik.setFieldValue("newProportionScaledUp", 100);
                      }
                    }}
                    variant="outlined"
                    my={2}
                  />
                </Grid>

                <Grid item md={12}>
                  <TextField
                    name="innovationClosingStatus"
                    label="What is the closing status of this innovation?"
                    select
                    value={formik.values.innovationClosingStatus}
                    error={Boolean(
                      formik.touched.innovationClosingStatus &&
                        formik.errors.innovationClosingStatus
                    )}
                    fullWidth
                    helperText={
                      formik.touched.innovationClosingStatus &&
                      formik.errors.innovationClosingStatus
                    }
                    onBlur={formik.handleBlur}
                    onChange={(e) => {
                      formik.handleChange(e);
                      formik.setFieldValue("innovationClosingReason", "");
                      handleStatusChange(e);
                    }}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select
                    </MenuItem>
                    {!isLoadingInnovationClosingStatus
                      ? InnovationClosingStatusData.data.map((option) => (
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

                {isOpen ? (
                  <Grid item md={12}>
                    <TextField
                      name="innovationClosingReason"
                      label="Reason for not continuing"
                      select
                      value={formik.values.innovationClosingReason}
                      error={Boolean(
                        formik.touched.innovationClosingReason &&
                          formik.errors.innovationClosingReason
                      )}
                      fullWidth
                      helperText={
                        formik.touched.innovationClosingReason &&
                        formik.errors.innovationClosingReason
                      }
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      variant="outlined"
                      my={2}
                    >
                      <MenuItem disabled value="">
                        Select
                      </MenuItem>
                      {!isLoadingInnovationClosingReasons
                        ? innovationClosingReasonsData.data.map((option) => (
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
                ) : (
                  <></>
                )}

                <Grid item mt={5} md={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    mt={3}
                    ml={3}
                  >
                    <Check /> Save changes
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      )}
    </form>
  );
};

const ScaleUp = (props) => {
  let {
    processLevelItemId,
    processLevelTypeId,
    innovationId,
    projectLocationId,
    reportingPeriod,
    year,
  } = useParams();
  return (
    <React.Fragment>
      <Helmet title="New Innovation Monitoring" />
      <Typography variant="h5" gutterBottom display="inline">
        Scale Up
      </Typography>
      <Divider my={2} />
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <ScaleUpForm
                processLevelItemId={processLevelItemId}
                processLevelTypeId={processLevelTypeId}
                innovationId={innovationId}
                projectLocationId={projectLocationId}
                reportingPeriod={reportingPeriod}
                year={year}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default ScaleUp;
