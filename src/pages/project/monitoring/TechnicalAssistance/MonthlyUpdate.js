import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";

import {
  Box,
  CircularProgress,
  Grid,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider as MuiDivider,
  MenuItem,
  TextField as MuiTextField,
  Typography,
  InputLabel,
  FormControl,
  Select,
  OutlinedInput,
  Stack,
  Chip,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { spacing } from "@mui/system";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { Check } from "react-feather";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { getTechnicalAssistanceObjectiveByTechnicalAssistanceId } from "../../../../api/technical-assistance-objective";
import {
  newTechnicalAssistanceMonthlyUpdate,
  getTechnicalAssistanceMonthlyUpdateByMonitoringPeriod,
} from "../../../../api/technical-assistance-monthly-update";
import { newTechnicalAssistanceObjectiveLink } from "../../../../api/technical-assistance-objective-link";
import { newTechnicalAssistanceAgency } from "../../../../api/technical-assistance-agencies";
import { newTechnicalAssistanceModality } from "../../../../api/technical-assistance-modality";
import { getLookupMasterItemsByName } from "../../../../api/lookup";
import { Guid } from "../../../../utils/guid";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);
const Divider = styled(MuiDivider)(spacing);

const MonthlyUpdateForm = (props) => {
  const [editId, setEditId] = useState();
  const id = props.technicalAssistanceId;
  const geoFocusId = props.projectLocationId;
  const reportingFrequencyId = props.reportingPeriod;
  const reportingYearId = props.year;
  const initialValues = {
    changeDescription: "",
    objectives: [],
    changeRelevance: "",
    changeLevelOfRelevance: "",
    changeLevelOfContribution: "",
    titleOfChangeActors: "",
    agencyOfChangeActors: [],
    modalities: [],
    changeContribution: "",
    changeContributionOther: "",
    followUp: "",
  };

  const MAX_COUNT = 5;
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileLimit, setFileLimit] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { isLoading: isLoadingLevelOfRelevance, data: levelOfRelevanceData } =
    useQuery(
      ["levelOfRelevance", "LevelOfRelevance"],
      getLookupMasterItemsByName,
      {
        refetchOnWindowFocus: false,
      }
    );

  const {
    isLoading: isLoadingLevelOfContribution,
    data: levelOfContributionData,
  } = useQuery(
    ["levelOfContribution", "LevelOfContribution"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const { isLoading: isLoadingDepartments, data: departmentsData } = useQuery(
    ["departments", "Departments"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const { isLoading: isLoadingModalities, data: modalitiesData } = useQuery(
    ["modalities", "Modalities"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const { data: objectivesData, isLoading: isLoadingObjectives } = useQuery(
    ["getTechnicalAssistanceObjectiveByTechnicalAssistanceId", id],
    getTechnicalAssistanceObjectiveByTechnicalAssistanceId,
    {
      enabled: !!id,
    }
  );

  const {
    data: technicalAssistanceMonthlyUpdate,
    isLoading: isLoadingTechnicalAssistanceMonthlyUpdate,
  } = useQuery(
    [
      "getTechnicalAssistanceMonthlyUpdateByMonitoringPeriod",
      id,
      geoFocusId,
      reportingFrequencyId,
      reportingYearId,
    ],
    getTechnicalAssistanceMonthlyUpdateByMonitoringPeriod,
    {
      enabled: !!id,
    }
  );

  const handleUploadFiles = (files) => {
    const uploaded = [...uploadedFiles];
    let limitExceeded = false;
    files.some((file) => {
      if (uploaded.findIndex((f) => f.name === file.name) === -1) {
        uploaded.push(file);
        if (uploaded.length === MAX_COUNT) setFileLimit(true);
        if (uploaded.length > MAX_COUNT) {
          alert(`You can only add a maximum of ${MAX_COUNT} files`);
          setFileLimit(false);
          limitExceeded = true;
          return true;
        }
      }
    });
    if (!limitExceeded) setUploadedFiles(uploaded);
  };

  const handleFileEvent = (e) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    handleUploadFiles(chosenFiles);
  };

  const mutationMonthlyUpdate = useMutation({
    mutationFn: newTechnicalAssistanceMonthlyUpdate,
  });

  const mutationObjectiveLink = useMutation({
    mutationFn: newTechnicalAssistanceObjectiveLink,
  });

  const mutationDepartment = useMutation({
    mutationFn: newTechnicalAssistanceAgency,
  });

  const mutationModality = useMutation({
    mutationFn: newTechnicalAssistanceModality,
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      changeDescription: Yup.string().required("Required"),
      objectives: Yup.array().required("Required"),
      changeRelevance: Yup.string().required("Required"),
      changeLevelOfRelevance: Yup.string().required("Required"),
      changeLevelOfContribution: Yup.string().required("Required"),
      titleOfChangeActors: Yup.string().required("Required"),
      agencyOfChangeActors: Yup.array().required("Required"),
      modalities: Yup.array().required("Required"),
      changeContribution: Yup.string().required("Required"),
      changeContributionOther: Yup.string().required("Required"),
      followUp: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const saveMonthlyUpdate = {
          id: editId ?? new Guid().toString(),
          technicalAssistanceId: id,
          changeDescription: values.changeDescription,
          changeRelevance: values.changeRelevance,
          changeLevelOfRelevanceId: values.changeLevelOfRelevance,
          changeLevelOfContributionId: values.changeLevelOfContribution,
          titleOfChangeActors: values.titleOfChangeActors,
          changeContribution: values.changeContribution,
          changeContributionOther: values.changeContributionOther,
          changeCofollowUpntributionOther:
            values.changeCofollowUpntributionOther,
          followUp: values.followUp,
          reportingFrequencyId: reportingFrequencyId,
          reportingFrequency: "",
          implementationYearId: reportingYearId,
          implementationYear: "",
          administrativeUnitId: geoFocusId,
          createDate: new Date(),
        };
        const monthlyUpdate = await mutationMonthlyUpdate.mutateAsync(
          saveMonthlyUpdate
        );

        let objectivesList = [];
        for (const item of values.objectives) {
          const objective = {
            objectiveId: item.id,
            technicalAssistanceId: id,
            technicalAssistanceMonthlyUpdateId: monthlyUpdate.data.id,
            createDate: new Date(),
          };
          objectivesList.push(objective);
        }
        await mutationObjectiveLink.mutateAsync(objectivesList);

        let departmentsList = [];
        for (const item of values.agencyOfChangeActors) {
          const department = {
            agencyId: item.id,
            technicalAssistanceId: id,
            technicalAssistanceMonthlyUpdateId: monthlyUpdate.data.id,
            createDate: new Date(),
          };
          departmentsList.push(department);
        }
        await mutationDepartment.mutateAsync(departmentsList);

        let modalitiesList = [];
        for (const item of values.modalities) {
          const modality = {
            modalityId: item.id,
            technicalAssistanceId: id,
            technicalAssistanceMonthlyUpdateId: monthlyUpdate.data.id,
            createDate: new Date(),
          };
          modalitiesList.push(modality);
        }
        await mutationModality.mutateAsync(modalitiesList);

        toast("Successfully Created TA Monthly Monitoring", {
          type: "success",
        });

        await queryClient.invalidateQueries([
          "getTechnicalAssistanceMonthlyUpdateByTechnicalAssistanceId",
        ]);
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
        !isLoadingTechnicalAssistanceMonthlyUpdate &&
        technicalAssistanceMonthlyUpdate &&
        technicalAssistanceMonthlyUpdate.data
      ) {
        let objectivesList = [];
        let objectivesMonthlyUpdateData =
          technicalAssistanceMonthlyUpdate.data
            .technicalAssistanceMonthlyUpdateObjectives;
        if (objectivesMonthlyUpdateData && objectivesData) {
          for (const item of objectivesMonthlyUpdateData) {
            const result = objectivesData.data.find(
              (obj) => obj.id === item.objectiveId
            );
            if (result) {
              objectivesList.push(result);
            }
          }
        }

        let agencyOfChangeActorsList = [];
        let agencyOfChangeActorsMonthlyUpdateData =
          technicalAssistanceMonthlyUpdate.data
            .technicalAssistanceMonthlyUpdateAgencies;
        if (agencyOfChangeActorsMonthlyUpdateData && departmentsData) {
          for (const item of agencyOfChangeActorsMonthlyUpdateData) {
            const result = departmentsData.data.find(
              (obj) => obj.id === item.agencyId
            );
            if (result) {
              agencyOfChangeActorsList.push(result);
            }
          }
        }

        let modalitiesList = [];
        let modalitiesMonthlyUpdateData =
          technicalAssistanceMonthlyUpdate.data
            .technicalAssistanceMonthlyUpdateModalities;
        if (modalitiesMonthlyUpdateData && modalitiesData) {
          for (const item of modalitiesMonthlyUpdateData) {
            const result = modalitiesData.data.find(
              (obj) => obj.id === item.modalityId
            );
            if (result) {
              modalitiesList.push(result);
            }
          }
        }

        formik.setValues({
          changeDescription:
            technicalAssistanceMonthlyUpdate.data.changeDescription,
          objectives: objectivesList,
          changeRelevance:
            technicalAssistanceMonthlyUpdate.data.changeRelevance,
          changeLevelOfRelevance:
            technicalAssistanceMonthlyUpdate.data.changeLevelOfRelevanceId,
          changeLevelOfContribution:
            technicalAssistanceMonthlyUpdate.data.changeLevelOfContributionId,
          titleOfChangeActors:
            technicalAssistanceMonthlyUpdate.data.titleOfChangeActors,
          agencyOfChangeActors: agencyOfChangeActorsList,
          modalities: modalitiesList,
          changeContribution:
            technicalAssistanceMonthlyUpdate.data.changeContribution,
          changeContributionOther:
            technicalAssistanceMonthlyUpdate.data.changeContributionOther,
          followUp: technicalAssistanceMonthlyUpdate.data.followUp,
        });

        setEditId(technicalAssistanceMonthlyUpdate.data.id);
      }
    }

    setCurrentFormValues();
  }, [
    isLoadingTechnicalAssistanceMonthlyUpdate,
    isLoadingDepartments,
    isLoadingModalities,
    isLoadingObjectives,
    technicalAssistanceMonthlyUpdate,
  ]);

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
              name="changeDescription"
              label="Describe the change for the period "
              value={formik.values.changeDescription}
              error={Boolean(
                formik.touched.changeDescription &&
                  formik.errors.changeDescription
              )}
              fullWidth
              helperText={
                formik.touched.changeDescription &&
                formik.errors.changeDescription
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              multiline
              variant="outlined"
              rows={3}
            />
          </Grid>

          <Grid item md={12} mt={2}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel>Link to TA Objectives</InputLabel>
              <Select
                fullWidth
                multiple
                value={formik.values.objectives}
                onChange={(e) => {
                  const selectedObjectives = Array.isArray(e.target.value)
                    ? e.target.value
                    : [e.target.value]; // Ensure it's always an array
                  formik.setFieldValue("objectives", selectedObjectives);
                }}
                input={<OutlinedInput label="Multiple Select" />}
                renderValue={(selected) => (
                  <Stack gap={1} direction="row" flexWrap="wrap">
                    {selected.map((value) => (
                      <Chip
                        key={value.id}
                        label={value.objective}
                        onDelete={() =>
                          formik.setFieldValue(
                            "objectives",
                            formik.values.objectives.filter(
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
                {!isLoadingObjectives
                  ? objectivesData.data.map((option) => (
                      <MenuItem key={option.id} value={option}>
                        {option.objective}
                      </MenuItem>
                    ))
                  : []}
              </Select>
            </FormControl>
          </Grid>

          <Grid item md={12} mt={2}>
            <TextField
              name="changeRelevance"
              label="Why do you think the change is relevant?"
              value={formik.values.changeRelevance}
              error={Boolean(
                formik.touched.changeRelevance && formik.errors.changeRelevance
              )}
              fullWidth
              helperText={
                formik.touched.changeRelevance && formik.errors.changeRelevance
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              multiline
              variant="outlined"
              rows={3}
            />
          </Grid>

          <Grid item md={6} mt={2}>
            <TextField
              name="changeLevelOfRelevance"
              label="Level of relevance"
              select
              value={formik.values.changeLevelOfRelevance}
              error={Boolean(
                formik.touched.changeLevelOfRelevance &&
                  formik.errors.changeLevelOfRelevance
              )}
              fullWidth
              helperText={
                formik.touched.changeLevelOfRelevance &&
                formik.errors.changeLevelOfRelevance
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            >
              <MenuItem disabled value="">
                Select Level of Relevance
              </MenuItem>
              {!isLoadingLevelOfRelevance
                ? levelOfRelevanceData.data.map((option) => (
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

          <Grid item md={6} mt={2}>
            <TextField
              name="changeLevelOfContribution"
              label="Level of contribution to the change/result "
              select
              value={formik.values.changeLevelOfContribution}
              error={Boolean(
                formik.touched.changeLevelOfContribution &&
                  formik.errors.changeLevelOfContribution
              )}
              fullWidth
              helperText={
                formik.touched.changeLevelOfContribution &&
                formik.errors.changeLevelOfContribution
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            >
              <MenuItem disabled value="">
                Select Level of Contribution
              </MenuItem>
              {!isLoadingLevelOfContribution
                ? levelOfContributionData.data.map((option) => (
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
              name="titleOfChangeActors"
              label="Title/function of actors who contributed to change "
              value={formik.values.titleOfChangeActors}
              error={Boolean(
                formik.touched.titleOfChangeActors &&
                  formik.errors.titleOfChangeActors
              )}
              fullWidth
              helperText={
                formik.touched.titleOfChangeActors &&
                formik.errors.titleOfChangeActors
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              multiline
              variant="outlined"
              rows={3}
            />
          </Grid>

          <Grid item md={12} mt={2}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel>
                Agency/department of the actors mentioned{" "}
              </InputLabel>
              <Select
                fullWidth
                multiple
                value={formik.values.agencyOfChangeActors}
                onChange={(e) => {
                  const selectedAgencies = Array.isArray(e.target.value)
                    ? e.target.value
                    : [e.target.value]; // Ensure it's always an array
                  formik.setFieldValue(
                    "agencyOfChangeActors",
                    selectedAgencies
                  );
                }}
                input={<OutlinedInput label="Multiple Select" />}
                renderValue={(selected) => (
                  <Stack gap={1} direction="row" flexWrap="wrap">
                    {selected.map((value) => (
                      <Chip
                        key={value.lookupItemId}
                        label={value.lookupItemName}
                        onDelete={() =>
                          formik.setFieldValue(
                            "agencyOfChangeActors",
                            formik.values.objectives.filter(
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
                {departmentsData
                  ? departmentsData.data.map((option) => (
                      <MenuItem key={option.lookupItemId} value={option}>
                        {option.lookupItemName}
                      </MenuItem>
                    ))
                  : []}
              </Select>
            </FormControl>
          </Grid>

          <Grid item md={12} mt={2}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel>Technical Assistance Modalities </InputLabel>
              <Select
                fullWidth
                multiple
                value={formik.values.modalities}
                onChange={(e) => {
                  const selectedModalities = Array.isArray(e.target.value)
                    ? e.target.value
                    : [e.target.value]; // Ensure it's always an array
                  formik.setFieldValue("modalities", selectedModalities);
                }}
                input={<OutlinedInput label="Multiple Select" />}
                renderValue={(selected) => (
                  <Stack gap={1} direction="row" flexWrap="wrap">
                    {selected.map((value) => (
                      <Chip
                        key={value.lookupItemId}
                        label={value.lookupItemName}
                        onDelete={() =>
                          formik.setFieldValue(
                            "modalities",
                            formik.values.modalities.filter(
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
                {modalitiesData
                  ? modalitiesData.data.map((option) => (
                      <MenuItem key={option.lookupItemId} value={option}>
                        {option.lookupItemName}
                      </MenuItem>
                    ))
                  : []}
              </Select>
            </FormControl>
          </Grid>

          <Grid item md={12} mt={2}>
            <TextField
              name="changeContribution"
              label="Contribution to the change "
              value={formik.values.changeContribution}
              error={Boolean(
                formik.touched.changeContribution &&
                  formik.errors.changeContribution
              )}
              fullWidth
              helperText={
                formik.touched.changeContribution &&
                formik.errors.changeContribution
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              multiline
              variant="outlined"
              rows={3}
            />
          </Grid>

          <Grid item md={12} mt={2}>
            <TextField
              name="changeContributionOther"
              label="Other factor that contributed to the change"
              value={formik.values.changeContributionOther}
              error={Boolean(
                formik.touched.changeContributionOther &&
                  formik.errors.changeContributionOther
              )}
              fullWidth
              helperText={
                formik.touched.changeContributionOther &&
                formik.errors.changeContributionOther
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              multiline
              variant="outlined"
              rows={3}
            />
          </Grid>

          <Grid item md={12} mt={2}>
            <TextField
              name="followUp"
              label="Follow up and sustainability"
              value={formik.values.followUp}
              error={Boolean(formik.touched.followUp && formik.errors.followUp)}
              fullWidth
              helperText={formik.touched.followUp && formik.errors.followUp}
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

const MonthlyUpdate = () => {
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
      <Helmet title="Monthly Update" />
      <Typography variant="h5" gutterBottom display="inline">
        Monthly Update
      </Typography>

      <Divider my={3} />
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <MonthlyUpdateForm
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

export default MonthlyUpdate;
