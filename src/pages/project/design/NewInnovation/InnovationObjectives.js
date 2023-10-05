import React, { useState } from "react";
import { MenuItem } from "@mui/material";

import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  CircularProgress,
  Dialog,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper as MuiPaper,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { Check } from "react-feather";
import styled from "@emotion/styled";
import { getLookupMasterItemsByName } from "../../../../api/lookup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getObjectiveByProcessLevelItemId,
  newProjectObjectives,
} from "../../../../api/project-objectives";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);
const Paper = styled(MuiPaper)(spacing);

const innovationMetricsInitial = {
  innovationTargetGroup: "",
  reportingFrequency: "",
  innovationMetric: "",
};

const StaffDetailsForm = ({
  isLoadinginnovationTargetGroup,
  innovationtargetGroupData,
  isLoadingreportingFrequency,
  reportingFrequencyData,
  isLoadingInovationMetric,
  innovationMetricData,
  handleClick,
}) => {
  const formik = useFormik({
    initialValues: innovationMetricsInitial,
    validationSchema: Yup.object().shape({
      reportingFrequency: Yup.object().required("Required"),
      innovationTargetGroup: Yup.object().required("Required"),
      innovationMetric: Yup.object().required("Required"),
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
                name="innovationMetric"
                label="Innovation Metric"
                select
                value={formik.values.innovationMetric}
                error={Boolean(
                  formik.touched.innovationMetric &&
                    formik.errors.innovationMetric
                )}
                fullWidth
                helperText={
                  formik.touched.innovationMetric &&
                  formik.errors.innovationMetric
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
              >
                <MenuItem disabled value="">
                  Innovation Metric
                </MenuItem>
                {!isLoadingInovationMetric
                  ? innovationMetricData.data.map((option) => (
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
                name="innovationTargetGroup"
                label="Target Group"
                select
                multiple
                value={formik.values.innovationTargetGroup}
                error={Boolean(
                  formik.touched.innovationTargetGroup &&
                    formik.errors.innovationTargetGroup
                )}
                fullWidth
                helperText={
                  formik.touched.innovationTargetGroup &&
                  formik.errors.innovationTargetGroup
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
                  ? innovationtargetGroupData.data.map((option) => (
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
                {!isLoadingreportingFrequency
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

const InnvationObjectives = ({ id, processLevelTypeId }) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [InnovationMetricsArray, setInnovationMetricsArray] = useState([]);
  const [whatMakesInnovation, setWhatMakesInnovation] = useState("");
  const [phcProblemSolved, setPhcProblemSolved] = useState("");
  const [estimatedImpact, setEstimatedImpact] = useState("");
  const [targetGroup, setTargetGroup] = useState("");
  const [innovationObjectives, setInnovationObjectives] = useState([]);
  const [innovationMetrics, setInnovationMetrics] = useState("");
  const [reportingFrequency, setReportingFrequency] = useState("");

  const { isLoading: isLoadingInovationType, data: innovationTypeData } =
    useQuery(["innovationType", "InnovationType"], getLookupMasterItemsByName, {
      refetchOnWindowFocus: false,
    });

  const { isLoading: isLoadingInovationClass, data: innovationClassData } =
    useQuery(
      ["innovationClass", "InnovationClass"],
      getLookupMasterItemsByName,
      {
        refetchOnWindowFocus: false,
      }
    );

  const {
    isLoading: isLoadingInovationTechnology,
    data: innovationTechnologyData,
  } = useQuery(
    ["innovationTechnology", "InnovationTechnology"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const { isLoading: isLoadingInovationMetric, data: innovationMetricData } =
    useQuery(
      ["innovationMetric", "InnovationMetric"],
      getLookupMasterItemsByName,
      {
        refetchOnWindowFocus: false,
      }
    );

  const {
    isLoading: isLoadinginnovationTargetGroup,
    data: innovationtargetGroupData,
  } = useQuery(
    ["innovationTargetGroup", "InnovationTargetGroup"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const {
    isLoading: isLoadingreportingFrequency,
    data: reportingFrequencyData,
  } = useQuery(
    ["reportingFrequency", "ReportingFrequency"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const initialValues = {
    objective: "",
    innovationType: "",
    innovationClass: "",
    innovationTechnology: "",
    whatMakesInnovation: "",
    phcProblemSolved: "",
    estimatedImpact: "",
    innovationTargetGroup: "",
    innovationObjectives: [],
    innovationMetric: "",
    reportingFrequency: "",
  };

  const { data, isLoading } = useQuery(
    ["getObjectiveByProcessLevelItemId", id],
    getObjectiveByProcessLevelItemId
  );

  const mutation = useMutation({ mutationFn: newProjectObjectives });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      objective: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const innovationObjective = {
          code: !isLoading && data.data.length > 0 ? data.data.length + 1 : 1,
          objective: values.objective,
          processLevelItemId: id,
          processLevelTypeId: processLevelTypeId,
          createDate: new Date(),
        };
        await mutation.mutateAsync(innovationObjective);
        await queryClient.invalidateQueries([
          "getObjectiveByProcessLevelItemId",
        ]);
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

  const handleClick = (values) => {
    setInnovationMetricsArray((current) => [...current, values]);
  };

  function removeMetric(row) {
    setInnovationMetricsArray((current) =>
      current.filter(
        (metric) => metric.innovationMetric !== row.innovationMetric
      )
    );
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card mb={12}>
        <CardContent>
          {/* {formik.isSubmitting ? (
            <Box display="flex" justifyContent="center" my={6}>
              <CircularProgress />
            </Box>
          ) : ( */}
          <>
            <Grid container spacing={12}>
              <Grid item md={12}>
                <Typography variant="h3" gutterBottom display="inline">
                  Innovation Objectives
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={6}>
              <Grid item md={6}>
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
                {!isLoadingInovationClass
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
                {!isLoadingInovationTechnology
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
            <TextField
              name="whatMakesInnovation"
              label="What Makes This an Innovation"
              value={whatMakesInnovation}
              onChange={(e) => setWhatMakesInnovation(e.target.value)}
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              my={2}
            />
            <TextField
              name="phcProblemSolved"
              label="What PHC Problem Does It Solve and How"
              value={phcProblemSolved}
              onChange={(e) => setPhcProblemSolved(e.target.value)}
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              my={2}
            />
            <TextField
              name="estimatedImpact"
              label="Estimated Impact and Target Group"
              value={estimatedImpact}
              onChange={(e) => setEstimatedImpact(e.target.value)}
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              my={2}
            />
            <Grid container spacing={12}>
              <Grid item md={12}>
                <Typography variant="h3" gutterBottom display="inline">
                  Innovation Metric
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={12}>
              <Grid item md={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOpen(true)}
                >
                  <AddIcon /> Add Innovation Metric
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={12}>
              <Grid item md={12}>
                <Paper>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Innovation Metric</TableCell>
                        <TableCell align="right">Target Group</TableCell>
                        <TableCell align="right">Reporting Frequency</TableCell>
                        <TableCell align="right">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {InnovationMetricsArray.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell component="th" scope="row">
                            {row.innovationMetric.lookupItemName}
                          </TableCell>
                          <TableCell align="right">
                            {row.innovationClass.lookupItemName}
                          </TableCell>
                          <TableCell align="right">
                            {row.reportingFrequency.lookupItemName}
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => removeMetric(row)}
                            >
                              <DeleteIcon />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            </Grid>
            <br />
            <Button type="submit" variant="contained" color="primary" mt={3}>
              <Check /> Save changes
            </Button>
          </>
        </CardContent>
      </Card>
      <Dialog
        fullWidth={true}
        maxWidth="md"
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Innovation Metric</DialogTitle>
        <DialogContent>
          <DialogContentText>Add Innovation Metrics</DialogContentText>
          <StaffDetailsForm
            innovationMetricData={innovationMetricData}
            isLoadingInovationMetric={isLoadingInovationMetric}
            isLoadinginnovationTargetGroup={isLoadinginnovationTargetGroup}
            innovationtargetGroupData={innovationtargetGroupData}
            reportingFrequencyData={reportingFrequencyData}
            isLoadingreportingFrequency={isLoadingreportingFrequency}
            handleClick={handleClick}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default InnvationObjectives;
