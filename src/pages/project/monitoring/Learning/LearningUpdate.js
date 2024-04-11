import styled from "@emotion/styled";
import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  CircularProgress,
  Grid,
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
import { spacing } from "@mui/system";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { Check, ChevronLeft } from "react-feather";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import {
  getLearningProgressUpdateByMonitoringPeriod,
  newLearningProgressUpdate,
} from "../../../../api/learning-progress-update";
import { getLookupMasterItemsByName } from "../../../../api/lookup";
import { Guid } from "../../../../utils/guid";

const Paper = styled(MuiPaper)(spacing);
const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);
const Divider = styled(MuiDivider)(spacing);

const initialValues = {
  researchStageId: "",
  ragStatusId: "",
  progress: "",
  challenges: "",
};

const LearningUpdateForm = (props) => {
  const [editId, setEditId] = useState();
  const id = props.learningId;
  const geoFocusId = props.projectLocationId;
  const reportingFrequencyId = props.reportingPeriod;
  const reportingYearId = props.year;

  const {
    data: learningUpdateData,
    isLoading: isLoadingLearningUpdate,
    isError: isErrorLearningUpdate,
  } = useQuery(
    [
      "getLearningProgressUpdateByMonitoringPeriod",
      id,
      geoFocusId,
      reportingFrequencyId,
      reportingYearId,
    ],
    getLearningProgressUpdateByMonitoringPeriod,
    { enabled: !!id }
  );

  const { isLoading: isLoadingResearchStageData, data: researchStageData } =
    useQuery(["researchStage", "ResearchStage"], getLookupMasterItemsByName, {
      refetchOnWindowFocus: false,
    });

  const { isLoading: isLoadingStatuses, data: statusesData } = useQuery(
    ["bragStatus", "BRAGStatus"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const mutation = useMutation({
    mutationFn: newLearningProgressUpdate,
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      researchStageId: Yup.object().required("Required"),
      ragStatusId: Yup.object().required("Required"),
      progress: Yup.string().required("Required"),
      challenges: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const saveLearningUpdate = {
          id: editId ?? new Guid().toString(),
          researchId: id,
          researchStageId: values.researchStageId.lookupItemId,
          researchStage: values.researchStageId.lookupItemName,
          ragStatusId: values.ragStatusId.lookupItemId,
          ragStatus: values.ragStatusId.lookupItemName,
          progress: values.progress,
          challenges: values.challenges,
          reportingFrequencyId: reportingFrequencyId,
          reportingFrequency: "",
          implementationYearId: reportingYearId,
          implementationYear: "",
          administrativeUnitId: geoFocusId,
          createDate: new Date(),
        };

        await mutation.mutateAsync(saveLearningUpdate);

        toast("Successfully Updated Learning Monitoring", {
          type: "success",
        });
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
        !isLoadingLearningUpdate &&
        !isErrorLearningUpdate &&
        learningUpdateData &&
        learningUpdateData.data
      ) {
        let monitoringResearchStage;
        if (!isLoadingResearchStageData) {
          monitoringResearchStage = researchStageData.data.find(
            (obj) =>
              obj.lookupItemId === learningUpdateData.data.researchStageId
          );
        }

        let monitoringRAGStatusId;
        if (!isLoadingStatuses) {
          monitoringRAGStatusId = statusesData.data.find(
            (obj) => obj.lookupItemId === learningUpdateData.data.ragStatusId
          );
        }

        formik.setValues({
          researchStageId: learningUpdateData.data.researchStageId,
          researchStageId: monitoringResearchStage
            ? monitoringResearchStage
            : "",
          ragStatusId: monitoringRAGStatusId ? monitoringRAGStatusId : "",
          progress: learningUpdateData.data.progress,
          challenges: learningUpdateData.data.challenges,
        });

        setEditId(learningUpdateData.data.id);
      }
    }
    setCurrentFormValues();
  }, [isLoadingLearningUpdate, learningUpdateData]);

  return (
    <form onSubmit={formik.handleSubmit}>
      {formik.isSubmitting ? (
        <Box display="flex" justifyContent="center" my={6}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container item spacing={2}>
          <Grid item md={6}>
            <TextField
              name="researchStageId"
              label="Research Stage"
              select
              value={formik.values.researchStageId}
              error={Boolean(
                formik.touched.researchStageId && formik.errors.researchStageId
              )}
              fullWidth
              helperText={
                formik.touched.researchStageId && formik.errors.researchStageId
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            >
              <MenuItem disabled value="">
                Select Stage
              </MenuItem>
              {!isLoadingResearchStageData
                ? researchStageData.data.map((option) => (
                    <MenuItem key={option.lookupItemId} value={option}>
                      {option.lookupItemName}
                    </MenuItem>
                  ))
                : []}
            </TextField>
          </Grid>
          <Grid item md={6}>
            <TextField
              name="ragStatusId"
              label="RAG Status"
              select
              value={formik.values.ragStatusId}
              error={Boolean(
                formik.touched.ragStatusId && formik.errors.ragStatusId
              )}
              fullWidth
              helperText={
                formik.touched.ragStatusId && formik.errors.ragStatusId
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            >
              <MenuItem disabled value="">
                Select Status
              </MenuItem>
              {!isLoadingStatuses
                ? statusesData.data.map((option) => (
                    <MenuItem key={option.lookupItemId} value={option}>
                      {option.lookupItemName}
                    </MenuItem>
                  ))
                : []}
            </TextField>
          </Grid>

          <Grid item md={12} mb={2}>
            <TextField
              name="progress"
              label="Progress"
              value={formik.values.progress}
              error={Boolean(
                formik.touched.progress && formik.errors.bestModelsApproaches
              )}
              fullWidth
              helperText={formik.touched.progress && formik.errors.progress}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              multiline
              variant="outlined"
              rows={3}
            />
          </Grid>

          <Grid item md={12} mb={2}>
            <TextField
              name="challenges"
              label="Challenges"
              value={formik.values.challenges}
              error={Boolean(
                formik.touched.challenges && formik.errors.challenges
              )}
              fullWidth
              helperText={formik.touched.challenges && formik.errors.challenges}
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

const LearningUpdate = (props) => {
  let {
    processLevelItemId,
    processLevelTypeId,
    learningId,
    projectLocationId,
    reportingPeriod,
    year,
  } = useParams();

  return (
    <React.Fragment>
      <Helmet title="Monthly Update" />
      <Typography variant="h5" gutterBottom display="inline">
        Learning Update
      </Typography>

      <Divider my={3} />
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <LearningUpdateForm
                processLevelItemId={processLevelItemId}
                processLevelTypeId={processLevelTypeId}
                learningId={learningId}
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

export default LearningUpdate;
