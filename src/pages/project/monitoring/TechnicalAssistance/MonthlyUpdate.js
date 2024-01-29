import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";

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
  getTechnicalAssistanceMonthlyUpdateById,
} from "../../../../api/technical-assistance-monthly-update";
import {
  newTechnicalAssistanceObjectiveLink,
  getTechnicalAssistanceObjectiveLinkByTechnicalAssistanceId,
} from "../../../../api/technical-assistance-objective-link";
import {
  newTechnicalAssistanceAgency,
  getTechnicalAssistanceAgencyByTechnicalAssistanceId,
} from "../../../../api/technical-assistance-agencies";
import {
  newTechnicalAssistanceModality,
  getTechnicalAssistanceModalityByTechnicalAssistanceId,
} from "../../../../api/technical-assistance-modality";
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
  month: "",
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

const MonthlyUpdateForm = ({ id, editId }) => {
  const MAX_COUNT = 5;
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileLimit, setFileLimit] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: MonthlyUpdateData,
    isLoading: isLoadingMonthlyUpdate,
    isError: isErrorMonthlyUpdate,
  } = useQuery(
    ["getTechnicalAssistanceMonthlyUpdateById", editId],
    getTechnicalAssistanceMonthlyUpdateById,
    { enabled: !!editId }
  );

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

  const { isLoading: isLoadingMonths, data: monthsData } = useQuery(
    ["months", "Months"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const { isLoading: isLoadingYears, data: yearsData } = useQuery(
    ["years", "Years"],
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
    data: objectivesMonthlyUpdateData,
    isLoading: isLoadingObjectivesMonthlyUpdate,
  } = useQuery(
    ["getTechnicalAssistanceObjectiveLinkByTechnicalAssistanceId", editId],
    getTechnicalAssistanceObjectiveLinkByTechnicalAssistanceId,
    {
      enabled: !!editId,
    }
  );

  const {
    data: agencyOfChangeActorsMonthlyUpdateData,
    isLoading: isLoadingAgencyOfChangeActorsMonthlyUpdate,
  } = useQuery(
    ["getTechnicalAssistanceAgencyByTechnicalAssistanceId", editId],
    getTechnicalAssistanceAgencyByTechnicalAssistanceId,
    {
      enabled: !!editId,
    }
  );

  const {
    data: modalitiesMonthlyUpdateData,
    isLoading: isLoadingModalitiesMonthlyUpdate,
  } = useQuery(
    ["getTechnicalAssistanceModalityByTechnicalAssistanceId", editId],
    getTechnicalAssistanceModalityByTechnicalAssistanceId,
    {
      enabled: !!editId,
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
      year: Yup.object().required("Required"),
      month: Yup.object().required("Required"),
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
          createDate: new Date(),
          id: editId ? editId : new Guid().toString(),
          technicalAssistanceId: id,
          changeDescription: values.changeDescription,
          yearId: values.year.lookupItemId,
          monthId: values.month.lookupItemId,
          year: values.year.lookupItemName,
          month: values.month.lookupItemName,
          changeRelevance: values.changeRelevance,
          changeLevelOfRelevanceId: values.changeLevelOfRelevance,
          changeLevelOfContributionId: values.changeLevelOfContribution,
          titleOfChangeActors: values.titleOfChangeActors,
          // agencyOfChangeActors: values.agencyOfChangeActors,
          // modalities: values.modalities,
          changeContribution: values.changeContribution,
          changeContributionOther: values.changeContributionOther,
          changeCofollowUpntributionOther:
            values.changeCofollowUpntributionOther,
          followUp: values.followUp,
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

        toast("Successfully Updated Monthly Monitoring", {
          type: "success",
        });
        await queryClient.invalidateQueries([
          "getTechnicalAssistanceMonthlyUpdateByTechnicalAssistanceId",
        ]);
        navigate(
          `/project/monitoring/technical-assistance-monitoring-detail/${id}`
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
        !isLoadingMonthlyUpdate &&
        !isErrorMonthlyUpdate &&
        MonthlyUpdateData &&
        MonthlyUpdateData.data
      ) {
        let objectivesList = [];
        if (!isLoadingObjectives) {
          for (const item of objectivesMonthlyUpdateData.data) {
            const result = objectivesData.data.find(
              (obj) => obj.id === item.objectiveId
            );
            if (result) {
              objectivesList.push(result);
            }
          }
        }

        let departmentsList = [];
        if (
          !isLoadingDepartments &&
          !isLoadingAgencyOfChangeActorsMonthlyUpdate
        ) {
          for (const item of agencyOfChangeActorsMonthlyUpdateData.data) {
            const result = departmentsData.data.find(
              (obj) => obj.id === item.agencyId
            );
            if (result) {
              departmentsList.push(result);
            }
          }
        }

        let modalitiesList = [];
        if (!isLoadingModalities && !isLoadingModalitiesMonthlyUpdate) {
          for (const item of modalitiesMonthlyUpdateData.data) {
            const result = modalitiesData.data.find(
              (obj) => obj.id === item.modalityId
            );
            if (result) {
              modalitiesList.push(result);
            }
          }
        }

        let monitoringYear;
        if (!isLoadingYears) {
          monitoringYear = yearsData.data.find(
            (obj) => obj.lookupItemId === MonthlyUpdateData.data.yearId
          );
        }

        let monitoringMonth;
        if (!isLoadingMonths) {
          monitoringMonth = monthsData.data.find(
            (obj) => obj.lookupItemId === MonthlyUpdateData.data.monthId
          );
        }

        formik.setValues({
          year: monitoringYear ? monitoringYear : "",
          month: monitoringMonth ? monitoringMonth : "",
          changeDescription: MonthlyUpdateData.data.changeDescription,
          objectives: objectivesList,
          changeRelevance: MonthlyUpdateData.data.changeRelevance,
          changeLevelOfRelevance:
            MonthlyUpdateData.data.changeLevelOfRelevanceId,
          changeLevelOfContribution:
            MonthlyUpdateData.data.changeLevelOfContributionId,
          titleOfChangeActors: MonthlyUpdateData.data.titleOfChangeActors,
          agencyOfChangeActors: departmentsList,
          modalities: modalitiesList,
          changeContribution: MonthlyUpdateData.data.changeContribution,
          changeContributionOther:
            MonthlyUpdateData.data.changeContributionOther,
          followUp: MonthlyUpdateData.data.followUp,
        });
      }
    }
    setCurrentFormValues();
  }, [
    MonthlyUpdateData,
    isErrorMonthlyUpdate,
    isLoadingMonthlyUpdate,
    isLoadingYears,
    isLoadingMonths,
    isLoadingObjectives,
    isLoadingDepartments,
    isLoadingAgencyOfChangeActorsMonthlyUpdate,
    isLoadingModalities,
    isLoadingModalitiesMonthlyUpdate,
  ]);

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
              label="Year"
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
              name="month"
              label="Month"
              select
              value={formik.values.month}
              error={Boolean(formik.touched.month && formik.errors.month)}
              fullWidth
              helperText={formik.touched.month && formik.errors.month}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            >
              <MenuItem disabled value="">
                Select Month
              </MenuItem>
              {!isLoadingMonths
                ? monthsData.data.map((option) => (
                    <MenuItem key={option.lookupItemId} value={option}>
                      {option.lookupItemName}
                    </MenuItem>
                  ))
                : []}
            </TextField>
          </Grid>
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
            <Button type="submit" variant="contained" color="primary" mt={3}>
              <Check /> Save changes
            </Button>
          </Grid>
        </Grid>
      )}
    </form>
  );
};

const MonthlyUpdate = () => {
  let { id, editId } = useParams();
  return (
    <React.Fragment>
      <Helmet title="Monthly Update" />
      <Typography variant="h3" gutterBottom display="inline">
        Monthly Update
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link>Technical Assistance Monitoring</Link>
        <Typography>Monthly Update</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <MonthlyUpdateForm id={id} editId={editId} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default MonthlyUpdate;
