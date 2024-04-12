import styled from "@emotion/styled";
import React, { useEffect, useState, useCallback } from "react";

import {
  Box,
  CircularProgress,
  Grid,
  Link,
  Autocomplete as MuiAutocomplete,
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider as MuiDivider,
  MenuItem,
  Paper as MuiPaper,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { spacing } from "@mui/system";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { Check, ChevronLeft } from "react-feather";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import {
  newTechnicalAssistanceQuarterlyUpdate,
  getTechnicalAssistanceQuarterlyUpdateByMonitoringPeriod,
} from "../../../../api/technical-assistance-quarterly-update";
import { getLookupMasterItemsByName } from "../../../../api/lookup";
import { Guid } from "../../../../utils/guid";

const Paper = styled(MuiPaper)(spacing);
const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Autocomplete = styled(MuiAutocomplete)(spacing);
const Button = styled(MuiButton)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const Divider = styled(MuiDivider)(spacing);

const initialValues = {
  year: "",
  quarter: "",
  bestModelsApproaches: "",
  resultOutcomeAnalysis: "",
  sharedSuccessInsights: "",
  sharedROIInsights: "",
  systemicChanges: "",
  revisionAdjustments: "",
};

const QuarterlyUpdateForm = (props) => {
  const [editId, setEditId] = useState();
  const id = props.technicalAssistanceId;
  const geoFocusId = props.projectLocationId;
  const reportingFrequencyId = props.reportingPeriod;
  const reportingYearId = props.year;
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: technicalAssistanceQuarterlyUpdate,
    isLoading: isLoadingTechnicalAssistanceQuarterlyUpdate,
    isError: isErrorTechnicalAssistanceQuarterlyUpdate,
  } = useQuery(
    [
      "getTechnicalAssistanceQuarterlyUpdateByMonitoringPeriod",
      id,
      geoFocusId,
      reportingFrequencyId,
      reportingYearId,
    ],
    getTechnicalAssistanceQuarterlyUpdateByMonitoringPeriod,
    {
      enabled: !!id,
    }
  );

  const mutationQuarterlyUpdate = useMutation({
    mutationFn: newTechnicalAssistanceQuarterlyUpdate,
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      bestModelsApproaches: Yup.string().required("Required"),
      resultOutcomeAnalysis: Yup.string().required("Required"),
      sharedSuccessInsights: Yup.string().required("Required"),
      sharedROIInsights: Yup.string().required("Required"),
      systemicChanges: Yup.string().required("Required"),
      revisionAdjustments: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const saveQuarterlyUpdate = {
          id: editId ?? new Guid().toString(),
          technicalAssistanceId: id,
          bestModelsApproaches: values.bestModelsApproaches,
          resultOutcomeAnalysis: values.resultOutcomeAnalysis,
          sharedSuccessInsights: values.sharedSuccessInsights,
          sharedROIInsights: values.sharedROIInsights,
          systemicChanges: values.systemicChanges,
          revisionAdjustments: values.revisionAdjustments,
          reportingFrequencyId: reportingFrequencyId,
          reportingFrequency: "",
          implementationYearId: reportingYearId,
          implementationYear: "",
          administrativeUnitId: geoFocusId,
          createDate: new Date(),
        };
        await mutationQuarterlyUpdate.mutateAsync(saveQuarterlyUpdate);

        toast("Successfully Updated Quarterly Monitoring", {
          type: "success",
        });

        await queryClient.invalidateQueries([
          "getTechnicalAssistanceQuarterlyUpdateByTechnicalAssistanceId",
        ]);

        handleTechnicalAssistanceActionChange(0, true);
      } catch (error) {
        console.log(error);
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  console.log();
  useEffect(() => {
    function setCurrentFormValues() {
      if (
        !isLoadingTechnicalAssistanceQuarterlyUpdate &&
        !isErrorTechnicalAssistanceQuarterlyUpdate &&
        technicalAssistanceQuarterlyUpdate &&
        technicalAssistanceQuarterlyUpdate.data
      ) {
        formik.setValues({
          bestModelsApproaches:
            technicalAssistanceQuarterlyUpdate.data.bestModelsApproaches,
          resultOutcomeAnalysis:
            technicalAssistanceQuarterlyUpdate.data.resultOutcomeAnalysis,
          sharedSuccessInsights:
            technicalAssistanceQuarterlyUpdate.data.sharedSuccessInsights,
          sharedROIInsights:
            technicalAssistanceQuarterlyUpdate.data.sharedROIInsights,
          systemicChanges:
            technicalAssistanceQuarterlyUpdate.data.systemicChanges,
          revisionAdjustments:
            technicalAssistanceQuarterlyUpdate.data.revisionAdjustments,
        });

        setEditId(technicalAssistanceQuarterlyUpdate.data.id);
      }
    }
    setCurrentFormValues();
  }, [
    isLoadingTechnicalAssistanceQuarterlyUpdate,
    isErrorTechnicalAssistanceQuarterlyUpdate,
    technicalAssistanceQuarterlyUpdate,
  ]);

  const handleTechnicalAssistanceActionChange = useCallback();

  return (
    <form onSubmit={formik.handleSubmit}>
      {formik.isSubmitting ? (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container item spacing={2}>
          <Grid item md={12} mb={2}>
            <TextField
              name="bestModelsApproaches"
              label="Which TA MODELS and APPROACHES WORK BEST to effect sustainable and transformative change. How should this be interpreted? especially at community level?"
              value={formik.values.bestModelsApproaches}
              error={Boolean(
                formik.touched.bestModelsApproaches &&
                  formik.errors.bestModelsApproaches
              )}
              fullWidth
              helperText={
                formik.touched.bestModelsApproaches &&
                formik.errors.bestModelsApproaches
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              multiline
              variant="outlined"
              rows={3}
            />
          </Grid>

          <Grid item md={12} mb={2}>
            <TextField
              name="resultOutcomeAnalysis"
              label="Analyse the outcomes/changes/results harvested. At what level (community, government, CSO, private etc), do you see the most changes happening? Why?"
              value={formik.values.resultOutcomeAnalysis}
              error={Boolean(
                formik.touched.resultOutcomeAnalysis &&
                  formik.errors.resultOutcomeAnalysis
              )}
              fullWidth
              helperText={
                formik.touched.resultOutcomeAnalysis &&
                formik.errors.resultOutcomeAnalysis
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              multiline
              variant="outlined"
              rows={3}
            />
          </Grid>

          <Grid item md={12} mb={2}>
            <TextField
              name="sharedSuccessInsights"
              label="Share new insights related to both successes and/or challenges/failures derived from your assistance bearing in mind the following learning questions (c) What are the CRITICAL SUCCESS FACTORS for TA in your context?"
              value={formik.values.sharedSuccessInsights}
              error={Boolean(
                formik.touched.sharedSuccessInsights &&
                  formik.errors.sharedSuccessInsights
              )}
              fullWidth
              helperText={
                formik.touched.sharedSuccessInsights &&
                formik.errors.sharedSuccessInsights
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              multiline
              variant="outlined"
              rows={3}
            />
          </Grid>

          <Grid item md={12} mb={2}>
            <TextField
              name="sharedROIInsights"
              label="Share new insights related to both successes and/or challenges/failures derived from your assistance bearing in mind the following learning questions (c) How does Amref TA delivery generate a RETURN ON INVESTMENT? "
              value={formik.values.sharedROIInsights}
              error={Boolean(
                formik.touched.sharedROIInsights &&
                  formik.errors.sharedROIInsights
              )}
              fullWidth
              helperText={
                formik.touched.sharedROIInsights &&
                formik.errors.sharedROIInsights
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              multiline
              variant="outlined"
              rows={3}
            />
          </Grid>

          <Grid item md={12} mb={2}>
            <TextField
              name="systemicChanges"
              label="Describe how will the achievements bring about transformational system change?"
              value={formik.values.systemicChanges}
              error={Boolean(
                formik.touched.systemicChanges && formik.errors.systemicChanges
              )}
              fullWidth
              helperText={
                formik.touched.systemicChanges && formik.errors.systemicChanges
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              multiline
              variant="outlined"
              rows={3}
            />
          </Grid>

          <Grid item md={12} mb={2}>
            <TextField
              name="revisionAdjustments"
              label="As applicable, indicate any major adjustments in strategies, targets or key outcomes and outputs? (please also indicate the kind of support required "
              value={formik.values.revisionAdjustments}
              error={Boolean(
                formik.touched.revisionAdjustments &&
                  formik.errors.revisionAdjustments
              )}
              fullWidth
              helperText={
                formik.touched.revisionAdjustments &&
                formik.errors.revisionAdjustments
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              multiline
              variant="outlined"
              rows={3}
            />
          </Grid>

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
        </Grid>
      )}
    </form>
  );
};

const QuarterlyUpdate = () => {
  let {
    processLevelItemId,
    processLevelTypeId,
    technicalAssistanceId,
    projectLocationId,
    reportingPeriod,
    year,
  } = useParams();
  return (
    <React.Fragment>
      <Helmet title="Quarterly Update" />
      <Typography variant="h5" gutterBottom display="inline">
        Quarterly Update
      </Typography>
      <Divider my={3} />
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item md={12}>
              <QuarterlyUpdateForm
                processLevelItemId={processLevelItemId}
                processLevelTypeId={processLevelTypeId}
                technicalAssistanceId={technicalAssistanceId}
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

export default QuarterlyUpdate;
