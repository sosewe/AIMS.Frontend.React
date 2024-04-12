import React, { useEffect, useState, useCallback } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { MenuItem } from "@mui/material";
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Dialog,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper as MuiPaper,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { Check, Trash as TrashIcon, ChevronLeft } from "react-feather";
import styled from "@emotion/styled";
import { getLookupMasterItemsByName } from "../../../../api/lookup";
import {
  newInnovationObjectiveClassification,
  getInnovationObjectiveClassificationByInnovationId,
} from "../../../../api/innovation-objectivesclassification";
import {
  newInnovationObjective,
  getInnovationObjectiveByInnovationId,
} from "../../../../api/innovation-objective";
import {
  newInnovationMetric,
  getInnovationMetricByInnovationId,
} from "../../../../api/innovation-metric";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Guid } from "../../../../utils/guid";
import { Add as AddIcon } from "@mui/icons-material";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);
const Paper = styled(MuiPaper)(spacing);

const initialValues = {
  innovationType: "",
  innovationClass: "",
  innovationTechnology: "",
  whatMakesInnovation: "",
  phcProblemSolved: "",
  estimatedImpact: "",
  reportingFrequency: "",
};

const objectiveDetailsInitialValues = {
  innovationObjectiveDescription: "",
};

const metricDetailsInitialValues = {
  innovationMetricId: "",
  innovationMetricName: "",
  innovationTargetGroupId: "",
  innovationTargetGroupName: "",
  innovationTarget: "",
};

const MetricDetailsForm = ({ handleClick }) => {
  const { isLoading: isLoadingInnovationMetric, data: innovationMetricData } =
    useQuery(
      ["innovationMetric", "InnovationMetric"],
      getLookupMasterItemsByName,
      {
        refetchOnWindowFocus: false,
      }
    );

  const {
    isLoading: isLoadinginnovationTargetGroup,
    data: innovationTargetGroupData,
  } = useQuery(
    ["innovationTargetGroup", "InnovationTargetGroup"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const formik = useFormik({
    initialValues: metricDetailsInitialValues,
    validationSchema: Yup.object().shape({
      innovationMetricId: Yup.object().required("Required"),
      innovationTargetGroupId: Yup.object().required("Required"),
      innovationTarget: Yup.number().required("Required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        handleClick(values);
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

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={3}>
              <TextField
                name="innovationMetricId"
                label="Innovation Metric"
                select
                value={formik.values.innovationMetricId}
                error={Boolean(
                  formik.touched.innovationMetricId &&
                    formik.errors.innovationMetricId
                )}
                fullWidth
                helperText={
                  formik.touched.innovationMetricId &&
                  formik.errors.innovationMetricId
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
              >
                <MenuItem disabled value="">
                  Innovation Metric
                </MenuItem>
                {!isLoadingInnovationMetric
                  ? innovationMetricData.data.map((option) => (
                      <MenuItem key={option.lookupItemId} value={option}>
                        {option.lookupItemName}
                      </MenuItem>
                    ))
                  : []}
              </TextField>
            </Grid>
            <Grid item md={3}>
              <TextField
                name="innovationTargetGroupId"
                label="Target Group"
                select
                multiple
                value={formik.values.innovationTargetGroupId}
                error={Boolean(
                  formik.touched.innovationTargetGroupId &&
                    formik.errors.innovationTargetGroupId
                )}
                fullWidth
                helperText={
                  formik.touched.innovationTargetGroupId &&
                  formik.errors.innovationTargetGroupId
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
              >
                <MenuItem disabled value="">
                  Target Group
                </MenuItem>
                {!isLoadinginnovationTargetGroup
                  ? innovationTargetGroupData.data.map((option) => (
                      <MenuItem key={option.lookupItemId} value={option}>
                        {option.lookupItemName}
                      </MenuItem>
                    ))
                  : []}
              </TextField>
            </Grid>

            <Grid item md={3}>
              <TextField
                name="innovationTarget"
                label="Target Number"
                value={formik.values.innovationTarget}
                error={Boolean(
                  formik.touched.innovationTarget &&
                    formik.errors.innovationTarget
                )}
                fullWidth
                helperText={
                  formik.touched.innovationTarget &&
                  formik.errors.innovationTarget
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
              />
            </Grid>

            <Grid item md={1}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                mt={3}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};

const ObjectiveDetailsForm = ({ handleClick }) => {
  const formik = useFormik({
    initialValues: objectiveDetailsInitialValues,
    validationSchema: Yup.object().shape({
      innovationObjectiveDescription: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        handleClick(values);
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

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={12}>
              <TextField
                name="innovationObjectiveDescription"
                label="Objective Description"
                value={formik.values.innovationObjectiveDescription}
                error={Boolean(
                  formik.touched.innovationObjectiveDescription &&
                    formik.errors.innovationObjectiveDescription
                )}
                fullWidth
                helperText={
                  formik.touched.innovationObjectiveDescription &&
                  formik.errors.innovationObjectiveDescription
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                rows={4}
                multiline
                my={2}
              />
            </Grid>
            <Grid item md={1}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                mt={3}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};

const InnvationObjectives = (props) => {
  const id = props.id;
  const onActionChange = props.onActionChange;
  const [openAddObjectives, setOpenAddObjectives] = useState(false);
  const [openAddMetrics, setOpenAddMetrics] = useState(false);
  const [objectivesList, setObjectivesList] = useState([]);
  const [metricsList, setMetricsList] = useState([]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    data: innovationObjectivesClassificationData,
    isLoading: isLoadinginnovationObjectivesClassificationData,
  } = useQuery(
    ["getInnovationObjectiveClassificationByInnovationId", id],
    getInnovationObjectiveClassificationByInnovationId,
    { enabled: !!id }
  );

  const {
    data: innovationObjectivesData,
    isLoading: isLoadingInnovationObjectivesData,
  } = useQuery(
    ["getInnovationObjectiveByInnovationId", id],
    getInnovationObjectiveByInnovationId,
    { enabled: !!id }
  );

  const { data: innovationMetricsData, isLoading: isLoadingMetricsData } =
    useQuery(
      ["getInnovationMetricByInnovationId", id],
      getInnovationMetricByInnovationId,
      { enabled: !!id }
    );

  const { isLoading: isLoadingInovationType, data: innovationTypeData } =
    useQuery(["innovationType", "InnovationType"], getLookupMasterItemsByName, {
      refetchOnWindowFocus: false,
    });

  const { isLoading: isLoadingInnovationClass, data: innovationClassData } =
    useQuery(
      ["innovationClass", "InnovationClass"],
      getLookupMasterItemsByName,
      {
        refetchOnWindowFocus: false,
      }
    );

  const {
    isLoading: isLoadingInnovationTechnology,
    data: innovationTechnologyData,
  } = useQuery(
    ["innovationTechnology", "InnovationTechnology"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const {
    isLoading: isLoadingReportingFrequency,
    data: reportingFrequencyData,
  } = useQuery(
    ["reportingFrequency", "ReportingFrequency"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const mutation = useMutation({
    mutationFn: newInnovationObjectiveClassification,
  });

  const innovationObjectivesMutation = useMutation({
    mutationFn: newInnovationObjective,
  });

  const innovationMetricsMutation = useMutation({
    mutationFn: newInnovationMetric,
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      innovationType: Yup.string().required("Required"),
      innovationClass: Yup.string().required("Required"),
      innovationTechnology: Yup.string().required("Required"),
      whatMakesThisInnovative: Yup.string().required("Required"),
      phcProblemBeingSolved: Yup.string().required("Required"),
      estimatedImpact: Yup.string().required("Required"),
      reportingFrequency: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      if (innovationObjectivesClassificationData) {
        values.id = innovationObjectivesClassificationData.data.id;
      } else {
        values.id = new Guid().toString();
      }

      try {
        const innovationObjective = {
          id: values.id,
          createDate: new Date(),
          innovationId: id,
          innovationTypeId: values.innovationType,
          innovationClassId: values.innovationClass,
          innovationTechnologyId: values.innovationTechnology,
          whatMakesThisInnovative: values.whatMakesThisInnovative,
          phcProblemBeingSolved: values.phcProblemBeingSolved,
          estimatedImpact: values.estimatedImpact,
          reportingFrequencyId: values.reportingFrequency,
        };
        const innovation = await mutation.mutateAsync(innovationObjective);

        let innovationObjectives = [];
        for (const objective of objectivesList) {
          const innovationObjective = {
            id: new Guid().toString(),
            innovationObjectiveDescription:
              objective.innovationObjectiveDescription,
            innovationId: innovation.data.innovationId,
            createDate: new Date(),
          };
          innovationObjectives.push(innovationObjective);
        }
        await innovationObjectivesMutation.mutateAsync(innovationObjectives);

        let innovationMetrics = [];
        for (const metric of metricsList) {
          const innovationMetric = {
            id: new Guid().toString(),
            innovationMetricId: metric.innovationMetricId.lookupItemId,
            innovationMetricName: metric.innovationMetricId.lookupItemName,
            innovationTargetGroupId:
              metric.innovationTargetGroupId.lookupItemId,
            innovationTargetGroupName:
              metric.innovationTargetGroupId.lookupItemName,
            innovationTarget: metric.innovationTarget,
            innovationId: innovation.data.innovationId,
            createDate: new Date(),
          };
          innovationMetrics.push(innovationMetric);
        }
        await innovationMetricsMutation.mutateAsync(innovationMetrics);

        toast("Successfully Created an Innovation Objective", {
          type: "success",
        });

        await queryClient.invalidateQueries([
          "getInnovationObjectiveClassificationByInnovationId",
        ]);
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  function removeObjective(row) {
    setObjectivesList((current) =>
      current.filter(
        (objective) =>
          objective.innovationObjectiveDescription !==
          row.innovationObjectiveDescription
      )
    );
  }

  const handleObjectiveAdd = (values) => {
    setObjectivesList((current) => [...current, values]);
  };

  function removeMetrics(row) {
    setMetricsList((current) =>
      current.filter(
        (metric) => metric.innovationMetricId !== row.innovationMetricId
      )
    );
  }

  const handleMetricsAdd = (values) => {
    setMetricsList((current) => [...current, values]);
  };

  useEffect(() => {
    function setCurrentFormValues() {
      if (innovationObjectivesClassificationData) {
        if (
          !isLoadinginnovationObjectivesClassificationData &&
          !isLoadingInovationType &&
          !isLoadingInnovationClass &&
          !isLoadingInnovationTechnology &&
          !isLoadingReportingFrequency &&
          !isLoadingInnovationObjectivesData
        ) {
          formik.setValues({
            innovationType:
              innovationObjectivesClassificationData.data.innovationTypeId,
            innovationClass:
              innovationObjectivesClassificationData.data.innovationClassId,
            innovationTechnology:
              innovationObjectivesClassificationData.data
                .innovationTechnologyId,
            whatMakesThisInnovative:
              innovationObjectivesClassificationData.data
                .whatMakesThisInnovative,
            phcProblemBeingSolved:
              innovationObjectivesClassificationData.data.phcProblemBeingSolved,
            estimatedImpact:
              innovationObjectivesClassificationData.data.estimatedImpact,
            reportingFrequency:
              innovationObjectivesClassificationData.data.reportingFrequencyId,
          });

          if (
            innovationObjectivesData.data &&
            innovationObjectivesData.data.length > 0
          ) {
            const allObjectives = [];
            for (const objectiveData of innovationObjectivesData.data) {
              const objective = {
                id: objectiveData.id,
                innovationId: objectiveData.innovationId,
                innovationObjectiveDescription:
                  objectiveData.innovationObjectiveDescription,
              };
              allObjectives.push(objective);
            }
            setObjectivesList(allObjectives);
          }
          if (
            innovationMetricsData.data &&
            innovationMetricsData.data.length > 0
          ) {
            const allMetrics = [];
            for (const metricData of innovationMetricsData.data) {
              const metric = {
                id: metricData.id,
                innovationId: metricData.innovationId,
                innovationMetricId: {
                  lookupItemId: metricData.innovationMetricId,
                  lookupItemName: metricData.innovationMetricName,
                },
                innovationTargetGroupId: {
                  lookupItemId: metricData.innovationTargetGroupId,
                  lookupItemName: metricData.innovationTargetGroupName,
                },
                innovationTarget: metricData.innovationTarget,
              };
              allMetrics.push(metric);
            }
            setMetricsList(allMetrics);
          }
        }
      }
    }
    setCurrentFormValues();
  }, [
    isLoadinginnovationObjectivesClassificationData,
    isLoadingInovationType,
    isLoadingInnovationClass,
    isLoadingInnovationTechnology,
    isLoadingReportingFrequency,
    innovationTypeData,
    innovationClassData,
    innovationTechnologyData,
    reportingFrequencyData,
    innovationObjectivesData,
  ]);

  const handleActionChange = useCallback(
    (event) => {
      onActionChange({ id: 0, status: 1 });
    },
    [onActionChange]
  );

  return (
    <form onSubmit={formik.handleSubmit}>
      <React.Fragment>
        <Grid item md={12}>
          <Typography variant="h3" gutterBottom display="inline">
            Objectives & Classification
          </Typography>
        </Grid>
        <Grid item md={12} mt={5}>
          <Divider my={6} />
        </Grid>
        <Card mb={12}>
          <CardContent>
            <Grid item md={12}>
              <Grid item md={4}>
                <TextField
                  name="innovationType"
                  label="Innovation Type"
                  select
                  value={formik.values.innovationType}
                  error={Boolean(
                    formik.touched.innovationType &&
                      formik.errors.innovationType
                  )}
                  fullWidth
                  helperText={
                    formik.touched.innovationType &&
                    formik.errors.innovationType
                  }
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  variant="outlined"
                  my={2}
                >
                  <MenuItem disabled value="">
                    Innovation Type
                  </MenuItem>
                  {!isLoadingInovationType
                    ? innovationTypeData.data.map((option) => (
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
                  name="innovationClass"
                  label="Innovation Class"
                  select
                  value={formik.values.innovationClass}
                  error={Boolean(
                    formik.touched.innovationClass &&
                      formik.errors.innovationClass
                  )}
                  fullWidth
                  helperText={
                    formik.touched.innovationClass &&
                    formik.errors.innovationClass
                  }
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  variant="outlined"
                  my={2}
                >
                  <MenuItem disabled value="">
                    Innovation Class
                  </MenuItem>
                  {!isLoadingInnovationClass
                    ? innovationClassData.data.map((option) => (
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
                  name="innovationTechnology"
                  label="Innovation Technology"
                  select
                  value={formik.values.innovationTechnology}
                  error={Boolean(
                    formik.touched.innovationTechnology &&
                      formik.errors.innovationTechnology
                  )}
                  fullWidth
                  helperText={
                    formik.touched.innovationTechnology &&
                    formik.errors.innovationTechnology
                  }
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  variant="outlined"
                  my={2}
                >
                  <MenuItem disabled value="">
                    Innovation Technology
                  </MenuItem>
                  {!isLoadingInnovationTechnology
                    ? innovationTechnologyData.data.map((option) => (
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
            <Grid item md={12}>
              <TextField
                name="whatMakesThisInnovative"
                label="What Makes This an Innovation"
                value={formik.values.whatMakesThisInnovative}
                error={Boolean(
                  formik.touched.whatMakesThisInnovative &&
                    formik.errors.whatMakesThisInnovative
                )}
                fullWidth
                helperText={
                  formik.touched.whatMakesThisInnovative &&
                  formik.errors.whatMakesThisInnovative
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                rows={4}
                multiline
                my={2}
              />
            </Grid>
            <Grid item md={12}>
              <TextField
                name="phcProblemBeingSolved"
                label="What PHC Problem Does It Solve and How"
                value={formik.values.phcProblemBeingSolved}
                error={Boolean(
                  formik.touched.phcProblemBeingSolved &&
                    formik.errors.phcProblemBeingSolved
                )}
                fullWidth
                helperText={
                  formik.touched.phcProblemBeingSolved &&
                  formik.errors.phcProblemBeingSolved
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                rows={4}
                multiline
                my={2}
              />
            </Grid>

            <Grid item md={12}>
              <TextField
                name="estimatedImpact"
                label="Estimated Impact and Target Group"
                value={formik.values.estimatedImpact}
                error={Boolean(
                  formik.touched.estimatedImpact &&
                    formik.errors.estimatedImpact
                )}
                fullWidth
                helperText={
                  formik.touched.estimatedImpact &&
                  formik.errors.estimatedImpact
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                rows={4}
                multiline
                my={2}
              />
            </Grid>

            <Grid item md={12}>
              <TextField
                name="reportingFrequency"
                label="Reporting Frequency"
                select
                value={formik.values.reportingFrequency}
                error={Boolean(
                  formik.touched.reportingFrequency &&
                    formik.errors.reportingFrequency
                )}
                fullWidth
                helperText={
                  formik.touched.reportingFrequency &&
                  formik.errors.reportingFrequency
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
              >
                <MenuItem disabled value="">
                  Reporting Frequency
                </MenuItem>
                {!isLoadingReportingFrequency
                  ? reportingFrequencyData.data.map((option) => (
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
            <br />
            <Grid container spacing={12} pt={10}>
              <Grid item md={12}>
                <Typography variant="h3" gutterBottom display="inline">
                  Objectives
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={12}>
              <Grid item md={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOpenAddObjectives(true)}
                >
                  <AddIcon /> Add Objective
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={12}>
              <Grid item md={12}>
                <Paper>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Objective Description</TableCell>
                        <TableCell align="right">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {objectivesList.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell component="th" scope="row">
                            {row.innovationObjectiveDescription}
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              startIcon={<TrashIcon />}
                              size="small"
                              onClick={() => removeObjective(row)}
                            ></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={12} pt={10}>
              <Grid item md={12}>
                <Typography variant="h3" gutterBottom display="inline">
                  Metrics
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={12}>
              <Grid item md={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOpenAddMetrics(true)}
                >
                  <AddIcon /> Add Metric
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={12} pt={10}>
              <Grid item md={12}>
                <Paper>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">Innovation Metric</TableCell>
                        <TableCell align="left">Target Group</TableCell>
                        <TableCell align="left">Target Number</TableCell>
                        <TableCell align="left">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {metricsList.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell component="th" scope="row">
                            {row.innovationMetricId.lookupItemName}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {row.innovationTargetGroupId.lookupItemName}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {row.innovationTarget}
                          </TableCell>
                          <TableCell align="left">
                            <Button
                              startIcon={<TrashIcon />}
                              size="small"
                              onClick={() => removeMetrics(row)}
                            ></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            </Grid>
            <br />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              mt={3}
              onClick={() => handleActionChange()}
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
          </CardContent>
        </Card>
        <Dialog
          fullWidth={true}
          maxWidth="md"
          open={openAddObjectives}
          onClose={() => setOpenAddObjectives(false)}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Objective Details</DialogTitle>
          <DialogContent>
            <ObjectiveDetailsForm handleClick={handleObjectiveAdd} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddObjectives(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          fullWidth={true}
          maxWidth="md"
          open={openAddMetrics}
          onClose={() => setOpenAddMetrics(false)}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Metric Details</DialogTitle>
          <DialogContent>
            <MetricDetailsForm handleClick={handleMetricsAdd} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddMetrics(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </form>
  );
};

export default InnvationObjectives;
