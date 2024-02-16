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
  getLearningProgressUpdateByProgressId,
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
  year: "",
  reportingFrequencyId: "",
  researchStageId: "",
  ragStatusId: "",
  progress: "",
  challenges: "",
};

const LearningUpdateForm = (props) => {
  const { id, onLearningActionChange } = props;
  const navigate = useNavigate();

  const {
    data: LearningUpdateData,
    isLoading: isLoadingLearningUpdate,
    isError: isErrorLearningUpdate,
  } = useQuery(
    ["getLearningProgressUpdateByProgressId", id],
    getLearningProgressUpdateByProgressId,
    { enabled: !!id }
  );

  const { isLoading: isLoadingYears, data: yearsData } = useQuery(
    ["years", "Years"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const {
    isLoading: isLoadingQuartersData,
    isError: isErrorQuartersData,
    data: quartersData,
  } = useQuery(["quarters", "Quarters"], getLookupMasterItemsByName, {
    refetchOnWindowFocus: false,
  });

  const {
    isLoading: isLoadingResearchStageData,
    isError: isErrorResearchStageData,
    data: researchStageData,
  } = useQuery(["researchStage", "ResearchStage"], getLookupMasterItemsByName, {
    refetchOnWindowFocus: false,
  });

  const { isLoading: isLoadingStatuses, data: statusesData } = useQuery(
    ["ragStatus", "RAGStatus"],
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
      year: Yup.object().required("Required"),
      reportingFrequencyId: Yup.object().required("Required"),
      researchStageId: Yup.object().required("Required"),
      ragStatusId: Yup.object().required("Required"),
      progress: Yup.string().required("Required"),
      challenges: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const saveLearningUpdate = {
          createDate: new Date(),
          id: id,
          researchId: id,
          implementationYearId: values.year.lookupItemId,
          implementationYear: values.year.lookupItemName,
          quarterId: values.reportingFrequencyId.lookupItemId,
          quarter: values.reportingFrequencyId.lookupItemName,
          researchStageId: values.researchStageId.lookupItemId,
          researchStage: values.researchStageId.lookupItemName,
          ragStatusId: values.ragStatusId.lookupItemId,
          ragStatus: values.ragStatusId.lookupItemName,
          progress: values.progress,
          challenges: values.challenges,
        };

        await mutation.mutateAsync(saveLearningUpdate);

        toast("Successfully Updated Learning/Research", {
          type: "success",
        });

        handleLearningActionChange(0, true);
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
        LearningUpdateData &&
        LearningUpdateData.data
      ) {
        let monitoringYear;
        if (!isLoadingYears) {
          monitoringYear = yearsData.data.find(
            (obj) =>
              obj.lookupItemId === LearningUpdateData.data.implementationYearId
          );
        }

        let monitoringQuarter;
        if (!isLoadingQuartersData) {
          monitoringQuarter = quartersData.data.find(
            (obj) => obj.lookupItemId === LearningUpdateData.data.quarterId
          );
        }

        let monitoringResearchStage;
        if (!isLoadingResearchStageData) {
          monitoringResearchStage = researchStageData.data.find(
            (obj) =>
              obj.lookupItemId === LearningUpdateData.data.researchStageId
          );
        }

        let monitoringRAGStatusId;
        if (!isLoadingStatuses) {
          monitoringRAGStatusId = statusesData.data.find(
            (obj) => obj.lookupItemId === LearningUpdateData.data.ragStatusId
          );
        }

        formik.setValues({
          year: monitoringYear ? monitoringYear : "",
          reportingFrequencyId: monitoringQuarter ? monitoringQuarter : "",
          researchStageId: monitoringResearchStage
            ? monitoringResearchStage
            : "",
          ragStatusId: monitoringRAGStatusId ? monitoringRAGStatusId : "",
          progress: LearningUpdateData.data.progress,
          challenges: LearningUpdateData.data.challenges,
        });
      }
    }
    setCurrentFormValues();
  }, [
    LearningUpdateData,
    isErrorLearningUpdate,
    isLoadingLearningUpdate,
    isLoadingQuartersData,
    isLoadingYears,
  ]);

  const handleLearningActionChange = useCallback(
    (id, status) => {
      onLearningActionChange({ id: id, status: status });
    },
    [onLearningActionChange]
  );

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
              name="year"
              label="Implementing Year"
              select
              value={formik.values.year}
              error={Boolean(formik.touched.year && formik.errors.year)}
              fullWidth
              helperText={formik.touched.year && formik.errors.year}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            >
              <MenuItem disabled value="">
                Select Year
              </MenuItem>
              {!isLoadingYears
                ? yearsData.data.map((option) => (
                    <MenuItem key={option.lookupItemId} value={option}>
                      {option.lookupItemName}
                    </MenuItem>
                  ))
                : []}
            </TextField>
          </Grid>
          <Grid item md={6}>
            <TextField
              name="reportingFrequencyId"
              label="Quarter"
              select
              value={formik.values.reportingFrequencyId}
              error={Boolean(
                formik.touched.reportingFrequencyId &&
                  formik.errors.reportingFrequencyId
              )}
              fullWidth
              helperText={
                formik.touched.reportingFrequencyId &&
                formik.errors.reportingFrequencyId
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            >
              <MenuItem disabled value="">
                Select Quarter
              </MenuItem>
              {!isLoadingQuartersData
                ? quartersData.data.map((option) => (
                    <MenuItem key={option.lookupItemId} value={option}>
                      {option.lookupItemName}
                    </MenuItem>
                  ))
                : []}
            </TextField>
          </Grid>
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
              onClick={() => handleLearningActionChange(0, true)}
            >
              <ChevronLeft /> Back
            </Button>
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

const EditLearningUpdate = (props) => {
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
                id={props.id}
                onActionChange={props.onActionChange}
                onLearningActionChange={props.onLearningActionChange}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default EditLearningUpdate;
